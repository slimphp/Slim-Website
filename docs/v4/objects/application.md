---
title: Application
---

The Application, (or `Slim\App`) is the entry point to your Slim application and is used to register the routes that link to your callbacks or controllers.

```php
// instantiate the App object
$app = new \Slim\App();

// Add route callbacks
$app->get('/', function ($request, $response, $args) {
    return $response->withStatus(200)->write('Hello World!');
});

// Run application
$app->run();
```

## Notices and Warnings Handling

`Warnings` and `Notices` are not caught by default. If you wish your application to display an error page when they happen, you will need to implement code similar to the following `index.php`.

```php
<?php
require __DIR__ . '/../vendor/autoload.php';
    
use Slim\App;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Handlers\ErrorHandler;
use Slim\Middleware\RoutingMiddleware;
use Slim\Middleware\ErrorMiddleware;
use Slim\Psr7\Factory\ResponseFactory;
use Slim\Psr7\Factory\ServerRequestFactory;
use Slim\Psr7\Factory\StreamFactory;
use Slim\ResponseEmitter;

try {
    $responseFactory = new ResponseFactory();
    $app = new App($responseFactory);
    
    $request = new ServerRequest(ServerRequestFactory::createFromGlobals());
    
    $routingMiddleware = new RoutingMiddleware($app->getRouter());
    $app->add($routingMiddleware);

    $systemErrorHandler = function ($type, $message, $file, $line) use ($request) {
        /**
         * You can add more detail to the error message with $type, $file and $line
         * this is just for example purposes
        */
        throw new HttpInternalServerErrorException($request, $message);
    };
    set_error_handler($systemErrorHandler, E_ALL);

    $errorMiddleware = new ErrorMiddleware($app->getCallableResolver(), $responseFactory, $displayErrorDetails, false, false);
    $errorHandler = $errorMiddleware->getDefaultErrorHandler();
    
    $app->add($errorMiddleware);

    ...add routes here...

    $response = $app->handle($request);
} catch (HttpInternalServerErrorException $e) {
    $response = $errorHandler->__invoke($e->getRequest(), $e, $displayErrorDetails, false, false);
} finally {
    $responseEmitter = new ResponseEmitter();
    $responseEmitter->emit($response);
}
```