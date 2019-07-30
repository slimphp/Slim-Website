---
title: Routing Middleware
---

The routing has been implemented as middleware. We are still using [FastRoute](https://github.com/nikic/FastRoute) as the default router but it is not tightly coupled to it.
If you wanted to implement another routing library you could by creating your own implementations of the routing interfaces. `DispatcherInterface`, `RouteCollectorInterface`, `RouteParserInterface` and `RouteResolverInterface` which create a bridge between Slim's components and the routing library.
If you were using `determineRouteBeforeAppMiddleware`, you need to add the `Middleware\RoutingMiddleware` middleware to your application just before your call run() to maintain the previous behaviour.

## Usage
```php
<?php
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

// Add Routing Middleware
$app->addRoutingMiddleware();

// ...

$app->run();
```
