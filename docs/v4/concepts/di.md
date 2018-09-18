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

require_once __DIR__.'/vendor/autoload.php';

$settings = [];
$container = new \DI\Container(); // Example PHP-DI Implementation

// Important: The App constructor signature from Slim 3 to Slim 4 has changed
// Slim 3 Constructor: App::__construct(ContainerInterface $container);
// Slim 4 Constructor: App::__construct(array $settings = [], ContainerInterface $container);
$app = new \Slim\App($settings, $container);
```

Add a service to your container:

```php
$container = $app->getContainer();
$container->set('myService', function ($container) {
    $myService = new MyService();
    return $myService;
});
```

You can fetch services from your container explicitly or implicitly.
You can fetch an explicit reference to the container instance from inside a Slim
application route like this:

```php
/**
 * Example GET route
 *
 * @param  \Psr\Http\Message\ServerRequestInterface $req  PSR7 request
 * @param  \Psr\Http\Message\ResponseInterface      $res  PSR7 response
 * @param  array                                    $args Route parameters
 *
 * @return \Psr\Http\Message\ResponseInterface
 */
$app->get('/foo', function ($req, $res, $args) {
    $myService = $this->get('myService');

    return $res;
});
```

You can implicitly fetch services from the container like this:

```php
/**
 * Example GET route
 *
 * @param  \Psr\Http\Message\ServerRequestInterface $req  PSR7 request
 * @param  \Psr\Http\Message\ResponseInterface      $res  PSR7 response
 * @param  array                                    $args Route parameters
 *
 * @return \Psr\Http\Message\ResponseInterface
 */
$app->get('/foo', function ($req, $res, $args) {
    $myService = $this->myService;

    return $res;
});
```

To test if a service exists in the container before using it, use the `has()` method, like this:

```php
/**
 * Example GET route
 *
 * @param  \Psr\Http\Message\ServerRequestInterface $req  PSR7 request
 * @param  \Psr\Http\Message\ResponseInterface      $res  PSR7 response
 * @param  array                                    $args Route parameters
 *
 * @return \Psr\Http\Message\ResponseInterface
 */
$app->get('/foo', function ($req, $res, $args) {
    if($this->has('myService')) {
        $myService = $this->myService;
    }

    return $res;
});
```
