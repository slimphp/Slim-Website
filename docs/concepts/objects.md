---
title: Objects
---

## The Request object

This object encapsulates the current HTTP request using the information provided by the Environment object. The Request object manages the HTTP request method, headers, parameters, and body.

[Learn more](/docs/objects/request.html)

## The Response object

This object encapsulates an HTTP response to be returned to the HTTP client. It manages the HTTP response status, headers, and body.

[Learn more](/docs/objects/response.html)

## The Router object

This object manages application routes. A _route_ has three parts: a method, a URI path, and a callback. The Router object dispatches the current HTTP request to the first matching application route (or to the appropriate error handler). The Router can be accessed directly, but it is typically used via proxy methods on the application instance.

[Learn more](/docs/objects/router.html)

## The Environment object

This object decouples the Slim application from its global server environment by mirroring the `$_SERVER` superglobal. You will rarely interact with this object outside of unit tests.

[Learn more](/docs/objects/environment.html)
