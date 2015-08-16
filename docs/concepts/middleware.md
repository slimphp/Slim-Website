---
title: Middleware
---

You can run code _before_ and _after_ your Slim application to manipulate the
Request and Response objects as you see fit. This is called _middleware_.
Why would you want to do this? Perhaps you want to protect your app
from cross-site request forgery. Maybe you want to authenticate requests
before your app runs. Middleware is perfect for these scenarios.

## What is middleware?

Technically speaking, a middleware is a _callable_ that accepts three arguments:

1. `\Psr\Http\Message\ServerRequestInterface` - The PSR7 request object
2. `\Psr\Http\Message\ResponseInterface` - The PSR7 response object
3. `callable` - The next middleware callable

It can do whatever is appropriate with these objects. The only hard requirement
is that a middleware **MUST** return an instance of `\Psr\Http\Message\ResponseInterface`.
Each middleware **SHOULD** invoke the next middleware and pass it Request and
Response objects as arguments.

## How does middleware work?

Different frameworks use middleware differently. Slim adds middleware as concentric
layers surrounding your core application. Each new middleware layer surrounds
any existing middleware layers. The concentric structure expands outwardly as
additional middleware layers are added.

When you run the Slim application, the Request and Response objects traverse the
middleware structure from the outside in. They first enter the outer-most middleware,
then the next outer-most middleware, (and so on), until they ultimately arrive
at the Slim application itself. After the Slim application dispatches the
appropriate route, the resultant Response object exits the Slim application and
traverses the middleware structure from the inside out. Ultimately, a final
Response object exits the outer-most middleware, is serialized into a raw HTTP
response, and is returned to the HTTP client. Here's a diagram that illustrates
the middleware process flow:

<div style="padding: 2em 0; text-align: center">
    <img src="/docs/images/middleware.png" alt="Middleware architecture" style="max-width: 80%;"/>
</div>

## How do I write middleware?

Middleware is a callable that accepts three arguments: a Request object, a Response object, and the next middleware. Each middleware **MUST** return an instance of `\Psr\Http\Message\ResponseInterface`. This example middleware is a Closure.

{% highlight php %}
<?php
/**
 * Example middleware closure
 *
 * @param  \Psr\Http\Message\ServerRequestInterface $request  PSR7 request
 * @param  \Psr\Http\Message\ResponseInterface      $response PSR7 response
 * @param  callable                                 $next     Next middleware
 *
 * @return \Psr\Http\Message\ResponseInterface
 */
function ($request, $response, $next) {
    $response->getBody()->write('BEFORE');
    $response = $next($request, $response);
    $response->getBody()->write('AFTER');

    return $response;
};
{% endhighlight %}

This example middleware is an invokable class that implements the magic `__invoke()` method.

{% highlight php %}
<?php
class ExampleMiddleware
{
    /**
     * Example middleware invokable class
     *
     * @param  \Psr\Http\Message\ServerRequestInterface $request  PSR7 request
     * @param  \Psr\Http\Message\ResponseInterface      $response PSR7 response
     * @param  callable                                 $next     Next middleware
     *
     * @return \Psr\Http\Message\ResponseInterface
     */
    public function __invoke($request, $response, $next)
    {
        $response->getBody()->write('BEFORE');
        $response = $next($request, $response);
        $response->getBody()->write('AFTER');

        return $response;
    }
}
{% endhighlight %}

## How do I add middleware?

You may add middleware to a Slim application or to an individual Slim application route. Both scenarios accept the same middleware and implement the same middleware interface.

### Application middleware

Application middleware is invoked for every HTTP request. Add application middleware with the Slim application instance's `add()` method. This example adds the Closure middleware example above:

{% highlight php %}
<?php
$app = new \Slim\App();

$app->add(function ($request, $response, $next) {
    $response->getBody()->write('BEFORE');
    $response = $next($request, $response);
    $response->getBody()->write('AFTER');

    return $response;
});

$app->get('/', function ($req, $res, $args) {
    echo ' Hello ';
});

$app->run();
{% endhighlight %}

This would output this HTTP response body:

    BEFORE Hello AFTER

### Route middleware

Route middleware is invoked _only if_ its route matches the current HTTP request method and URI. Route middleware is specified immediately after you invoke any of the Slim application's routing methods (e.g., `get()` or `post()`). Each routing method returns an instance of `\Slim\Route`, and this class provides the same middleware interface as the Slim application instance. Add middleware to a Route with the Route instance's `add()` method. This example adds the Closure middleware example above:

{% highlight php %}
<?php
$app = new \Slim\App();

$mw = function ($request, $response, $next) {
    $response->getBody()->write('BEFORE');
    $response = $next($request, $response);
    $response->getBody()->write('AFTER');

    return $response;
};

$app->get('/', function ($req, $res, $args) {
    echo ' Hello ';
})->add($mw);

$app->run();
{% endhighlight %}

This would output this HTTP response body:

    BEFORE Hello AFTER
