---
title: Upgrade Guide
---

If you are upgrading from version 3 to version 4, these are the significant changes that
you need to be aware of.

## New PHP version
Slim 4 requires PHP 7.1+

## Breaking changes to Slim\App constructor function signature
Slim's App settings used to be a part of the container and they have now been decoupled from it.
```php
// Slim 3 Implementation
// Constructor: App::__construct($container = [])
// As seen here the settings used to be nested
$app = new App([
    'settings' => [...],
]);

// Slim 4 Implementation
// App::__construct(array $settings = [], ContainerInterface $container)
$container = new Container(); // Any PSR-11 Implementation
$settings = [...];
$app = new App($settings, $container);
```

## Changes to Container
Slim no longer has a Container so you need to supply your own. If you were relying on request or response being in the container, then you need to either set them to a container yourself, or refactor. Also, `App`'s `__call()` method has been removed, so accessing a container property via $app->key_name() no longer works.

## New Middleware Approach
In Slim 4 we wanted to give more flexibility to the developers by decoupling some of Slim's App core functionality and implementing it as middleware. This gives you the ability to swap in custom implementations of the core components.

## Middleware Execution
Middleware execution has not changed and is still Last In First Out (LIFO) like in Slim 3.

## New Routing Middleware
The routing has been implemented as middleware. We are still using [FastRoute](https://github.com/nikic/FastRoute) by default.
We provide an instantiation of FastRouter via the App::getRouter() method out of the box. You will need to instantiate and add the RoutingMiddleware in order for the app to work.
If you were using `determineRouteBeforeAppMiddleware`, you need to add the `Middleware\RoutingMiddlewar`e middleware to your application just before your call run() to maintain the previous behaviour.
See [Pull Request #2288](https://github.com/slimphp/Slim/pull/2288) for more information

```php
use Slim\App;
use Slim\Middleware\RoutingMiddleware;

$app = new App();

$defaultRouter = $app->getRouter();
$routingMiddleware = new RoutingMiddleware($defaultRouter);
$app->add($routingMiddleware);
```

## New Error Handling Middleware
Error handling has also been implemented as middleware.
For custom handlers, logging and more see full documentation [here](/docs/handlers/error.html).
See [Pull Request #2398](https://github.com/slimphp/Slim/pull/2398) for more information
```php
use Slim\App;
use Slim\Middleware\ErrorMiddleware;
use Slim\Middleware\RoutingMiddleware;

$app = new App();

/*
 * The routing middleware should be added earlier than the ErrorMiddleware
 * Otherwise exceptions thrown from it will not be handled by the middleware
 */
$routingMiddleware = new RoutingMiddleware($app->getRouter());
$app->add($routingMiddleware);

/*
 * The constructor of `ErrorMiddleware` takes in 4 parameters
 * @param CallableResolverInterface $callableResolver -> Callable Resolver Interface of your choice
 * @param bool $displayErrorDetails -> Should be set to false in production
 * @param bool $logErrors -> Parameter is passed to the default ErrorHandler
 * @param bool $logErrorDetails -> Display error details in error log
 * which can be replaced by a callable of your choice.
 * Note: This middleware should be added last. It will not handle any exceptions/errors
 * for middleware added after it.
 */
$callableResolver = $app->getCallableResolver();
$errorMiddleware = new ErrorMiddleware($callableResolver, true, true, true);
$app->add($errorMiddleware);

...
$app->run();
```

## New Dispatcher & Routing Results
We created a wrapper around the FastRoute dispatcher which adds a result wrapper and access to a route's full list of allowed methods instead of only having access to those when an exception arises.
The Request attribute `routeInfo` is now deprecated and replaced with `routingResults`.
See [Pull Request #2405](https://github.com/slimphp/Slim/pull/2405) for more information
```php
use Slim\App;

$app = new App();
$app->get('/foo', function (Request $request, Response $response) {
    $routingResults = $request->getAttribute('routingResults');
    $uri = $routingResults->getUri();
    $method = $routingResults->getMethod();
    $routeArguments = $routingResults->getRouteArguments();
    
    // A route's allowed methods are available at all times now and not only when an error arises like in Slim 3
    $allowedMethods = $routingResults->getAllowedMethods();
});
```

## New Method Overriding Middleware
If you were overriding the HTTP method using either the custom header or the body param, you need to add the `Middleware\MethodOverrideMiddleware` middleware to be able to override the method like before.
See [Pull Request #2329](https://github.com/slimphp/Slim/pull/2329) for more information
```php
use Slim\App;

$app = new App();
$methodOverridingMiddleware = new MethodOverridingMiddleware();
$app->add($methodOverridingMiddleware);
```
