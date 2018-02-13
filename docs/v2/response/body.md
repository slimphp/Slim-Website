The HTTP response returned to the client will have a body. The HTTP body is the actual content of the HTTP response
delivered to the client. You can use the Slim application’s response object to set the HTTP response’s body:

    <?php
    $app = new \Slim\Slim();

    // Overwrite response body
    $app->response->setBody('Foo');

    // Append response body
    $app->response->write('Bar');

When you overwrite or append the response object’s body, the response object will automatically set the
**Content-Length** header based on the bytesize of the new response body.

You can fetch the response object’s body like this:

    <?php
    $body = $app->response->getBody();

Usually, you will never need to manually set the response body with the `setBody()` or `write()` methods; instead,
the Slim app will do this for you. Whenever you `echo()` content inside a route's callback function, the
`echo()`’d content is captured in an output buffer and appended to the response body before the HTTP response
is returned to the client.
