---
title: Method Overriding Middleware
---

The Method Overidding Middleware enables you to use the `X-Http-Method-Override` request header or the request body parameter `_METHOD` to override an incoming request's method. The middleware should be placed after the routing middleware has been added.

## Usage
```php
use Slim\App;
use Slim\Middleware\MethodOverrideMiddleware;
use Slim\Middleware\RoutingMiddleware;

$app = new App();

$defaultRouter = $app->getRouter();
$routingMiddleware = new RoutingMiddleware($defaultRouter);
$app->add($routingMiddleware);

$methodOverrideMiddleware = new MethodOverrideMiddleware();
$app->add($methodOverrideMiddleware);

...
$app->run();
```
