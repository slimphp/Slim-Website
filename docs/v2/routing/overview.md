The Slim Framework helps you map resource URIs to callback functions for specific HTTP request methods (e.g. GET, POST, PUT, DELETE, OPTIONS or HEAD). A Slim application will invoke the first route that matches the current HTTP request’s URI and method.

If the Slim application does not find routes with URIs that match the HTTP request URI and method, it will automatically return a 404 Not Found response.
