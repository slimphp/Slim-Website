---
title: Application
---

The Application, (or `Slim\App`) is the entry point to your Slim application and is used to register the routes that link to your callbacks or controllers.

```php
// instantiate the App object
$app = new \Slim\App();

// Add route callbacks
$app->get('/', function ($request, $response, $args) {
    return $response->withStatus(200)->write('Hello World!');
});

// Run application
$app->run();
```
