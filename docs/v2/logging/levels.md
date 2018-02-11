
<div class="alert alert-info">
    <strong>Heads Up!</strong> Use the <code>\Slim\Log</code> constants when setting the log level instead
    of using raw integers.
</div>

The Slim application’s log object will respect or ignore logged messages based on its log level setting. When you
invoke the log objects’s methods, you are inherently assigning a level to the logged message.
The available log levels are:

\Slim\Log::EMERGENCY
: Level 1

\Slim\Log::ALERT
: Level 2

\Slim\Log::CRITICAL
: Level 3

\Slim\Log::ERROR
: Level 4

\Slim\Log::WARN
: Level 5

\Slim\Log::NOTICE
: Level 6

\Slim\Log::INFO
: Level 7

\Slim\Log::DEBUG
: Level 8

Only messages that have a level less than the current log object’s level will be logged. For example, if the log
object’s level is `\Slim\Log::WARN` (5), the log object will ignore `\Slim\Log::DEBUG` and `\Slim\Log::INFO` messages
but will accept `\Slim\Log::WARN`, `\Slim\Log::ERROR`, and `\Slim\Log::CRITICAL` messages.

### How to set the log level

    <?php
    $app->log->setLevel(\Slim\Log::WARN);

You can set the log object’s level during application instantiation, too:

    <?php
    $app = new \Slim\Slim(array(
        'log.level' => \Slim\Log::WARN
    ));
