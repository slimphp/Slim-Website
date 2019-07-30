---
title: Method Overriding Middleware
---

The Method Overidding Middleware enables you to use the `X-Http-Method-Override` request header or the request body parameter `_METHOD` to override an incoming request's method. The middleware should be placed after the routing middleware has been added.

## Usage
```php
<?php
use Slim\Factory\AppFactory;
use Slim\Middleware\MethodOverrideMiddleware;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

// Add RoutingMiddleware before we add the MethodOverrideMiddleware so the method is overrode before routing is done
$app->addRoutingMiddleware();

// Add MethodOverride middleware
$methodOverrideMiddleware = new MethodOverrideMiddleware();
$app->add($methodOverrideMiddleware);

// ...

$app->run();
```
