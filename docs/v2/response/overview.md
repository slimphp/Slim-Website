Each Slim application instance has one response object. The response object is an abstraction of your Slim application's
HTTP response that is returned to the HTTP client. Although each Slim application includes a default response object,
the `\Slim\Http\Response` class is idempotent; you may instantiate the class at will (in middleware or elsewhere in
your Slim application) without affecting the application as a whole. You can obtain a reference to the Slim
application’s response object with:

    <?php
    $app = new \Slim\Slim();
    $app->response;

An HTTP response has three primary properties:

* Status
* Header
* Body

The response object provides helper methods, described next, that help you interact with these HTTP response
properties. The default response object will return a **200 OK** HTTP response with the **text/html** content type.
