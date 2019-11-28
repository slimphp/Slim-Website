---
title: Retrieving Current Route
---

If you ever need to get access to the current route within your application, you will need to instantiate the `RouteContext` object using the incoming `ServerRequestInterface`.

From there you can get the route via `$routeContext->getRoute()` and access the route's name by using `getName()` or get the methods supported by this route via `getMethods()`, etc.

Note: If you need to access the `RouteContext` object during the middleware cycle before reaching the route handler you will need to add the `RoutingMiddleware` as the outermost middleware before the error handling middleware (See example below).

Example:
```php
<?php
use Slim\Factory\AppFactory;
use Slim\Routing\RouteContext;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

// Via this middleware you could access the route and routing results from the resolved route
$app->add(function (Request $request, RequestHandler $handler) {
    $routeContext = RouteContext::fromRequest($request);
    $route = $routeContext->getRoute();

    // return NotFound for non existent route
    if (empty($route)) {
        throw new NotFoundException($request, $response);
    }

    $name = $route->getName();
    $groups = $route->getGroups();
    $methods = $route->getMethods();
    $arguments = $route->getArguments();

    // ... do something with the data ...

    return $handler->handle($request);
});

// The RoutingMiddleware should be added after our CORS middleware so routing is performed first
$app->addRoutingMiddleware();
 
// The ErrorMiddleware should always be the outermost middleware
$app->addErrorMiddleware(true, true, true);

// ...
 
$app->run();
```
