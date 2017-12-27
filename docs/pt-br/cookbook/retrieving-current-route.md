---
title: Recuperando a rota atual
---

Se você precisar acessar a rota atual em seu aplicativo, basta chamar o método 'getAttribute' da classe de solicitação com um argumento de `'route' 'e ele retornará a rota atual, que é uma instância da classe `Slim\Route`.

A partir daí, você pode obter o nome da rota usando `getName()` ou obter os métodos suportados por esta rota via `getMethods ()`, etc.

  Nota: Se você precisa acessar a rota a partir do middleware do seu aplicativo, você deve configurar `'eterminRouteBeforeAppMiddleware 'para verdadeiro na sua configuração, caso contrário,` getAttribute ('route') `retornará nulo. Também `getAttribute('route')` retornará nulo em rotas inexistentes.

Exemplo:
```php
use Slim\App;
use Slim\Exception\NotFoundException;
use Slim\Http\Request;
use Slim\Http\Response;

$app = new App([
    'settings' => [
        // Only set this if you need access to route within middleware
        'determineRouteBeforeAppMiddleware' => true
    ]
]);

// routes...
$app->add(function (Request $request, Response $response, callable $next) {
    $route = $request->getAttribute('route');

    // return NotFound for non existent route
    if (empty($route)) {
        throw new NotFoundException($request, $response);
    }

    $name = $route->getName();
    $groups = $route->getGroups();
    $methods = $route->getMethods();
    $arguments = $route->getArguments();

    // do something with that information

    return $next($request, $response);
});
```
