---
title: Documentation
---

## Welcome

Slim is a PHP micro framework that helps you
quickly write simple yet powerful web applications and APIs. At its core, Slim
is a dispatcher that receives an HTTP request, invokes an appropriate callback
routine, and returns an HTTP response. That's it.

## What's the point?

Slim is an ideal tool to create APIs that consume, repurpose, or publish data. Slim is also
a great tool for rapid prototyping. Heck, you can even build full-featured web
applications with user interfaces. More importantly, Slim is super fast
and has very little code. In fact, you can read and understand its source code
in only an afternoon!

> At its core, Slim
is a dispatcher that receives an HTTP request, invokes an appropriate callback
routine, and returns an HTTP response. That's it.

You don't always need a kitchen-sink solution like [Symfony][symfony] or [Laravel][laravel].
These are great tools, for sure. But they are often overkill. Instead, Slim
provides only a minimal set of tools that do what you need and nothing else.

## How does it work?

First, you need a web server like Nginx or Apache. You should [configure
your web server](/docs/start/web-servers.html) so that it sends all appropriate
requests to one "front-controller" PHP file. You instantiate and run your Slim
app in this PHP file.

A Slim app contains routes that respond to specific HTTP requests. Each route
invokes a callback and returns an HTTP response. To get started, you first
instantiate and configure the Slim application. Next, you define your application
routes. Finally, you run the Slim application. It's that easy. Here's an
example application:

<figure>
{% highlight php %}
<?php
// Create and configure Slim app
$app = new \Slim\App;

// Define app routes
$app->get('/hello/{name}', function ($request, $response, $args) {
    return $response->write("Hello " . $args['name']);
});

// Run app
$app->run();
{% endhighlight %}
<figcaption>Figure 1: Example Slim application</figcaption>
</figure>

## Bring your own components

Slim is designed to play well with other PHP components, too. You can register
additional first-party components such as [Slim-Csrf][csrf], [Slim-HttpCache][httpcache],
or [Slim-Flash][flash] that build upon Slim's default functionality. It's also
easy to integrate third-party components found on [Packagist](https://packagist.org/).

## How to read this documentation

If you are new to Slim, I recommend you read this documentation from start
to finish. If you are already familiar with Slim, you can instead jump straight
to the appropriate section.

This documentation begins by explaining Slim's concepts and architecture
before venturing into specific topics like request and response handling,
routing, and error handling.

[symfony]: http://symfony.com/
[laravel]: http://laravel.com/
[csrf]: https://github.com/slimphp/Slim-Csrf/
[httpcache]: https://github.com/slimphp/Slim-HttpCache
[flash]: https://github.com/slimphp/Slim-Flash
[eloquent]: http://laravel.com/docs/5.1/eloquent
[doctrine]: http://www.doctrine-project.org/projects/orm.html
