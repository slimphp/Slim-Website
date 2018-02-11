The Slim Framework implements a version of the Rack protocol. As a result, a Slim application can have middleware
that may inspect, analyze, or modify the application environment, request, and response before and/or after the
Slim application is invoked.

### Middleware Architecture

Think of a Slim application as the core of an onion. Each layer of the onion is middleware. When you invoke the
Slim application’s `run()` method, the outer-most middleware layer is invoked first. When ready, that middleware
layer is responsible for optionally invoking the next middleware layer that it surrounds. This process steps deeper
into the onion - through each middleware layer - until the core Slim application is invoked. This stepped process
is possible because each middleware layer, and the Slim application itself, all implement a public `call()` method.
When you add new middleware to a Slim application, the added middleware will become a new outer layer and surround
the previous outer middleware layer (if available) or the Slim application itself.

### Application Reference

The purpose of middleware is to inspect, analyze, or modify the application environment, request, and response
before and/or after the Slim application is invoked. It is easy for each middleware to obtain references to the
primary Slim application, its environment, its request, and its response:

    <?php
    class MyMiddleware extends \Slim\Middleware
    {
        public function call()
        {
            //The Slim application
            $app = $this->app;

            //The Environment object
            $env = $app->environment;

            //The Request object
            $req = $app->request;

            //The Response object
            $res = $app->response;
        }
    }

Changes made to the environment, request, and response objects will propagate immediately throughout the application
and its other middleware layers. This is possible because every middleware layer is given a reference to the same
Slim application object.

### Next Middleware Reference

Each middleware layer also has a reference to the next inner middleware layer with `$this->next`. It is each
middleware’s responsibility to optionally call the next middleware. Doing so will allow the Slim application
to complete its full lifecycle. If a middleware layer chooses **not** to call the next inner middleware layer,
further inner middleware and the Slim application itself will not be run, and the application response will
be returned to the HTTP client as is.

    <?php
    class MyMiddleware extends \Slim\Middleware
    {
        public function call()
        {
            //Optionally call the next middleware
            $this->next->call();
        }
    }
