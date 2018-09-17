---
title: Output Buffering Middleware
---

The Output Buffering Middleware enables you to switch between two modes of output buffering: `APPEND` (default) and `PREPEND` mode. The `APPEND` mode will use the existing response body to append the content while `PREPEND` mode will create a new response body and append it to the existing response. This middleware should be placed on the center of the middleware stack so it gets executed last.

## Usage
```php
use Slim\App;
use Slim\Middleware\OutputBufferingMiddleware;

$app = new App();

/**
 * The two modes available are
 * OutputBufferingMiddleware::APPEND (default mode) - Appends to existing response body
 * OutputBufferingMiddleware::PREPEND - Creates entirely new response body
 */
$mode = OutputBufferingMiddleware::APPEND;
$outputBufferingMiddleware = new OutputBufferingMiddleware($mode);

...
$app->run();
```