An HTTP request may have associated variables (not to be confused with route variables). The GET, POST, or PUT
variables sent with the current HTTP request are exposed via the Slim application’s request object.

If you want to quickly fetch a request variable value without considering its type, use the request object's `params()`
method:

    <?php
    $app = new \Slim\Slim();
    $paramValue = $app->request->params('paramName');

The `params()` method will first search PUT variables, then POST variables, then GET variables. If no variables
are found, `null` is returned. If you only want to search for a specific type of variable, you can use these
methods instead:

    <?php
    //GET variable
    $paramValue = $app->request->get('paramName');

    //POST variable
    $paramValue = $app->request->post('paramName');

    //PUT variable
    $paramValue = $app->request->put('paramName');

If a variable does not exist, each method above will return `null`. You can also invoke any of these functions without
an argument to obtain an array of all variables of the given type:

    <?php
    $allGetVars = $app->request->get();
    $allPostVars = $app->request->post();
    $allPutVars = $app->request->put();
