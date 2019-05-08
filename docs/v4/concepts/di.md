---
title: Dependency Container
---

Slim uses a dependency container to prepare, manage, and inject application
dependencies. Slim supports containers that implement [PSR-11](http://www.php-fig.org/psr/psr-11/) or third-party containers like [Acclimate](https://github.com/jeremeamia/acclimate-container)
or [PHP-DI](http://php-di.org/doc/frameworks/slim.html).

## How to use the container

You don't _have_ to provide a dependency container. If you do, however, you must
inject the container instance into the Slim application's constructor.

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

You can fetch services from your container explicitly or implicitly.
You can fetch an explicit reference to the container instance from inside a Slim
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

    ...do something with $myService...

    return $response;
});
```

You can implicitly fetch services from the container like this:

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
    $myService = $this->myService;
    
    ...do something with $myService...

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
        $myService = $this->myService;
    }
    return $response;
});
```
