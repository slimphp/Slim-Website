---
title: Route redirection
---

The following example shows how you can redirect to another route by its name.

```php
<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Routing\RouteContext;

$app->get('/bar', function (Request $request, Response $response, $args) {
    // ...
    return $response;
})->setName('bar');

$app->get('/foo', function (Request $request, Response $response, $args) {
    $routeContext = RouteContext::fromRequest($request);
    $location = $routeContext->getRouteParser()->urlFor('bar');
    return $response->withHeader('Location', $location)->withStatus(302);
});
```
