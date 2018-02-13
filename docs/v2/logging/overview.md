A Slim application provides a log object that writes data to a specific output. The actual writing of data is
delegated to a log writer.

### How to log data

To log data in a Slim application, get a reference to the log object:

    <?php
    $log = $app->log;

The log object provides the following PSR-3 interface

    $app->log->debug(mixed $object);
    $app->log->info(mixed $object);
    $app->log->notice(mixed $object);
    $app->log->warning(mixed $object);
    $app->log->error(mixed $object);
    $app->log->critical(mixed $object);
    $app->log->alert(mixed $object);
    $app->log->emergency(mixed $object);

Each log object method accepts one mixed argument. The argument is usually a string, but the argument can be
anything. The log object will pass the argument to its log writer. It is the log writer’s responsibility to write
arbitrary input to the appropriate destination.
