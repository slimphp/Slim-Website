---
title: Dependency Container
---

Slim uses an optional dependency container to prepare, manage, and inject application
dependencies. Slim supports containers that implement [PSR-11](http://www.php-fig.org/psr/psr-11/) like [PHP-DI](http://php-di.org/doc/frameworks/slim.html).

## Example usage with PHP-DI

You don't _have_ to provide a dependency container. If you do, however, you must provide an instance of the container to `AppFactory` before creating an `App`.

```php
<?php
use DI\Container;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

// Create Container using PHP-DI
$container = new Container();

// Set container to create App with on AppFactory
AppFactory::setContainer($container);
$app = AppFactory::create();
```

Add a service to your container:

```php
$container->set('myService', function () {
    $settings = [...];
    return new MyService($settings);
});
```

You can fetch services from your container explicitly as well as from inside a Slim
application route like this:

```php
/**
 * Example GET route
 *
 * @param  ServerRequestInterface $request  PSR-7 request
 * @param  ResponseInterface      $response  PSR-7 response
 * @param  array                  $args Route parameters
 *
 * @return ResponseInterface
 */
$app->get('/foo', function (Request $request, Response $response, $args) {
    $myService = $this->get('myService');

    // ...do something with $myService...

    return $response;
});
```

To test if a service exists in the container before using it, use the `has()` method, like this:

```php
/**
 * Example GET route
 *
 * @param  ServerRequestInterface $request  PSR-7 request
 * @param  ResponseInterface      $response  PSR-7 response
 * @param  array                  $args Route parameters
 *
 * @return ResponseInterface
 */
$app->get('/foo', function (Request $request, Response $response, $args) {
    if ($this->has('myService')) {
        $myService = $this->get('myService');
    }
    return $response;
});
```

## Configuring the application via a container

In case you want to create the `App` with dependencies already defined in your container, 
you can use the `AppFactory::createFromContainer()` method.

**Example**

```php
<?php

use App\Factory\MyResponseFactory;
use DI\Container;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseFactoryInterface;
use Slim\Factory\AppFactory;

require_once __DIR__ . '/../vendor/autoload.php';

// Create Container using PHP-DI
$container = new Container();

// Add custom response factory
$container->set(ResponseFactoryInterface::class, function (ContainerInterface $container) {
    return new MyResponseFactory(...);
});

// Configure the application via container
$app = AppFactory::createFromContainer($container);

// ...

$app->run();
```

Supported `App` dependencies are:

* Psr\Http\Message\ResponseFactoryInterface
* Slim\Interfaces\CallableResolverInterface
* Slim\Interfaces\RouteCollectorInterface
* Slim\Interfaces\RouteResolverInterface
* Slim\Interfaces\MiddlewareDispatcherInterface
