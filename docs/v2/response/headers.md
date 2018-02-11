The HTTP response returned to the HTTP client will have a header. The HTTP header is a list of keys and values that
provide metadata about the HTTP response. You can use the Slim application’s response object to set the HTTP
response’s header. The response object has a public property `headers` that is an instance of `\Slim\Helper\Set`;
this provides a simple, standardized interface to manipulate the HTTP response headers.

    <?php
    $app = new \Slim\Slim();
    $app->response->headers->set('Content-Type', 'application/json');

You may also fetch headers from the response object's `headers` property, too:

    <?php
    $contentType = $app->response->headers->get('Content-Type');

If a header with the given name does not exist, `null` is returned. You may specify header names with upper, lower,
or mixed case with dashes or underscores. Use the naming convention with which you are most comfortable.
