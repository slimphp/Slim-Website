---
title: Flash Messages
---

## Install

Via Composer

``` bash
$ composer require slim/flash
```

Requires Slim 3.0.0 or newer.

## Usage

```php
// Start PHP session
session_start(); //by default requires session storage

$app = new \Slim\App();

// Fetch DI Container
$container = $app->getContainer();

// Register provider
$container['flash'] = function () {
    return new \Slim\Flash\Messages();
};

$app->get('/foo', function ($req, $res, $args) {
    // Set flash message for next request
    $this->flash->addMessage('Test', 'This is a message');

    // Redirect
    return $res->withStatus(302)->withHeader('Location', '/bar');
});

$app->get('/bar', function ($req, $res, $args) {
    // Get flash messages from previous request
    $messages = $this->flash->getMessages();
    print_r($messages);
});

$app->run();
```

Please note that a message could be a string, object or array. Please check what your storage can handle.
