---
title: Configurando CORS
---

CORS - Cross origin resource sharing (compartilhamento de recursos de origem cruzada)

Um bom fluxograma para implementar o suporte CORS Referência:

[Fluxograma do servidor CORS] (http://www.html5rocks.com/static/images/cors_server_flowchart.png)

Você pode testar o suporte CORS aqui: http://www.test-cors.org/

Você pode ler as especificações aqui: https://www.w3.org/TR/cors/


## A solução simples

Para pedidos CORS simples, o servidor só precisa adicionar o seguinte cabeçalho à sua resposta:

`Access-Control-Allow-Origin: <domain>, ... | *`

O código a seguir deve permitir CORS preguiçoso.

```php
$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
});

$app->add(function ($req, $res, $next) {
    $response = $next($req, $res);
    return $response
            ->withHeader('Access-Control-Allow-Origin', 'http://mysite')
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
});

```



## Access-Control-Allow-Methods

O seguinte middleware pode ser usado para consultar o roteador do Slim e obter uma lista de métodos que um determinado padrão implementa.

Aqui está um exemplo completo de aplicação:

```php
require __DIR__ . "/vendor/autoload.php";

// Esta configuração Slim é necessária para que o middleware funcione
$app = new Slim\App([
    "settings"  => [
        "determineRouteBeforeAppMiddleware" => true,
    ]
]);

// Este é o middleware
// Adicionará o cabeçalho do Access-Control-Allow-Methods a cada solicitação

$app->add(function($request, $response, $next) {
    $route = $request->getAttribute("route");

    $methods = [];

    if (!empty($route)) {
        $pattern = $route->getPattern();

        foreach ($this->router->getRoutes() as $route) {
            if ($pattern === $route->getPattern()) {
                $methods = array_merge_recursive($methods, $route->getMethods());
            }
        }
        //Methods holds all of the HTTP Verbs that a particular route handles.
    } else {
        $methods[] = $request->getMethod();
    }
    
    $response = $next($request, $response);


    return $response->withHeader("Access-Control-Allow-Methods", implode(",", $methods));
});

$app->get("/api/{id}", function($request, $response, $arguments) {
});

$app->post("/api/{id}", function($request, $response, $arguments) {
});

$app->map(["DELETE", "PATCH"], "/api/{id}", function($request, $response, $arguments) {
});

// Preste atenção nisso quando estiver usando algum framework de front-end do javascript e você estiver usando grupos em slim php
$app->group('/api', function () {
    // Devido ao comportamento dos navegadores ao enviar a solicitação PUT ou DELETE, você deve adicionar o método OPTIONS. Leia sobre o teste prévio.
    $this->map(['PUT', 'OPTIONS'], '/{user_id:[0-9]+}', function ($request, $response, $arguments) {
        // Seu codigo aqui...
    });
});

$app->run();
```

Um grande agradecimento a [tuupola] (https://github.com/tuupola) por ter chegado com isso!

