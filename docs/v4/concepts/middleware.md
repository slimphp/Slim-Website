---
title: Middleware
---

You can run code _before_ and _after_ your Slim application to manipulate the Request and Response objects as you see fit. 
This is called _middleware_.
Why would you want to do this? 
Perhaps you want to protect your app from cross-site request forgery. 
Maybe you want to authenticate requests before your app runs. 
Middleware is perfect for these scenarios.

## What is middleware?

Middleware is a layer that sits between the client 
request and the server response in a web application.
It intercepts, processes, and potentially alters HTTP requests 
and responses as they pass through the application pipeline. 

A middleware can handle a variety of tasks such as authentication, 
authorization, logging, request modification, response transformation, 
error handling, and more. 

Each middleware performs its function and then passes control 
to the next middleware in the chain, enabling a modular and reusable 
approach to handling cross-cutting concerns in web applications.

## How does middleware work?

Different frameworks use middleware differently. 
Slim adds middleware as concentric layers surrounding your core application. 
Each new middleware layer surrounds any existing middleware layers. 
The concentric structure expands outwardly as additional middleware layers are added.

The last middleware layer added is the first to be executed.

When you run the Slim application, the Request object traverses the middleware structure from the outside in. 
They first enter the outermost middleware, then the next outermost middleware, (and so on), until they ultimately arrive at the Slim application itself. 
After the Slim application dispatches the appropriate route, the resultant Response object exits the Slim application and traverses the middleware structure from the inside out. 
Ultimately, a final Response object exits the outermost middleware, is serialized into a raw HTTP response, and is returned to the HTTP client. 
Here's a diagram that illustrates the middleware process flow:

<div style="padding: 2em 0; text-align: center">
    <img src="/docs/v4/images/middleware.png" alt="Middleware architecture" style="max-width: 80%;"/>
</div>

## How do I write middleware?

Middleware is a callable that accepts two arguments: a `Request` object and a `RequestHandler` object. 
Each middleware **MUST** return an instance of  `Psr\Http\Message\ResponseInterface`.

### Closure middleware

This example middleware is a Closure.

```php
<?php

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

/**
 * Example middleware closure
 *
 * @param  Request        $request PSR-7 request
 * @param  RequestHandler $handler PSR-15 request handler
 *
 * @return ResponseInterface
 */
$beforeMiddleware = function (Request $request, RequestHandler $handler) use ($app) {
    $response = $handler->handle($request);
    $existingContent = (string) $response->getBody();

    $response = $app->getResponseFactory()->createResponse();
    $response->getBody()->write('BEFORE' . $existingContent);

    return $response;
};

$afterMiddleware = function ($request, $handler) {
    $response = $handler->handle($request);
    $response->getBody()->write('AFTER');
    return $response;
};

$app->add($beforeMiddleware);
$app->add($afterMiddleware);

// ...

$app->run();
```

### Invokable class middleware

This example middleware is an invokable class that implements the magic `__invoke()` method.

```php
<?php

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Psr\Http\Message\ResponseInterface as Response;

class ExampleBeforeMiddleware
{
    /**
     * Example middleware invokable class
     *
     * @param  Request        $request PSR-7 request
     * @param  RequestHandler $handler PSR-15 request handler
     *
     * @return Response
     */
    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        $response = $handler->handle($request);
        $existingContent = (string) $response->getBody();
    
        $response = new Response();
        $response->getBody()->write('BEFORE' . $existingContent);
    
        return $response;
    }
}
```

```php
<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

class ExampleAfterMiddleware
{
    /**
     * Example middleware invokable class
     *
     * @param  Request        $request PSR-7 request
     * @param  RequestHandler $handler PSR-15 request handler
     *
     * @return Response
     */
    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        $response = $handler->handle($request);
        $response->getBody()->write('AFTER');
        return $response;
    }
}
```

### PSR-15 middleware

