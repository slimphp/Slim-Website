Slim application middleware must subclass `\Slim\Middleware` and implement a public `call()` method. The `call()`
method does not accept arguments. Middleware may implement its own constructor, properties, and methods. I encourage
you to look at Slim’s built-in middleware for working examples (e.g. Slim/Middleware/ContentTypes.php or
Slim/Middleware/SessionCookie.php).

This example is the most simple implementation of Slim application middleware. It extends `\Slim\Middleware`,
implements a public `call()` method, and calls the next inner middleware.

    <?php
    class MyMiddleware extends \Slim\Middleware
    {
        public function call()
        {
            $this->next->call();
        }
    }
