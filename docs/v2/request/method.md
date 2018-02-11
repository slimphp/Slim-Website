Every HTTP request has a method (e.g. GET or POST). You can obtain the current HTTP request method via the Slim
application’s request object:

    /**
     * What is the request method?
     * @return string (e.g. GET, POST, PUT, DELETE)
     */
    $app->request->getMethod();

    /**
     * Is this a GET request?
     * @return bool
     */
    $app->request->isGet();

    /**
     * Is this a POST request?
     * @return bool
     */
    $app->request->isPost();

    /**
     * Is this a PUT request?
     * @return bool
     */
    $app->request->isPut();

    /**
     * Is this a DELETE request?
     * @return bool
     */
    $app->request->isDelete();

    /**
     * Is this a HEAD request?
     * @return bool
     */
    $app->request->isHead();

    /**
     * Is this a OPTIONS request?
     * @return bool
     */
    $app->request->isOptions();

    /**
     * Is this a PATCH request?
     * @return bool
     */
    $app->request->isPatch();

    /**
     * Is this a XHR/AJAX request?
     * @return bool
     */
    $app->request->isAjax();
