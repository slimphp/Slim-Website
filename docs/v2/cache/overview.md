A Slim application provides built-in support for HTTP caching with its `etag()`, `lastModified()`, and `expires()`
helper methods. It is best to use one of `etag()` or `lastModified()` - in conjunction with `expires()` - per route;
never use both `etag()` and `lastModified()` together in the same route callback.

The `etag()` and `lastModified()` methods should be invoked in a route callback before other code; this allows Slim
to check conditional GET requests before processing the route callback’s remaining code.

Both `etag()` and `lastModified()` instruct the HTTP client to store the resource response in a client-side cache.
The `expires()` method indicates to the HTTP client when the client-side cache should be considered stale.
