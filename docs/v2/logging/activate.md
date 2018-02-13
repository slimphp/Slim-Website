The Slim application’s log object provides the following public methods to enable or disable logging during runtime.

    <?php
    //Enable logging
    $app->log->setEnabled(true);

    //Disable logging
    $app->log->setEnabled(false);

You may enable or disable the log object during application instantiation like this:

    <?php
    $app = new Slim(array(
        'log.enabled' => true
    ));

If logging is disabled, the log object will ignore all logged messages until it is enabled.
