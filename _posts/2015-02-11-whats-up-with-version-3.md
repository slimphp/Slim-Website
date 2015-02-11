---
title: What's up with version 3.0?
description: New changes in the upcoming Slim Framework version 3.0 release
layout: post
---

It's coming. I promise. As many of you know, I recently finished writing a new book for O'Reilly Media—[Modern PHP](http://shop.oreilly.com/product/0636920033868.do). I'm excited that my book is nearing publication and should be on bookshelves within a month or two. Unfortunately, writing a book is a time-consuming task. I also have a 9 to 5 day job. Life gets in the way sometimes. Excuses, excuses... I know :) I now have free time to work on Slim again. So what's going on? A lot.

## New website

I launched a shiny new website this week at <http://www.slimframework.com/>. It's better in every way, and it lives on GitHub Pages. If you see something that needs improved, the website code is publicly available at <https://github.com/codeguy/Slim-Website>. Send a pull request and I'll merge in your changes.

## New IRC channel

I registered a new primary Freenode channel named `#slimphp`. I'm making a concentrated effort to log in every day, and I receive a notification whenever you leave a message in the channel. If you have any questions or just want to chat, drop into the `#slimphp` channel and say hello.

## New documentation

I am currently re-writing the framework documentation for version 3.0. This is far from complete, but you can read the in-progress documentation at <http://docs-new.slimframework.com/> (URL subject to change). Like the new website, the documentation is hosted on GitHub at <https://github.com/codeguy/Slim-Documentation>. If you can improve the documentation, please send a pull request and I'll merge your changes.

## Version 3.0

The next framework release will be version 3.0. This is a major update that touches all parts of the framework. Here are a few highlights:

### Dependency injection

The `\Slim\App` class will extend Pimple so we can easily inject third-party components into a Slim application or override many of Slim's internal objects such as the request, response, or view objects.

### PSR-7 support

Slim's HTTP request and response abstractions will support [PSR-7](https://github.com/php-fig/fig-standards/blob/master/proposed/http-message.md). This means their interfaces will differ significantly from previous releases. In the past, each Slim application had one request object and one response object that were passed by reference throughout the entire application.

Version 3, however, treats the request and response objects as _value objects_. Each middleware layer and application route will receive the most current request and response objects as arguments. Each middleware layer and route callback is responsible for _returning_ an updated HTTP response object.

The HTTP request and response objects are _immutable_, too. You must use the appropriate `withStatus()`, `withHeader()`, `withBody()`, etc. request and response object methods to create and return a new request or response object with the specified changes. You can read more about the new interface in the PSR-7 documentation at <https://github.com/php-fig/fig-standards/blob/master/proposed/http-message.md>.

This also makes it possible to use third-party middleware with the Slim Framework. For example, perhaps you find PSR-7 middleware designed for another framework. However, by virtue of using PSR-7 interfaces, that middleware is also compatible with Slim.

Slim's PSR-7 changes may sound complicated, but they're actually pretty simple. I'll provide more in-depth information soon in the new documentation. You can read more about PSR-7 at:

* <https://github.com/php-fig/fig-standards/blob/master/proposed/http-message.md>
* <https://mwop.net/blog/2015-01-26-psr-7-by-example.html>
* <https://mwop.net/blog/2015-01-08-on-http-middleware-and-psr-7.html>

### Coded to an interface

The 3.0 release will be coded such that all internal app methods expect _interfaces_ instead of concrete class implementations. This means it will be easy to provide your own implementation for any of a Slim app's dependencies if you want, and you can inject or override dependencies with Pimple container services.

### Route callback binding

If you use Closures as Route callback routines, the Closures will become bound to the `\Slim\App` instance. This means you will have access to the app instance _inside_ of the Closure via the `$this` keyword.

{% highlight php %}
<?php
$app = new \Slim\App();
$app->get('/hello', function ($req, $res) {
    $this['view']->display('profile.html', [
        'name' => 'Josh',
        'url' => 'https://joshlockhart.com'
    ]);
});
{% endhighlight %}

### Simpler codebase

The framework codebase will be much simpler. Previously, the `\Slim\App` class contained many methods concerning rendering or response headers. This is no longer the case. I have migrated many methods into other appropriate classes. For example, the `\Slim\App::contentType()` and `\Slim\App::status()` will be removed, and you must use the response object's methods to modify the HTTP response. The `\Slim\App::render()` method will be removed, and you must use the view object's `render()` or `display()` method instead. These are only a few examples. I believe these changes make Slim smaller, more intuitive, and easier-to-use.

### Pull requests

There are many outstanding pull requests that I have let languish for the past year. I apologize for this. I will curate these soon, merge what I can, and close the rest. I won't be able to use all of them, even some of the good ones.
I encourage you to hold off on sending new pull requests until I can better organize the issue tracker.

### Branching strategy

Slim will adopt a new, simpler branching strategy. There will be one `master` branch. The branch `HEAD` reference will represent the latest unstable code. Stable releases will be tagged with a numeric version number (e.g. `3.0.0`).

Previously, I attempted to use the Git Flow branching strategy, but it has proven too complicated for the project and has caused more confusion and disorder than anything else.

The current `master` branch will be renamed to `legacy-2.x` (or something similar), and the current `develop` branch will be renamed to `master`. All future development will resume on the newly renamed `master` branch. This name change may toss a wrench into existing pull requests. If it does, I'm sorry. But this is the best decision both for the project's future and my own sanity.
This branch name change has not happened yet, but it will before the 3.0 release.

### Road map

I will soon establish a new Road Map on the project's GitHub wiki. I will announce this as soon as it is avialable.

### Unit tests

Currently, many unit tests in the `develop` branch are broken. I've been moving fast lately and breaking things (I mean, _it is_ the develop branch). These tests will be fixed soon.
