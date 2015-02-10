---
title: Upcoming changes to the Slim Framework
description: Learn about new features and changes coming in the next version of the Slim Framework.
layout: post
---

Now that the day job is finally slowing down a bit, I’ve been back at work on the Slim Framework. Here are several new features and changes coming in the next stable release — currently available in the develop branch to help you start updating your applications.

## The Environment

* HTTP headers that contain the HTTP_ prefix now retain the HTTP_ prefix in the Environment object.

## The Request

* HTTP headers are parsed from the Environment object on instantiation and made available in the Request’s public `headers` property.
* Cookies are parsed from the Environment object on instantiation and made available in the Request’s public `cookies` property.
* The Request’s public `headers` and `cookies` properties use the new `\Slim\Helper\Set` interface.

If you use custom middleware to update the Request object’s headers or cookies, you must now do so on the Request object’s `cookies` or `headers` properties rather than on the Environment object.

The following Request object methods will be deprecated in the next major point release:

* `cookies()`
* `headers()`

## The Response

* HTTP headers are now set on the Response’s public `headers` property.
* HTTP cookies are now set on the Response’s public `cookies` property.
* The Response’s public `headers` and `cookies` properties uses the \Slim\Helper\Set interface.
* Use `setStatus(int $status)` or `getStatus()` methods instead of `status()`.
* Use the public `headers` property directly instead of `headers()` or `header()`.
* Use the `getBody()` or `setBody()` methods instead of `body()`.
* Use the `getLength()` method instead of `length()`.
* Iterate the `headers` or `cookies` properties instead of the Response object itself.
* 
With the new \Slim\Helper\Set interface, Response object cookies are not serialized into raw HTTP headers until the very end of the Slim application lifecycle (after the final middleware is run, immediately before the HTTP response is returned to the client). This allows custom middleware to use the simpler \Slim\Helper\Set interface to manipulate Response cookies rather than mess with raw HTTP `Set-Cookie` headers.

The following Response object methods and interfaces will be deprecated in the next major point release:

* `headers()`
* `header()`
* `length()`
* `body()`
* `status()`
* `\ArrayAccess`
* `\Countable`
* `\IteratorAggregate`

## Set

The next stable release will introduce the \Slim\Helper\Set interface. This interface will be used by many of the collections in a Slim application: cookies, headers, etc. This interface will help unify and simplify many of Slim’s methods and interfaces. The \Slim\Helper\Set interface is:

{% highlight php %}
__construct(array $items);
set(string $key, mixed $value);
get(string $key, mixed $defaultValue);
add(array $items);
all();
keys();
has(string $key);
remove(string $key);
{% endhighlight %}

This interface implements \ArrayAccess, \Countable, and \IteratorAggregate.

## Older Methods

All of the to-be-deprecated methods shown above will continue to work until the next major point release.

## QUESTIONS?

If you have any questions, send me a tweet at @slimphp or post a question on the [Slim Framework forum](http://help.slimframework.com/).