[PSR-15](https://www.php-fig.org/psr/psr-15/#22-psrhttpservermiddlewareinterface) 
is a standard that defines common interfaces for HTTP server 
request handlers and middleware components.

Slim provides built-in support for PSR-15 middleware.

**Key Interfaces**

* `Psr\Http\Server\MiddlewareInterface`: This interface defines the **process** method that middleware must implement.
* `Psr\Http\Server\RequestHandlerInterface`: An HTTP request handler that process an HTTP request in order to produce an HTTP response.

To create a PSR-15 middleware class, you need to implement the `MiddlewareInterface`.

Below is an example of a simple PSR-15 middleware:

```php
<?php

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

class ExampleMiddleware implements MiddlewareInterface
{
    public function process(Request $request, RequestHandler $handler): Response
    {
        // Handle the incoming request
        // ...

        // Invoke the next middleware and get response
        $response = $handler->handle($request);

        // Handle the outgoing response
        // ...

        return $response;
    }
}

```

Incoming requests can be authenticated, authorized, logged, validated, or modified. 

Outgoing responses can be logged, transformed, compressed, or have additional headers added.

### Registering middleware

To use a middleware, you need to register each middleware on the Slim **$app**, a route or a route group.

```php
// Add middleware to the App
$app->add(new ExampleMiddleware());

// Add middleware to the App using dependency injection
$app->add(ExampleMiddleware::class);

// Add middleware to a route
$app->get('/', function () { ... })->add(new ExampleMiddleware());

// Add middleware to a route group
$app->group('/', function () { ... })->add(new ExampleMiddleware());

```

### Middleware execution order

Slim processes middleware in a Last In, First Out (LIFO) order. 
This means the last middleware added is the first one to be executed. 
If you add multiple middleware components, 
they will be executed in the reverse order of their addition.

```php
$app->add(new MiddlewareOne());
$app->add(new MiddlewareTwo());
$app->add(new MiddlewareThree());
```

In this case, `MiddlewareThree` will be executed first, 
followed by `MiddlewareTwo`, and finally `MiddlewareOne`.

### Route middleware

Route middleware is invoked _only if_ its route matches the current HTTP request method and URI. 
Route middleware is specified immediately after you invoke any of the Slim application's routing methods (e.g., **get()** or **post()**). 
Each routing method returns an instance of **\Slim\Route**, and this class provides the same middleware interface as the Slim application instance. 
Add middleware to a Route with the Route instance's **add()** method. 
This example adds the Closure middleware example above:

```php
<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$mw = function (Request $request, RequestHandler $handler) {
    $response = $handler->handle($request);
    $response->getBody()->write('World');

    return $response;
};

$app->get('/', function (Request $request, Response $response, $args) {
    $response->getBody()->write('Hello ');

    return $response;
})->add($mw);

$app->run();
```

This would output this HTTP response body:

```bash
Hello World
```

### Group middleware

In addition to the overall application, and standard routes being able to accept middleware, the **group()** multi-route definition functionality, also allows individual routes internally. 
Route group middleware is invoked _only if_ its route matches one of the defined HTTP request methods and URIs from the group. 
To add middleware within the callback, and entire-group middleware to be set by chaining **add()** after the **group()** method.

Sample Application, making use of callback middleware on a group of url-handlers.

```php
<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Factory\AppFactory;
use Slim\Routing\RouteCollectorProxy;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$app->get('/', function (Request $request, Response $response) {
    $response->getBody()->write('Hello World');
    return $response;
});

$app->group('/utils', function (RouteCollectorProxy $group) {
    $group->get('/date', function (Request $request, Response $response) {
        $response->getBody()->write(date('Y-m-d H:i:s'));
        return $response;
    });
    
    $group->get('/time', function (Request $request, Response $response) {
        $response->getBody()->write((string)time());
        return $response;
    });
})->add(function (Request $request, RequestHandler $handler) use ($app) {
    $response = $handler->handle($request);
    $dateOrTime = (string) $response->getBody();

    $response = $app->getResponseFactory()->createResponse();
    $response->getBody()->write('It is now ' . $dateOrTime . '. Enjoy!');

    return $response;
});

$app->run();
```

When calling the **/utils/date** method, this would output a string similar to the below.

```bash
It is now 2015-07-06 03:11:01. Enjoy!
```

Visiting **/utils/time** would output a string similar to the below.

```bash
It is now 1436148762. Enjoy!
```

But visiting **/** *(domain-root)*, would be expected to generate the following output as no middleware has been assigned.

```bash
Hello World
```

### Passing variables from middleware
The easiest way to pass attributes from middleware is to use the request's attributes.

Setting the variable in the middleware:

```php
$request = $request->withAttribute('foo', 'bar');
```

Getting the variable in the route callback:

```php
$foo = $request->getAttribute('foo');
```

## Finding available middleware

You may find a PSR-15 Middleware class already written that will satisfy your needs. 
Here are a few unofficial lists to search.

* [Middleware for Slim Framework v4.x wiki](https://github.com/slimphp/Slim/wiki/Middleware-for-Slim-Framework-v4.x)
* [middlewares/awesome-psr15-middlewares](https://github.com/middlewares/awesome-psr15-middlewares)
