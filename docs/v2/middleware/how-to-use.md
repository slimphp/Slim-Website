Use the Slim application’s `add()` instance method to add new middleware to a Slim application. New middleware will
surround previously added middleware, or the Slim application itself if no middleware has yet been added.

### Example Middleware

This example middleware will capitalize the Slim application's HTTP response body.

    <?php
    class AllCapsMiddleware extends \Slim\Middleware
    {
        public function call()
        {
            // Get reference to application
            $app = $this->app;

            // Run inner middleware and application
            $this->next->call();

            // Capitalize response body
            $res = $app->response;
            $body = $res->getBody();
            $res->setBody(strtoupper($body));
        }
    }

### Add Middleware

    <?php
    $app = new \Slim\Slim();
    $app->add(new \AllCapsMiddleware());
    $app->get('/foo', function () use ($app) {
        echo "Hello";
    });
    $app->run();

The Slim application’s `add()` method accepts one argument: a middleware instance. If the middleware instance requires
special configuration, it may implement its own constructor so that it may be configured before it is added to the
Slim application.

When the example Slim application above is run, the HTTP response body will be an enthusiastic "HELLO";
