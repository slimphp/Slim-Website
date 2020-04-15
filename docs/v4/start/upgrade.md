---
title: Upgrade Guide
---

If you are upgrading from version 3 to version 4, these are the significant changes that
you need to be aware of.

## PHP Version Requirement
Slim 4 requires **PHP 7.2 or newer**.

## Breaking changes to Slim\App constructor
Slim's App settings used to be a part of the container and they have now been decoupled from it.
```php
/**
 * Slim 3 App::__construct($container = [])
 * As seen here the settings used to be nested
 */
$app = new App([
    'settings' => [...],
]);

/**
 * Slim 4 App::__constructor() method takes 1 mandatory parameter and 4 optional parameters
 * 
 * @param ResponseFactoryInterface Any implementation of a ResponseFactory
 * @param ContainerInterface|null Any implementation of a Container
 * @param CallableResolverInterface|null Any implementation of a CallableResolver
 * @param RouteCollectorInterface|null Any implementation of a RouteCollector
 * @param RouteResolverInterface|null Any implementation of a RouteResolver
 */
$app = new App(...);
```

## Removed App Settings
- `addContentLengthHeader` See [Content Length Middleware](/docs/v4/middleware/content-length.html) for new implementation of this setting.
- `determineRouteBeforeAppMiddleware` Position [Routing Middleware](/docs/v4/middleware/routing.html) at the right position in your middleware stack to replicate existing behavior.
- `outputBuffering` See [Output Buffering Middleware](/docs/v4/middleware/output-buffering.html) for new implementation of this setting.
- `displayErrorDetails` See [Error Handling Middleware](/docs/v4/middleware/error-handling.html) for new implementation of this setting.

## Changes to Container
Slim no longer has a Container so you need to supply your own. If you were relying on request or response being in the container, then you need to either set them to a container yourself, or refactor. Also, `App::__call()` method has been removed, so accessing a container property via `$app->key_name()` no longer works.
```php
/**
 * Slim 3.x shipped with the Pimple container implementation and enabled the following synthax
 */
$container = $app->getContainer();

//Assign dependencies as array
$container['view'] = function (\Psr\Container\ContainerInterface $container){
    return new \Slim\Views\Twig('');
};


/**
 * Slim 4.x does not ship with a container library. It supports all PSR-11 implementations such as PHP-DI
 * To install PHP-DI `composer require php-di/php-di`
 */

use Slim\Factory\AppFactory;

$container = new \DI\Container();

AppFactory::setContainer($container);
$app = AppFactory::create();

$container = $app->getContainer();
$container->set('view', function(\Psr\Container\ContainerInterface $container){
    return new \Slim\Views\Twig('');
});
```

