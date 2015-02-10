---
title: The Slim Framework Application Lifecycle
description: Learn about the Slim Framework application life-cycle
layout: post
---

The essence of a web application is simple: it receives an HTTP request; it invokes the appropriate code; and it returns an HTTP response. The Slim Framework makes it dead simple to build and launch small web applications and APIs by hiding the prerequisite application underpinnings beneath a simple, easy-to-use interface. But for those interested in the low-level details, here’s what a Slim application’s lifecycle looks like from start to finish.

## Instantiation

Upon instantiation, Slim creates a Request object that provides a simple interface to the current HTTP request. Slim also creates a Response object that, by default, returns a 200 OK response in HTML format; the Response object determines the status code, content type, and body of the HTTP response returned to the client.

After the Request and Response objects are created, Slim creates a Router object and a View object. The Router object organizes the Slim application’s routes. The View object renders template content to be used as the HTTP response body. Finally, Slim starts a PHP session if one has not been started already.

The Router and View objects remain behind-the-scenes. The Request and Response objects are usually involved directly with controller code and are accessible from anywhere in the application with `$app->request()` and `$app->response()`, respectively.

## Route Definitions

After instantiation, Slim application routes are defined. A Route is a collection containing a URI, controller code, and one or more HTTP methods to which the Route responds.

{% highlight php %}
$app = new Slim(); $app->get('/foo', function () {
    //Controller code
});
$app->run();
{% endhighlight %}

This example demonstrates a Route mapping the URI “/foo” to specific controller code for an HTTP GET request. The `$app->get()`, `$app->post()`, `$app->put()`, `$app->delete()`, `$app->options()`, or `$app->map()` Slim application instance methods may be used to define application routes that respond to the respective HTTP request methods.

When one of these Slim application instance methods is invoked to define a Route, the Router object relates the given URI to the particular controller code for the given HTTP request method(s) in the form of a Route object.

The resultant Route object returned by the Router provides chainable methods like `$route->name()`, `$route->conditions()`, and `$route->via()` that enable further customization of the Route object before the Slim application runs.

## Running The Application

After application routes are defined, the `$app->run()` method is invoked to start the Slim application. Slim creates a new output buffer to capture content `echo()`d during the `run()` method (i.e. from a Route’s controller code or middleware). Slim invokes middleware at intermittent hooks throughout the run method using `$app->applyHook()`; these allow the developer to invoke queued callbacks at designated points in the run loop.

Next, Slim loops through all Route objects that match the current HTTP request’s URI. The Router object is used directly in a foreach loop; this is possible because the Router implements the IteratorAggregate interface and returns an ArrayIterator object when called from an iterative context such as a foreach loop.

The Router asks each Route object if it matches the current HTTP request URI. When asked, the Route object compiles its pattern (e.g. /hello/:first/:last) into a regular expression, taking into consideration optional parameters or parameter conditions. If the HTTP request URI matches the resultant Route regular expression, the Router will append the Route object to an array of matching Routes returned for iteration in the run loop.

Each Route object knows which HTTP methods to which it responds. For each iteration loop, if the current Route object responds to the current HTTP request method, Slim will invoke the Route’s controller code. However, if the current Route object does not respond to the current HTTP request method, the methods to which the current Route object does respond are appended to the $httpMethodsAllowed array (used later should Slim return 405 Method Not Allowed HTTP response).

If a Route object responds to the current HTTP request method and an Exception is not thrown during the Route’s controller invocation, Slim will break from the Route iteration loop and append the content of the current output buffer to the Response object’s body property.

If Routes match the HTTP request URI but not the HTTP request method, Slim will return a 405 Method Not Allowed HTTP response with an Allow header that lists the HTTP methods to which the matching Routes do respond.

If no Routes match the HTTP request URI, Slim will invoke the application’s Not Found handler and return a 404 Not Found response. The Not Found handler acts the same as a Route; the content it sends to the output buffer is appended to the Response object’s body.

After the Route iteration is complete and the Response object prepared, Slim persists Flash messages and flushes `$_SESSION` data to the session data store before delivering the Response object to the HTTP client.
