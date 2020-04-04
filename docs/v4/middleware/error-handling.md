---
title: Error Handling Middleware
---

Things go wrong. You can't predict errors, but you can anticipate them. Each Slim Framework application has an error handler that receives all uncaught PHP exceptions. This error handler also receives the current HTTP request and response objects, too. The error handler must prepare and return an appropriate Response object to be returned to the HTTP client.

## Usage
```php
<?php
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

/**
 * The routing middleware should be added earlier than the ErrorMiddleware
 * Otherwise exceptions thrown from it will not be handled by the middleware
 */
$app->addRoutingMiddleware();

/**
 * @param bool $displayErrorDetails -> Should be set to false in production
 * @param bool $logErrors -> Parameter is passed to the default ErrorHandler
 * @param bool $logErrorDetails -> Display error details in error log
 * which can be replaced by a callable of your choice.
 * @param \Psr\Log\LoggerInterface $logger -> Optional PSR-3 logger to receive errors
 * 
 * Note: This middleware should be added last. It will not handle any exceptions/errors
 * for middleware added after it.
 */
$errorMiddleware = $app->addErrorMiddleware(true, true, true, $logger);

// ...

$app->run();
```

## Adding Custom Error Handlers
You can now map custom handlers for any type of Exception or Throwable.
```php
<?php
use Psr\Http\Message\ServerRequestInterface;
use Psr\Log\LoggerInterface;
use Slim\Factory\AppFactory;
use Slim\Psr7\Response;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

// Add Routing Middleware
$app->addRoutingMiddleware();

// Define Custom Error Handler
$customErrorHandler = function (
    ServerRequestInterface $request,
    Throwable $exception,
    bool $displayErrorDetails,
    bool $logErrors,
    bool $logErrorDetails,
    ?LoggerInterface $logger = null
) use ($app) {
    $logger->error($exception->getMessage());

    $payload = ['error' => $exception->getMessage()];

    $response = $app->getResponseFactory()->createResponse();
    $response->getBody()->write(
        json_encode($payload, JSON_UNESCAPED_UNICODE)
    );

    return $response;
};

// Add Error Middleware
$errorMiddleware = $app->addErrorMiddleware(true, true, true, $logger);
$errorMiddleware->setDefaultErrorHandler($customErrorHandler);

// ...

$app->run();
```

## Error Logging
If you would like to pipe in custom error logging to the default `ErrorHandler` that ships with Slim, there are two ways to do it.

With the first method, you can simply extend `ErrorHandler` and stub the `logError()` method.

```php
<?php
namespace MyApp\Handlers;

use Slim\Handlers\ErrorHandler;

class MyErrorHandler extends ErrorHandler
{
    protected function logError(string $error): void
    {
        // Insert custom error logging function.
    }
}
```

```php
<?php
use MyApp\Handlers\MyErrorHandler;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

// Add Routing Middleware
$app->addRoutingMiddleware();

// Instantiate Your Custom Error Handler
$myErrorHandler = new MyErrorHandler($app->getCallableResolver(), $app->getResponseFactory());

// Add Error Middleware
$errorMiddleware = $app->addErrorMiddleware(true, true, true);
$errorMiddleware->setDefaultErrorHandler($myErrorHandler);

// ...

$app->run();
```

With the second method, you can supply a logger that conforms to the
[PSR-3 standard](https://www.php-fig.org/psr/psr-3/), such as one from the popular
[Monolog](https://github.com/Seldaek/monolog/) library.

```php
<?php
use MyApp\Handlers\MyErrorHandler;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

// Add Routing Middleware
$app->addRoutingMiddleware();

// Instantiate Logger
// $logger = ...

// Add Error Middleware with Logger
$errorMiddleware = $app->addErrorMiddleware(true, true, true, $logger);

// ...

$app->run();
```

## Error Handling/Rendering
The rendering is finally decoupled from the handling.
It will still detect the content-type and render things appropriately with the help of `ErrorRenderers`.
The core `ErrorHandler` extends the `AbstractErrorHandler` class which has been completely refactored.
By default it will call the appropriate `ErrorRenderer` for the supported content types. The core
`ErrorHandler` defines renderers for the following content types:
- `application/json`
- `application/xml` and `text/xml`
- `text/html`
- `text/plain`

For any content type you can register your own error renderer. So first define a new error renderer
that implements `\Slim\Interfaces\ErrorRendererInterface`.

```php
<?php
use Slim\Interfaces\ErrorRendererInterface;

class MyCustomErrorRenderer implements ErrorRendererInterface
{
    public function __invoke(Throwable $exception, bool $displayErrorDetails): string
    {
        return 'My awesome format';
    }
}
```

And then register that error renderer in the core error handler. In the example below we
will register the renderer to be used for `text/html` content types.
```php
<?php
use MyApp\Handlers\MyErrorHandler;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

// Add Routing Middleware
$app->addRoutingMiddleware();

// Add Error Middleware
$errorMiddleware = $app->addErrorMiddleware(true, true, true);

// Get the default error handler and register my custom error renderer.
$errorHandler = $errorMiddleware->getDefaultErrorHandler();
$errorHandler->registerErrorRenderer('text/html', MyCustomErrorRenderer::class);

// ...

$app->run();
```

### Force a specific content type for error rendering
By default, the error handler tries to detect the error renderer using the `Accept` header of the
request. If you need to force the error handler to use a specific error renderer you can 
write the following.

```php
$errorHandler->forceContentType('application/json');
```

## New HTTP Exceptions
We have added named HTTP exceptions within the application. These exceptions work nicely with the native renderers. They can each have a `description` and `title` attribute as well to provide a bit more insight when the native HTML renderer is invoked. 

The base class `HttpSpecializedException` extends `Exception` and comes with the following sub classes:
* HttpBadRequestException
* HttpForbiddenException
* HttpInternalServerErrorException
* HttpNotAllowedException
* HttpNotFoundException
* HttpNotImplementedException
* HttpUnauthorizedException

You can extend the `HttpSpecializedException` class if they need any other response codes that we decide not to provide with the base repository. Example if you wanted a 504 gateway timeout exception that behaves like the native ones you would do the following:
```php
class HttpForbiddenException extends HttpException
{
    protected $code = 504;
    protected $message = 'Gateway Timeout.';
    protected $title = '504 Gateway Timeout';
    protected $description = 'Timed out before receiving response from the upstream server.';
}
```