## Changes to base path handling
Up to v3, Slim extracted the base path from the folder where the application was instantiated. This is no longer the case, and the base path must be explicitly declared [in case your application is not executed from the root of your domain](/docs/v4/start/web-servers.html#run-from-a-sub-directory):
```php
use Slim\Factory\AppFactory;
// ...
$app = AppFactory::create();
$app->setBasePath('/my-app-subpath');
// ...
$app->run();
```

## Changes to Routing components
The `Router` component from Slim 3 has been split into multiple different components in order to decouple FastRoute from the `App` core and offer more flexibility to the end user. It has been split into
`RouteCollector`, `RouteParser` and `RouteResolver`. Those 3 components can all have their respective interfaces which you can implement on your own and inject into
the `App` constructor. The following pull requests offer a lot of insight on the public interfaces of these new components:
- [Pull Request #2604](https://github.com/slimphp/Slim/pull/2604)
- [Pull Request #2622](https://github.com/slimphp/Slim/pull/2622)
- [Pull Request #2639](https://github.com/slimphp/Slim/pull/2639)
- [Pull Request #2640](https://github.com/slimphp/Slim/pull/2640)
- [Pull Request #2641](https://github.com/slimphp/Slim/pull/2641)
- [Pull Request #2642](https://github.com/slimphp/Slim/pull/2642)

This also means that [Route Groups](/docs/v4/objects/routing.html#route-groups) have changed their signatures:
```php
$app->group('/user', function(\Slim\Routing\RouteCollectorProxy $app){
    $app->get('', function() { /* ... */ });
    //...
});
```

## New Middleware Approach
In Slim 4 we wanted to give more flexibility to the developers by decoupling some of Slim's App core functionality and implementing it as middleware. This gives you the ability to swap in custom implementations of the core components.

## Middleware Execution
Middleware execution has not changed and is still `Last In First Out (LIFO)` like in Slim 3.

## New App Factory
The `AppFactory` component was introduced to reduce some of the friction caused by decoupling the PSR-7 implementation from the `App` core. It detects which PSR-7
implementation and ServerRequest creator is installed in your project root and enables you to instantiate an app via `AppFactory::create()` and use `App::run()` without
having to pass in a `ServerRequest` object. The following PSR-7 implementations and ServerRequest creator combos are supported:
- [Slim PSR-7](https://github.com/slimphp/Slim-Psr7)
- [Nyholm PSR-7](https://github.com/Nyholm/psr7) and [Nyholm PSR-7 Server](https://github.com/Nyholm/psr7-server)
- [Guzzle PSR-7](https://github.com/guzzle/psr7) and [Guzzle HTTP Factory](https://github.com/http-interop/http-factory-guzzle)
- [Laminas Diactoros](https://github.com/laminas/laminas-diactoros)

## New Routing Middleware
The routing has been implemented as middleware. We are still using [FastRoute](https://github.com/nikic/FastRoute) for our routing needs.
If you were using `determineRouteBeforeAppMiddleware`, you need to add the `Middleware\RoutingMiddleware` middleware to your application just before you call `run()` to maintain the previous behaviour.
See [Pull Request #2288](https://github.com/slimphp/Slim/pull/2288) for more information.

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

## New Error Handling Middleware
Error handling has also been implemented as middleware.
See [Pull Request #2398](https://github.com/slimphp/Slim/pull/2398) for more information.
```php
<?php
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

/**
 * The routing middleware should be added before the ErrorMiddleware
 * Otherwise exceptions thrown from it will not be handled
 */
$app->addRoutingMiddleware();

/**
 * Add Error Handling Middleware
 *
 * @param bool $displayErrorDetails -> Should be set to false in production
 * @param bool $logErrors -> Parameter is passed to the default ErrorHandler
 * @param bool $logErrorDetails -> Display error details in error log
 * which can be replaced by a callable of your choice.
 
 * Note: This middleware should be added last. It will not handle any exceptions/errors
 * for middleware added after it.
 */
$app->addErrorMiddleware(true, true, true);

// ...

$app->run();
```


## New Not Found- and Not Allowed Handler

The [404 Not Found Handler](http://www.slimframework.com/docs/v3/handlers/not-found.html) and 
the [405 Not Allowed Handler](http://www.slimframework.com/docs/v3/handlers/not-allowed.html) from v3
can be migrated as follows: 

```php
<?php
use Psr\Http\Message\ServerRequestInterface;
use Slim\Factory\AppFactory;
use Slim\Exception\HttpNotFoundException;
use Slim\Psr7\Response;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$errorMiddleware = $app->addErrorMiddleware(true, true, true);

// Set the Not Found Handler
$errorMiddleware->setErrorHandler(
    HttpNotFoundException::class,
    function (ServerRequestInterface $request, Throwable $exception, bool $displayErrorDetails) {
        $response = new Response();
        $response->getBody()->write('404 NOT FOUND');

        return $response->withStatus(404);
    });

// Set the Not Allowed Handler
$errorMiddleware->setErrorHandler(
    HttpMethodNotAllowedException::class,
    function (ServerRequestInterface $request, Throwable $exception, bool $displayErrorDetails) {
        $response = new Response();
        $response->getBody()->write('405 NOT ALLOWED');

        return $response->withStatus(405);
    });
```

## New Dispatcher & Routing Results
We created a wrapper around the FastRoute dispatcher which adds a result wrapper and access to a route's full list of allowed methods instead of only having access to those when an exception arises.
The Request attribute `routeInfo` is now deprecated and replaced with `routingResults`.
See [Pull Request #2405](https://github.com/slimphp/Slim/pull/2405) for more information.
```php
<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use Slim\Routing\RouteContext;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$app->get('/hello/{name}', function (Request $request, Response $response) {
    $routeContext = RouteContext::fromRequest($request);
    $routingResults = $routeContext->getRoutingResults();
    
    // Get all of the route's parsed arguments e.g. ['name' => 'John']
    $routeArguments = $routingResults->getRouteArguments();
    
    // A route's allowed methods are available at all times now and not only when an error arises like in Slim 3
    $allowedMethods = $routingResults->getAllowedMethods();
    
    return $response;
});

// ...

$app->run();
```

## New Method Overriding Middleware
If you were overriding the HTTP method using either the custom header or the body param, you need to add the `Middleware\MethodOverrideMiddleware` middleware to be able to override the method like before.
See [Pull Request #2329](https://github.com/slimphp/Slim/pull/2329) for more information.
```php
<?php
use Slim\Factory\AppFactory;
use Slim\Middleware\MethodOverridingMiddleware;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$methodOverridingMiddleware = new MethodOverrideMiddleware();
$app->add($methodOverridingMiddleware);

// ...

$app->run();
```


## New Content Length Middleware
The Content Length Middleware will automatically append a `Content-Length` header to the response. This is to replace the `addContentLengthHeader` setting that was removed from Slim 3. This middleware should be placed on the center of the middleware stack so it gets executed last.
```php
<?php
use Slim\Factory\AppFactory;
use Slim\Middleware\ContentLengthMiddleware;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$contentLengthMiddleware = new ContentLengthMiddleware();
$app->add($contentLengthMiddleware);

// ...

$app->run();
```

## New Output Buffering Middleware
The Output Buffering Middleware enables you to switch between two modes of output buffering: `APPEND` (default) and `PREPEND` mode. The `APPEND` mode will use the existing response body to append the content while `PREPEND` mode will create a new response body and append it to the existing response. This middleware should be placed on the center of the middleware stack so it gets executed last.
```php
<?php
use Slim\Factory\AppFactory;
use Slim\Middleware\OutputBufferingMiddleware;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

/**
 * The two modes available are
 * OutputBufferingMiddleware::APPEND (default mode) - Appends to existing response body
 * OutputBufferingMiddleware::PREPEND - Creates entirely new response body
 */
$mode = OutputBufferingMiddleware::APPEND;
$outputBufferingMiddleware = new OutputBufferingMiddleware($mode);

// ...

$app->run();
```
