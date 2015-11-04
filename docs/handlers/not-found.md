---
title: 404 Not Found Handler
---

If your Slim Framework application does not have a route that matches the current HTTP request URI, the application invokes its Not Found handler and returns a `HTTP/1.1 404 Not Found` response to the HTTP client.

## Default Not Found handler

Each Slim Framework application has a default Not Found handler. This handler sets the Response status to `404`, it sets the content type to `text/html`, and it writes a simple explanation to the Response body.

## Custom Not Found handler

A Slim Framework application's Not Found handler is a Pimple service. You can substitute your own Not Found handler by defining a custom Pimple factory method with the application container.

{% highlight php %}
$c = new \Slim\Container(); //Create Your container

//Override the default Not Found Handler
$c['notFoundHandler'] = function ($c) {
    return function ($request, $response) use ($c) {
        return $c['response']
            ->withStatus(404)
            ->withHeader('Content-Type', 'text/html')
            ->write('Page not found');
    };
};

//Create Slim
$app = new \Slim\App($c);

//... Your code
{% endhighlight %}

In this example, we define a new `notFoundHandler` factory that returns a callable. The returned callable accepts two arguments:

1. A `\Psr\Http\Message\ServerRequestInterface` instance
2. A `\Psr\Http\Message\ResponseInterface` instance

The callable **MUST** return an appropriate `\Psr\Http\Message\ResponseInterface` instance.
