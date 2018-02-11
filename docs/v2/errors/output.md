The Slim application's environment will always contain a key **slim.errors** with a value that is a writable
resource to which log and error messages may be written. The Slim application’s log object will write log messages
to **slim.errors** whenever an Exception is caught or the log object is manually invoked.

If you want to redirect error output to a different location, you can define your own writable resource by
modifying the Slim application’s environment settings. I recommend you use middleware to update the environment:

    <?php
    class CustomErrorMiddleware extends \Slim\Middleware
    {
        public function call()
        {
            // Set new error output
            $env = $this->app->environment;
            $env['slim.errors'] = fopen('/path/to/output', 'w');

            // Call next middleware
            $this->next->call();
        }
    }

Remember, **slim.errors** does not have to point to a file; it can point to any valid writable resource.
