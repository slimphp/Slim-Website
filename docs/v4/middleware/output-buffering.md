---
title: Output Buffering Middleware
---

The Output Buffering Middleware enables you to switch between two modes of output buffering: `APPEND` (default) and `PREPEND` mode. 
The `APPEND` mode will use the existing response body to append the contents.
The `PREPEND` mode will create a new response body object and prepend the contents to the output from the existing response body.
This middleware should be placed on the center of the middleware stack so it gets executed last.

## Usage
```php
<?php
use Slim\Factory\AppFactory;
use Slim\Middleware\OutputBufferingMiddleware;
use Slim\Psr7\Factory\StreamFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$streamFactory = new StreamFactory();

/**
 * The two modes available are
 * OutputBufferingMiddleware::APPEND (default mode) - Appends to existing response body
 * OutputBufferingMiddleware::PREPEND - Creates entirely new response body
 */
$mode = OutputBufferingMiddleware::APPEND;
$outputBufferingMiddleware = new OutputBufferingMiddleware($streamFactory, $mode);
$app->add($outputBufferingMiddleware);

// ...

$app->run();
```
