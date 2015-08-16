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
applications with user interfaces.

> At its core, Slim
is a dispatcher that receives an HTTP request, invokes an appropriate callback
routine, and returns an HTTP response. That's it.

You don't always need a kitchen-sink solution like [Symfony][symfony] or [Laravel][laravel].
These are great tools, for sure. But they are often overkill. Instead, Slim
provides only a minimal set of tools that do what you need and nothing else.

Slim does not have a lot of code, and that means you can easily read
_and understand_ its source code in an afternoon.

## Bring your own components

Slim is designed to play well with other PHP components, too. You can register
additional first-party components such as [Slim-Csrf][csrf], [Slim-HttpCache][httpcache],
or [Slim-Flash][flash] that build upon Slim's default functionality. It's also
easy to integrate third-components found on [Packagist](https://packagist.org/).

## Front controller pattern

It is typical to use the front-controller pattern to funnel appropriate HTTP requests
received by your web server to a single PHP file. This PHP file is where
you instantiate, configure, and run your Slim app.

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
