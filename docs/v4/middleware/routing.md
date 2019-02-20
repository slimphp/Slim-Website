---
title: Routing Middleware
---

The routing has been implemented as middleware. We are still using [FastRoute](https://github.com/nikic/FastRoute) as the default router.
We provide an instantiation of FastRoute via the App::getRouter() method out of the box. You will need to instantiate and add the RoutingMiddleware in order for the app to work.
If you were using `determineRouteBeforeAppMiddleware`, you need to add the `Middleware\RoutingMiddleware`e middleware to your application just before your call run() to maintain the previous behaviour.

## Usage
```php
use Slim\App;
use Slim\Middleware\RoutingMiddleware;

$app = new App();

$defaultRouter = $app->getRouter();
$routingMiddleware = new RoutingMiddleware($defaultRouter);
$app->add($routingMiddleware);

...
$app->run();
```
