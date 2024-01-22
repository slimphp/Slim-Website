---
title: Content Length Middleware
---

The Content Length Middleware will automatically append a `Content-Length` header to the response. 
This is to replace the `addContentLengthHeader` setting that was removed from Slim 3. 
This middleware should be placed on the end of the middleware stack so that it gets executed first and exited last.

## Usage
```php
<?php

use Slim\Factory\AppFactory;
use Slim\Middleware\ContentLengthMiddleware;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

// Add any middleware which may modify the response body before adding the ContentLengthMiddleware

$contentLengthMiddleware = new ContentLengthMiddleware();
$app->add($contentLengthMiddleware);

// ...

$app->run();
```
