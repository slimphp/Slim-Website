---
title: Error Handling Middleware
---

Things go wrong. You can't predict errors, but you can anticipate them. Each Slim Framework application has an error handler that receives all uncaught PHP exceptions. This error handler also receives the current HTTP request and response objects, too. The error handler must prepare and return an appropriate Response object to be returned to the HTTP client.

## Usage
```php
<?php
use Slim\Factory\AppFactory;
use Slim\Middleware\ErrorMiddleware;
use Slim\Middleware\RoutingMiddleware;

require __DIR__ . '/vendor/autoload.php';

$app = AppFactory::create();

/*
 * The routing middleware should be added earlier than the ErrorMiddleware
 * Otherwise exceptions thrown from it will not be handled by the middleware
 */
$routeResolver = $app->getRouteResolver();
$routingMiddleware = new RoutingMiddleware($routeResolver);
$app->add($routingMiddleware);

/**
 * The constructor of ErrorMiddleware takes in 5 parameters
 * @param CallableResolverInterface $callableResolver -> CallableResolver implementation of your choice
 * @param ResponseFactoryInterface $responseFactory -> ResponseFactory implementation of your choice
 * @param bool $displayErrorDetails -> Should be set to false in production
 * @param bool $logErrors -> Parameter is passed to the default ErrorHandler
 * @param bool $logErrorDetails -> Display error details in error log
 * which can be replaced by a callable of your choice.
 * Note: This middleware should be added last. It will not handle any exceptions/errors
 * for middleware added after it.
 */
$callableResolver = $app->getCallableResolver();
$responseFactory = $app->getResponseFactory();
$errorMiddleware = new ErrorMiddleware($callableResolver, $responseFactory, true, true, true);
$app->add($errorMiddleware);

...

$app->run();
```

## Adding Custom Error Handlers
You can now map custom handlers for any type of Exception or Throwable
```php
<?php
use Slim\Factory\AppFactory;
use Slim\Middleware\ErrorMiddleware;
use Slim\Psr7\Response;

require __DIR__ . '/vendor/autoload.php';

$app = AppFactory::create();

$callableResolver = $app->getCallableResolver();
$responseFactory = $app->getResponseFactory();
$errorMiddleware = new ErrorMiddleware($callableResolver, $responseFactory, true, true, true);

$handler = function ($request, $exception, $displayErrorDetails, $logErrors, $logErrorDetails) {
    $payload = ['error' => $exception->getMessage()];
    
    $response = new Response();
    $response->getBody()->write($payload);
    
    return $response;
}

$errorMiddleware->setErrorHandler(MyNamedException::class, $handler);
$app->add($errorMiddleware);

...

$app->run();
```

## Error Logging
If you would like to pipe in custom error logging to the default **ErrorHandler** that ships with Slim you can simply extend it and stub the **logError()** method.

```php
<?php
namespace MyApp\Handlers;

use Slim\Handlers\ErrorHandler;

class MyErrorHandler extends ErrorHandler {
    public function logError($error)
    {
        // Insert custom error logging function.
    }
}
```

```php
<?php
use MyApp\Handlers\MyErrorHandler;
use Slim\Factory\AppFactory;
use Slim\Middleware\ErrorMiddleware;

require __DIR__ . '/vendor/autoload.php';

$app = AppFactory::create();
$callableResolver = $app->getCallableResolver();
$responseFactory = $app->getResponseFactory();

$myErrorHandler = new MyErrorHandler(true); // Constructor parameter is $logErrors (bool)
$errorMiddleware = new ErrorMiddleware($callableResolver, $responseFactory, true, true, true);
$errorMiddleware->setDefaultErrorHandler($myErrorHandler);
$app->add($errorMiddleware);

...

$app->run();
```

## Error Handling/Rendering
The rendering is finally decoupled from the handling. Everything still works the way it previously did. It will still detect the content-type and render things appropriately with the help of **ErrorRenderers**. The core **ErrorHandler** extends the **AbstractErrorHandler** class which has been completely refactored. By default it will call the appropriate **ErrorRenderer** for the supported content types. Someone can now provide their custom error renderer by extending the **AbstractErrorHandler** class and overloading the protected **renderer** variable from the parent. 

```php
<?php
use Slim\Error\Renderers\AbstractErrorRenderer;

class MyCustomErrorRenderer extends AbstractErrorRenderer
{
    public function render()
    {
        return 'My awesome format';
    }
}
```

```php
<?php
use Slim\Handlers\ErrorHandler;

class MyCustomErrorHandler extends ErrorHandler
{
    protected $renderer = MyCustomErrorRenderer::class;
}
```

## New HTTP Exceptions
We have added named HTTP exceptions within the application. These exceptions work nicely with the native renderers. They can each have a **description** and **title** attribute as well to provide a bit more insight when the native HTML renderer is invoked. 

The base class **HttpSpecializedException** extends **Exception** and comes with the following sub classes:
* HttpBadRequestException
* HttpForbiddenException
* HttpInternalServerErrorException
* HttpNotAllowedException
* HttpNotFoundException
* HttpNotImplementedException
* HttpUnauthorizedException

You can extend the **HttpSpecializedException** class if they need any other response codes that we decide not to provide with the base repository. Example if you wanted a 504 gateway timeout exception that behaves like the native ones you would do the following:
I
```php
class HttpForbiddenException extends HttpException
{
    protected $code = 504;
    protected $message = 'Gateway Timeout.';
    protected $title = '504 Gateway Timeout';
    protected $description = 'Timed out before receiving response from the upstream server.';
}
```
