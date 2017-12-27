---
title: Guia de atualização
---

Se você estiver atualizando da versão 2 para a versão 3, estas são as mudanças significativas que
você precisa estar ciente.

## Nova versão do PHP
Slim 3 requer PHP 5.5+

## Class \Slim\Slim renomeou \Slim\App
Slim 3 usa `\Slim\App` para o objeto [Application] (/docs/objects/application.html) normalmente chamado `$app`.

```php
$app = new \Slim\App();
```

## Nova Função da Rota de Assinatura

```php
$app->get('/', function (Request $req,  Response $res, $args = []) {
    return $res->withStatus(400)->write('Bad Request');
});
```

## Os objetos de solicitação e resposta não são mais acessíveis através do objeto do aplicativo
Como mencionado acima, o Slim 3 passa os objetos `Request` e` Response` como argumentos para a função de tratamento de rotas. Uma vez que agora estão acessíveis diretamente no corpo de uma função de rota, `request` e` response` não são propriedades da instância `/Slim/App` ([Aplicação] (/docs/objects/application.html)).

## Obtendo variáveis _GET e _POST
```php
$app->get('/', function (Request $req,  Response $res, $args = []) {
    $myvar1 = $req->getParam('myvar'); // verifica tanto o _GET quanto o _POST [NÃO compatíveis com o PSR-7]
    $myvar2 = $req->getParsedBody()['myvar']; // verifica _POST [É compatível com PSR-7]
    $myvar3 = $req->getQueryParams()['myvar']; // verifica _GET [É compatível com PSR-7]
});
```


