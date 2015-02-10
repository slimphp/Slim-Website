---
title: Version 1.5.2 has landed
description: Version 1.5.2 of the Slim Framework has been released
layout: post
---

The Slim Framework v1.5.2 introduces a new architecture. Several other features have changed and improved. This is a large update and is currently considered beta. Use this version at your own risk. It will remain in the develop branch until users have had sufficient time to vet the new version with their applications.

**UPDATE: What I describe below as version 1.5.2 will be tagged as version 1.6.0 instead. You can read more about this change in the more recent blog post “Version Numbers”**

Most changes shown below are “under-the-hood”. The public interface is largely the same unless otherwise noted. I encourage you to read through the development branch documentation to explore the new features in version 1.5.2.

## Rack Architecture

Although the Slim Framework for PHP 5 appears the same on the outside, the framework uses a brand new Rack-based architecture and supports the Rack Protocol from top to bottom.

[Learn More](http://www.slimframework.com/documentation/develop#middleware)

## Environment

The application environment is now decoupled from the Slim_Http_Request class and moved into the Slim_Environment class. This allows the Slim_Http_Request and Slim_Http_Response classes to become indempotent abstractions of the current environment rather than application-wide singletons as they were before. The Slim_Environment class will parse the environment variables defined in the Rack Protocol specification and make those available to the Slim application and its middleware.

[Learn More](http://www.slimframework.com/documentation/develop#environment)

## Middleware

With its new Rack architecture, the Slim Framework now supports middleware. Middleware allow you to manipulate the current environment variables and/or HTTP request before and/or after the Slim application is invoked. Think of a Slim application as the core of an onion. Like ogres, onions have layers. Each layer of the onion is a middleware. When you invoke the Slim application’s run() method, the outer-most middleware layer is invoked first. When ready, that middleware is responsible for invoking the next middleware layer (or Slim application) that it surrounds. This process steps deeper into the onion — through each middleware layer — until the core Slim application is invoked.

Each middleware will implement a `call()` public instance method. This method accepts a reference to the current environment array as its one and only argument. The `call()` method should perform the appropriate operations and optionally call the downstream middleware or Slim application. This method must return an array of HTTP status, HTTP header, and HTTP body. The status is an integer. The HTTP header is an iterable data structure: either an instance of Slim_Http_Headers or an associative array. The body is a string.

[Learn More](http://www.slimframework.com/documentation/develop#middleware)

## Testing

Testing your Slim application is also much easier thanks to the decoupling of Environment variables from the Slim_Http_Request class. The Slim_Environment class, responsible for parsing environment variables from the $_SERVER superglobal, provides a mock() public instance method that lets you define your own environment variables instead. This lets you build mock HTTP requests for testing your Slim applications.

[Learn More](http://www.slimframework.com/documentation/develop#environment)

## HTTP Cookies

Previous versions of the Slim Framework relied on PHP’s native `setcookie()` function to send HTTP cookies with the HTTP response. Version 1.5.2 uses its own implementation to construct the `Set-Cookie` headers allowing middleware the opportunity to inspect and manipulate the raw headers before they are delivered to the client.

Because version 1.5.2 uses its own underlying cookie implementation, those using PHP < 5.2 may now make use of the `Set-Cookie` header’s “HttpOnly” parameter; this was not possible with PHP’s native `setcookie()` method.

[Learn More](http://www.slimframework.com/documentation/develop#response-cookies)

## Sessions

Sessions were a one-size-fits all approach in earlier versions of the Slim Framework. Version 1.5.2, however, does not start a PHP session automatically. If you want to use PHP sessions, you must configure and start the PHP session on your own.

Earlier versions also provided secure sessions that were stored in a hashed, encrypted HTTP cookie. This functionality has been extracted from the core framework into optional middleware. To use secure sessions persisted in HTTP cookies, add the Slim_Middleware_SessionCookie middleware to your application. When using the secure session cookie middleware, you will continue to use the `$_SESSION` superglobal, but you do not need to start a native PHP session. This way you can easily migrate between native PHP sessions and the session cookie middleware with zero changes to your application code. When you add the Slim_Middleware_SessionCookie middleware, you may optionally specify its expiration, path, domain, secure, and httponly cookie properties along with the cookie encryption’s cipher, cipher mode, and secret key. These properties are separate from the Slim application’s cookie properties.

[Learn More](http://www.slimframework.com/documentation/develop#sessions)

## Logging

Slim Framework logging has also changed from previous versions. In version 1.5.2, there is a Slim_Log class that implements the same public instance methods as before:

{% highlight php %}
$log = $app->getLog();
$app->debug();
$app->info();
$app->warn();
$app->error();
$app->fatal();
{% endhighlight %}

Unlike earlier versions, the Slim_Log instance uses a log writer. The log writer implements a public `write()` instance method that accepts a mixed argument and writes the argument to the appropriate output. A log writer may send the logged message to stderr, to a file, to a database, to Twitter, to a remote API, or anywhere else you can imagine. The preferred way to customize your Slim application’s logging is to create a custom log writer that Slim’s Slim_Log instance will use instead of its own. Slim’s default log writer will send logged messages to `php://stderr`.

[Learn More](http://www.slimframework.com/documentation/develop#logging)

## HTTP Request And Response

The Slim_Http_Request and Slim_Http_Response objects are now indempotent abstractions rather than application-wide singletons. Every Slim application will have a default request and response object, but you may instantiate these at will in hooks or middleware to easily create or modify HTTP requests and responses.

These classes now also provide many new helper methods to help you more easily inspect HTTP request and response properties. I encourage you to explore the source code for these two classes to learn what methods are available.

[Learn More](http://www.slimframework.com/documentation/develop#request)

## Hooks And Filters

Middleware allows you to perform operations around the Slim application. Hooks allow you to perform operations at specific points within the Slim application. Hooks act exactly as they did in earlier versions. However, version 1.5.2 removes filters. Although the filter infrastructure was implemented in earlier versions, there were never any default filters created or used. Filters are largely obsolete with the introduction of Slim middleware. If you need to filter HTTP request or response properties, do so in middleware.

[Learn More](http://www.slimframework.com/documentation/develop#hooks)

## Test Coverage

Most unit tests have been re-written using mock environments to accommodate the new Rack architecture. Mock environments helped me improve test coverage to around 98%. This will continue to improve.
