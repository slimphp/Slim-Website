The Slim application’s log object has a log writer. The log writer is responsible for sending a logged message to
the appropriate output (e.g. STDERR, a log file, a remote web service, Twitter, or a database). Out of the box,
the Slim application’s log object has a log writer of class `\Slim\LogFileWriter`; this log writer directs output
to the resource handle referenced by the application environment’s **slim.errors** key (by default, this is
“php://stderr”). You may also define and use a custom log writer.

### How to use a custom log writer

A custom log writer must implement the following public interface:

    <?php
    public function write(mixed $message);

You must tell the Slim application’s log object to use your custom log writer. You can do so in your application’s
settings during instantiation like this:

    <?php
    $app = new \Slim\Slim(array(
        'log.writer' => new MyLogWriter()
    ));

You may also set a custom log writer with middleware like this:

    <?php
    class CustomLogWriterMiddleware extends \Slim\Middleware
    {
        public function call()
        {
            //Set the new log writer
            $this->app->log->setWriter(new \MyLogWriter());

            //Call next middleware
            $this->next->call();
        }
    }

You can set the log writer similarly in an application hook or route callback like this:

    <?php
    $app->hook('slim.before', function () use ($app) {
        $app->log->setWriter(new \MyLogWriter());
    });

If you only need to redirect error output to a different resource handle, use the Slim application's default log writer;
it writes log messages to a resource handle. All you need to do is set the **slim.errors** environment variable to a
valid resource handle.
