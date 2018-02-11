The HTTP response returned to the client will have a status code indicating the response’s type
(e.g. 200 OK, 400 Bad Request, or 500 Server Error). You can use the Slim application’s response object to set the
HTTP response’s status like this:

    <?php
    $app->response->setStatus(400);

You only need to set the response object’s status if you intend to return an HTTP response that *does not* have
a 200 OK status. You can just as easily fetch the response object’s current HTTP status by invoking the same
method without an argument, like this:

    <?php
    $status = $app->response->getStatus();
