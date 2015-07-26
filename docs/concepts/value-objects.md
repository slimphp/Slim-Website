---
title: PSR7 and Value Objects
---

## PSR-7

Slim supports [PSR-7](https://github.com/php-fig/http-message) interfaces for its HTTP message objects. A Slim application container's `request` and `response` services **MUST** return an instance of `\Psr\Http\Message\RequestInterface` and `\Psr\Http\Message\ResponseInterface`, respectively.

Slim provides a built-in PSR-7 implementation. However, you are free to substitute a third-party implementation. Simply override the Slim application container's `request` and `response` services and return an object that implements the appropriate PSR-7 interface.

## Value objects

In accordance with PSR-7, a Slim application's Request and Response objects are [_immutable value objects_](http://en.wikipedia.org/wiki/Value_object). They can be "changed" only by requesting a cloned version that has updated property values.

A Slim application starts with an initial Request and Response object pair. These objects are passed into each application middleware layer, and each middleware layer is free to use these objects as it deems fit. If Slim used object references, each middleware layer could never be certain of its own Request and Response objects' state, if further interior middleware can update the same object references. Instead, Slim uses immutable value objects—each middleware's Request and Response objects always remain the same, and they cannot be changed by other middleware. If a middleware wants to modify the Request or Response object, it must create a _cloned_ version with updated properties.

Value objects have a small inherent overhead because they must be cloned when their properties are updated. This overhead is minimal and does not affect application performance in any meaningful way.

## How to change value objects

You cannot modify a value object. You can, however, request a copy of a value object that contains your desired changes. Slim's Request and Response objects implement the PSR-7 message interfaces. These interfaces provide methods that have the `with` prefix, and you can invoke these methods to _clone_ value objects and apply updated properties. For example, the Response object has a `withHeader($name, $value)` method that returns a cloned value object with a new HTTP header.

{% highlight php %}
$newResponse = $oldResponse->withHeader(
    'Content-Type',
    'application/json'
);
{% endhighlight %}

Refer to the [PSR-7 documentation](http://www.php-fig.org/psr/psr-7/) for more information about these methods.
