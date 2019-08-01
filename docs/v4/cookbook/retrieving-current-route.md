---
title: Retrieving Current Route
---

If you ever need to get access to the current route within your application all you have to do is call the request class' `getAttribute` method with an argument of `'route'` and it will return the current route, which is an instance of the `Slim\Route` class.

From there you can get the route's name by using `getName()` or get the methods supported by this route via `getMethods()`, etc.

 Note: If you need to access the route from within your app middleware you must set `'determineRouteBeforeAppMiddleware'` to true in your configuration otherwise `getAttribute('route')` will return null. Also `getAttribute('route')` will return null on non existent routes.

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
 
// ...
 
$app->run();
```
