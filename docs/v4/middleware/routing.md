---
title: Routing Middleware
---

The routing has been implemented as middleware. We are still using [FastRoute](https://github.com/nikic/FastRoute) as the default router but it is not tightly coupled to it.
If you wanted to implement another routing library you could by creating your own implementations of the routing interfaces. `DispatcherInterface`, `RouteCollectorInterface`, `RouteParserInterface` and `RouteResolverInterface` which create a bridge between Slim's components and the routing library.
You will need to instantiate an implementation of a `RouteResolverInterface` and pass it to the `RoutingMiddleware` constructor in order to instantiate the middleware. We provide our own implementation via `$app->getRouteResolver()`
If you were using `determineRouteBeforeAppMiddleware`, you need to add the `Middleware\RoutingMiddleware`e middleware to your application just before your call run() to maintain the previous behaviour.

## Usage
```php
<?php
use Slim\Factory\AppFactory;
use Slim\Middleware\RoutingMiddleware;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$routeResolver = $app->getRouteResolver();
$routingMiddleware = new RoutingMiddleware($routeResolver);
$app->add($routingMiddleware);

...

$app->run();
```
