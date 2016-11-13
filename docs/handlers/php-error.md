---
title: PHP Error Handler
---

If your Slim Framework application throws a
[PHP Runtime error](http://php.net/manual/en/class.error.php) (PHP 7+ only),
the application invokes its PHP Error handler and returns a
`HTTP/1.1 500 Internal Server Error` response to the HTTP client.

## Default PHP Error handler

Each Slim Framework application has a default PHP Error handler. This handler
sets the Response status to `500`, it sets the content type to `text/html`,
and it writes a simple explanation to the Response body.

## Custom PHP Error handler

A Slim Framework application's PHP Error handler is a Pimple service. You can
substitute your own PHP Error handler by defining a custom Pimple factory
method with the application container.

{% highlight php %}
// Create Slim
$app = new \Slim\App();
// get the app's di-container
$c = $app->getContainer();
$c['phpErrorHandler'] = function ($c) {
    return function ($request, $response, $error) use ($c) {
        return $c['response']
            ->withStatus(500)
            ->withHeader('Content-Type', 'text/html')
            ->write('Something went wrong!');
    };
};
{% endhighlight %}

> **N.B** Check out [Not Found](/docs/handlers/not-found.html) docs for
> pre-slim creation method using a new instance of `\Slim\Container`

In this example, we define a new `phpErrorHandler` factory that returns a
callable. The returned callable accepts three arguments:

1. A `\Psr\Http\Message\ServerRequestInterface` instance
2. A `\Psr\Http\Message\ResponseInterface` instance
3. A `\Throwable` instance

The callable **MUST** return a new `\Psr\Http\Message\ResponseInterface`
instance as is appropriate for the given error.