## Ganchos
Os ganchos já não fazem parte do Slim a partir da v3. Você deve considerar a reimplementação de qualquer funcionalidade associada aos [ganchos padrão no Slim v2] (http://docs.slimframework.com/hooks/defaults/) como [middleware] (/docs/concepts/middleware.html) em vez disso. Se você precisar da habilidade de aplicar ganchos personalizados em pontos arbitrários em seu código (por exemplo, dentro de uma rota), você deve considerar um pacote de terceiros como [EventDispatcher do Symfony] (http://symfony.com/doc/current /components/event_dispatcher/introduction.html) ou [EventManager do Zend Framework] (https://zend-eventmanager.readthedocs.org/en/latest/).

## Removal HTTP Cache
No Slim v3, removemos o HTTP-Caching em seu próprio módulo [Slim\Http\Cache] (https://github.com/slimphp/Slim-HttpCache).

## Remoção de Stop/Halt
Slim Core removeu Stop/Halt.
Em seus aplicativos, você deve fazer a transição para usar os métodos withStatus() e withBody().

## Remoção do carregador automático
`Slim::registerAutoloader()` foi removido, nós nos mudamos completamente ao compositor.

## Mudanças no recipiente
`$app->container->singleton(...)` é agora `$container = $app->getContainer(); $container ['...'] = function() {}; `Por favor, leia Pimple docs para mais informações

## Remoção de configureMode()
`$app->configureMode(...)` foi removido na v3.

## Remoção de PrettyExceptions
PrettyExceptions causa muitos problemas para muitas pessoas, então estas foram removidas.

## Route :: setDefaultConditions(...) foi removido
Nós trocamos roteadores que permitem que você mantenha as condições padrão regex dentro do padrão de rota.

## Mudanças no redirecionamento
No Slim v2.x, seria usada a função helper `$app->redirect();` para ativar uma solicitação de redirecionamento.
No Slim v3.x pode-se fazer o mesmo com a utilização da classe Response assim.

Exemplo:

```php
$app->get('/', function ($req, $res, $args) {
  return $res->withStatus(302)->withHeader('Location', 'your-new-uri');
});
```

## Assinatura Middleware
A assinatura do middleware mudou de uma classe para uma função.

Nova assinatura:

```php
use Psr\Http\Message\RequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

$app->add(function (Request $req,  Response $res, callable $next) {
    // Faça coisas antes de Require the Composer autoloader into your PHP script, and you are ready
to start using Slim.passar
    $newResponse = $next($req, $res);
    // Faça coisas após a rota ser renderizada
    return $newResponse; // continue
});
```

Você ainda pode usar uma classe:

```php
namespace My;

use Psr\Http\Message\RequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

class Middleware
{
    function __invoke(Request $req,  Response $res, callable $next) {
        // Faça coisas antes de passar
        $newResponse = $next($req, $res);
        // Faça coisas após a rota ser renderizada
        return $newResponse; // continue
    }
}


// Registar
$app->add(new My\Middleware());
// ou
$app->add(My\Middleware::class);

```


Execução do middleware
O middleware do aplicativo é executado como Last In First Excedido (LIFE).

## Mensagens instantâneas
As mensagens instantâneas não são mais uma parte do núcleo Slim v3, mas, em vez disso, foram movidas para separar o pacote [Slim Flash] (/ docs / features / flash.html).

## Biscoitos
Nos cookies do v3.0 foi removido do núcleo. Veja [Cookies FIG] (https://github.com/dflydev/dflydev-fig-cookies) para um componente de cookie compatível com o PSR-7.

## Remoção de Crypto
Na v3.0, removemos a dependência do cripto no núcleo.

## Novo Router
Slim agora utiliza [FastRoute] (https://github.com/nikic/FastRoute), um novo e mais potente roteador!

Isso significa que a especificação dos padrões de rota mudou com os parâmetros nomeados agora em chaves e colchetes usados para segmentos opcionais:

```php
// parâmetro nomeado:
$app->get('/hello/{name}', /*...*/);

// segmento opcional:
$app->get('/news[/{year}]', /*...*/);
```

## Route Middleware
A sintaxe para adicionar middleware de rota mudou ligeiramente.
Na v3.0:

```php
$app->get(…)->add($mw2)->add($mw1);
```

## Obtendo a rota atual
A rota é um atributo do objeto Pedido na v3.0:

```php
$request->getAttribute('route');
```

Ao obter a rota atual no middleware, o valor para `determineRouteBeforeAppMiddleware` 
deve ser definido como` true` na configuração do aplicativo, caso contrário a chamada 
getAttribute retorna 'null`.

## urlFor() é agora pathFor() no roteador

`urlFor()` foi renomeado `pathFor()` e pode ser encontrado no objeto `router`:

```php
$app->get('/', function ($request, $response, $args) {
    $url = $this->router->pathFor('home');
    $response->write("<a href='$url'>Home</a>");
    return $response;
})->setName('home');
```

Além disso, `pathFor()` é o caminho base do conhecimento.

## Container e DI ... Construindo
Slim usa Pimple como um Contentor de Injeção de Dependência.

```php

// index.php
$app = new Slim\App(
    new \Slim\Container(
        include '../config/container.config.php'
    )
);

// Slim irá pegar a classe Home do contêiner definido abaixo e executar seu método de índice.
// Se a classe não está definida no contêiner, Slim ainda irá construí-la e passar o contêiner como o primeiro argumento para o construtor!
$app->get('/', Home::class . ':index');


// Em container.config.php
// Estamos usando o SlimTwig aqui
return [
    'settings' => [
        'viewTemplatesDirectory' => '../templates',
    ],
    'twig' => [
        'title' => '',
        'description' => '',
        'author' => ''
    ],
    'view' => function ($c) {
        $view = new Twig(
            $c['settings']['viewTemplatesDirectory'],
            [
                'cache' => false // '../cache'
            ]
        );

        // Instantiate e adicione extensão específica Slim
        $view->addExtension(
            new TwigExtension(
                $c['router'],
                $c['request']->getUri()
            )
        );

        foreach ($c['twig'] as $name => $value) {
            $view->getEnvironment()->addGlobal($name, $value);
        }

        return $view;
    },
    Home::class => function ($c) {
        return new Home($c['view']);
    }
];

```

## Objetos PSR-7

### Solicitação, Resposta, Uri & UploadFile são imutáveis.
Isso significa que quando você muda um desses objetos, a instância antiga não é atualizada.

```php
// Isto está ERRADO. A mudança não irá passar.
$app->add(function (Request $request, Response $response, $next) {
    $request->withAttribute('abc', 'def');
    return $next($request, $response);
});

// Isto está certo.
$app->add(function (Request $request, Response $response, $next) {
    $request = $request->withAttribute('abc', 'def');
    return $next($request, $response);
});
```

### Os corpos das mensagens são fluxos

```php
// ...
$image = __DIR__ . '/huge_photo.jpg';
$body = new Stream($image);
$response = (new Response())
     ->withStatus(200, 'OK')
     ->withHeader('Content-Type', 'image/jpeg')
     ->withHeader('Content-Length', filesize($image))
     ->withBody($body);
// ...
```

Para texto:
```php
// ...
$response = (new Response())->getBody()->write('Oi Mundo!')

// Ou especifico Slim: não é compatível com o PSR-7.
$response = (new Response())->write('Oi Mundo!');
// ...
```
