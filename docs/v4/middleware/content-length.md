---
title: Content Length Middleware
---

The Content Length Middleware will automatically append a `Content-Length` header to the response. This is to replace the `addContentLengthHeader` setting that was removed from Slim 3. This middleware should be placed on the center of the middleware stack so it gets executed last.

## Usage
```php
<?php
use Slim\Factory\AppFactory;
use Slim\Middleware\ContentLengthMiddleware;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$contentLengthMiddleware = new ContentLengthMiddleware();
$app->add($contentLengthMiddleware);

// ...

$app->run();
```
