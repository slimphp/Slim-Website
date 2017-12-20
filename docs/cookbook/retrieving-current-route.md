---
title: Retrieving Current Route
---

If you ever need to get access to the current route within your application all you have to do is call the request class' `getAttribute` method with an argument of `'route'` and it will return the current route, which is an instance of the `Slim\Route` class.

From there you can get the route's name by using `getName()` or get the methods supported by this route via `getMethods()`, etc.

 Note: If you need to access the route from within your app middleware you must set `'determineRouteBeforeAppMiddleware'` to true in your configuration otherwise `getAttribute('route')` will return null. Also `getAttribute('route')` will return null on non existent routes.

Example:
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
