The response object provides helper methods to inspect and interact with the underlying HTTP response.

### Finalize

The response object’s `finalize()` method returns a numeric array of `[status, header, body]`. The status is
an integer; the header is an iterable data structure; and the body is a string. Were you to create a new
`\Slim\Http\Response` object in your Slim application or its middleware, you would call the response object's
`finalize()` method to produce the status, header, and body for the underlying HTTP response.

    <?php
    /**
     * Prepare new response object
     */
    $res = new \Slim\Http\Response();
    $res->setStatus(400);
    $res->write('You made a bad request');
    $res->headers->set('Content-Type', 'text/plain');

    /**
     * Finalize
     * @return [
     *     200,
     *     ['Content-type' => 'text/plain'],
     *     'You made a bad request'
     * ]
     */
    $array = $res->finalize();

### Redirect

The response object’s `redirect()` method will set the response status and its **Location:** header needed to
return a **3xx Redirect** response.

    <?php
    $app->response->redirect('/foo', 303);

### Status Introspection

The response object provides other helper methods to inspect its current status. All of the following methods
return a boolean value:

    <?php
    $res = $app->response;

    //Is this an informational response?
    $res->isInformational();

    //Is this a 200 OK response?
    $res->isOk();

    //Is this a 2xx successful response?
    $res->isSuccessful();

    //Is this a 3xx redirection response?
    $res->isRedirection();

    //Is this a specific redirect response? (301, 302, 303, 307)
    $res->isRedirect();

    //Is this a forbidden response?
    $res->isForbidden();

    //Is this a not found response?
    $res->isNotFound();

    //Is this a client error response?
    $res->isClientError();

    //Is this a server error response?
    $res->isServerError();
