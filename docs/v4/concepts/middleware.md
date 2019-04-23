---
title: Middleware
---

You can run code _before_ and _after_ your Slim application to manipulate the
Request and Response objects as you see fit. This is called _middleware_.
Why would you want to do this? Perhaps you want to protect your app
from cross-site request forgery. Maybe you want to authenticate requests
before your app runs. Middleware is perfect for these scenarios.

## What is middleware?

A middleware implements the [PSR-15 Middleware Interface](https://www.php-fig.org/psr/psr-15/):

1. **Psr\Http\Message\ServerRequestInterface** - The PSR-7 request object
2. **Psr\Http\Server\RequestHandlerInterface** - The PSR-15 request handler object

It can do whatever is appropriate with these objects. The only hard requirement
is that a middleware **MUST** return an instance of  **Psr\Http\Message\ResponseInterface**.
Each middleware **SHOULD** invoke the next middleware and pass it Request and
Response objects as arguments.

## How does middleware work?

Different frameworks use middleware differently. Slim adds middleware as concentric
layers surrounding your core application. Each new middleware layer surrounds
any existing middleware layers. The concentric structure expands outwardly as
additional middleware layers are added.

The last middleware layer added is the first to be executed.

When you run the Slim application, the Request object traverses the
middleware structure from the outside in. They first enter the outer-most middleware,
then the next outer-most middleware, (and so on), until they ultimately arrive
at the Slim application itself. After the Slim application dispatches the
appropriate route, the resultant Response object exits the Slim application and
traverses the middleware structure from the inside out. Ultimately, a final
Response object exits the outer-most middleware, is serialized into a raw HTTP
response, and is returned to the HTTP client. Here's a diagram that illustrates
the middleware process flow:

<div style="padding: 2em 0; text-align: center">
    <img src="/docs/v4/images/middleware.png" alt="Middleware architecture" style="max-width: 80%;"/>
</div>

## How do I write middleware?

Middleware is a callable that accepts two arguments: a **Request object** and a **RequestHandler** object. Each middleware **MUST** return an instance of  **Psr\Http\Message\ResponseInterface**.

### Closure middleware example.

This example middleware is a Closure.

```php
<?php
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Factory\AppFactory;
use Slim\Psr7\Response;

$app = AppFactory::create();

/**
 * Example middleware closure
 *
 * @param  Psr\Http\Message\ServerRequestInterface $request PSR-7 request
 * @param  Psr\Http\Server\RequestHandlerInterface $handler PSR-15 request handler
 *
 * @return Psr\Http\Message\ResponseInterface
 */
$beforeMiddleware = function ($request, $handler) {
    $response = new Response();
    $response->getBody()->write('BEFORE');
    
    return $response;
};

$afterMiddleware function ($request, $handler) {
    $response = $handler->handle($request);
    $response->getBody()->write('AFTER');

    return $response;
};

$app->add($beforeMiddleware);
$app->add($afterMiddleware);
```

### Invokable class middleware example

This example middleware is an invokable class that implements the magic **__invoke()** method.

```php
<?php
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Psr7\Response;

class ExampleBeforeMiddleware
{
    /**
     * Example middleware invokable class
     *
     * @param  Psr\Http\Message\ServerRequestInterface $request PSR-7 request
     * @param  Psr\Http\Server\RequestHandlerInterface $handler PSR-15 request handler
     *
     * @return Psr\Http\Message\ResponseInterface
     */
    public function __invoke(ServerRequestInterface $request, RequestHandlerInterface $handler)
    {
        $response = new Response();
        $response->getBody()->write('BEFORE');
        
        return $response;
    }
}
```

```php
<?php
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
class ExampleAfterMiddleware
{
    /**
     * Example middleware invokable class
     *
     * @param  Psr\Http\Message\ServerRequestInterface $request PSR-7 request
     * @param  Psr\Http\Server\RequestHandlerInterface $handler PSR-15 request handler
     *
     * @return Psr\Http\Message\ResponseInterface
     */
    public function __invoke(ServerRequestInterface $request, RequestHandlerInterface $handler)
    {
        $response = $handler->handle($request);
        $response->getBody()->write('AFTER');
    
        return $response;
    }
}
```

To use these classes as a middleware, you can use **->add(new ExampleMiddleware());** function chain after the **$app**, **Route**,  or **group()**, which in the code below, any one of these, could represent $subject.

```php
<?php
use Slim\Factory\AppFactory;

$app = AppFactory::create();

$app->add(new ExampleBeforeMiddleware());
$app->add(new ExampleAfterMiddleware());
```

## How do I add middleware?

You may add middleware to a Slim application, to an individual Slim application route or to a route group. All scenarios accept the same middleware and implement the same middleware interface.

### Application middleware

Application middleware is invoked for every **incoming** HTTP request. Add application middleware with the Slim application instance's **add()** method. This example adds the Closure middleware example above:

```php
<?php
use Slim\Factory\AppFactory;

$app = AppFactory::create();

$app->add(function ($request, $handler) {
    $response = new Response();
    $response->getBody()->write('BEFORE');
    
    return $response;
});

$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    $response->getBody()->write('AFTER');

    return $response;
});

$app->get('/', function ($request, $response, $args) {
	$response->getBody()->write('Hello World');

	return $response;
});

$app->run();
```

This would output this HTTP response body:

```text
BEFORE Hello AFTER
```

### Route middleware

Route middleware is invoked _only if_ its route matches the current HTTP request method and URI. Route middleware is specified immediately after you invoke any of the Slim application's routing methods (e.g., **get()** or **post()**). Each routing method returns an instance of **\Slim\Route**, and this class provides the same middleware interface as the Slim application instance. Add middleware to a Route with the Route instance's **add()** method. This example adds the Closure middleware example above:

```php
<?php
use Slim\Factory\AppFactory;

$app = AppFactory::create();

$app->add(function ($request, $handler) {
    $response = new Response();
    $response->getBody()->write('World');
    
    return $response;
});

$app->get('/', function ($request, $response, $args) {
	$response->getBody()->write('Hello World');

	return $response;
})->add($mw);

$app->run();
```

This would output this HTTP response body:

Hello World

### Group Middleware

In addition to the overall application, and standard routes being able to accept middleware, the **group()** multi-route definition functionality, also allows individual routes internally. Route group middleware is invoked _only if_ its route matches one of the defined HTTP request methods and URIs from the group. To add middleware within the callback, and entire-group middleware to be set by chaining **add()** after the **group()** method.

Sample Application, making use of callback middleware on a group of url-handlers
```php
<?php
use Slim\Factory\AppFactory;
use Slim\Psr7\Response;

$app = AppFactory::create();

$app->get('/', function ($request, $response) {
    return $response->getBody()->write('Hello World');
});

$app->group('/utils', function () use ($app) {
    $app->get('/date', function ($request, $response) {
        return $response->getBody()->write(date('Y-m-d H:i:s'));
    });
    $app->get('/time', function ($request, $response) {
        return $response->getBody()->write(time());
    });
})->add(function ($request, $handler) {
    $response = $handler->handle($request);
    $dateOrTime = (string) $response->getBody();
    
    $response = new Response();
    $response->write('It is now ' . $dateOrTime . '. Enjoy!');
    
    return $response;
});
```

When calling the **/utils/date** method, this would output a string similar to the below

```text
It is now 2015-07-06 03:11:01. Enjoy!
```

visiting **/utils/time** would output a string similar to the below

```text
It is now 1436148762. Enjoy!
```

but visiting **/** *(domain-root)*, would be expected to generate the following output as no middleware has been assigned

```text
Hello World
```

### Passing variables from middleware
The easiest way to pass attributes from middleware is to use the request's
attributes.

Setting the variable in the middleware:

```php
$request = $request->withAttribute('foo', 'bar');
```

Getting the variable in the route callback:

```php
$foo = $request->getAttribute('foo');
```

## Finding available middleware

You may find a PSR-15 Middleware class already written that will satisfy your needs. Here are a few unofficial lists to search.

* [Middleware for Slim Framework v4.x wiki](https://github.com/slimphp/Slim/wiki/Middleware-for-Slim-Framework-v4.x)
* [middlewares/awesome-psr15-middlewares](https://github.com/middlewares/awesome-psr15-middlewares)
