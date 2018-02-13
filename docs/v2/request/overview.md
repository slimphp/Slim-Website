Each Slim application instance has one request object. The request object is an abstraction of the current
HTTP request and allows you to easily interact with the Slim application's environment variables. Although each
Slim application includes a default request object, the `\Slim\Http\Request` class is idempotent; you may
instantiate the class at will (in middleware or elsewhere in your Slim application) without affecting the application
as a whole. You can obtain a reference to the Slim application’s request object like this:

    <?php
    // Returns instance of \Slim\Http\Request
    $request = $app->request;
