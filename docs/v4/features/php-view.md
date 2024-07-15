---
title: PHP Templates
---

## The slim/php-view component

The [PHP-View](https://github.com/slimphp/PHP-View) PHP component helps you render PHP templates.

## Installation

```
composer require slim/php-view
```

## Usage

You can use it with Slim like this:

```php
<?php

use Slim\Factory\AppFactory;
use Slim\Views\PhpRenderer;

require __DIR__ . '/../vendor/autoload.php';

// Create App
$app = AppFactory::create();

$app->get('/hello', function ($request, $response) {
    $renderer = new PhpRenderer(__DIR__ . '/../templates');
    
    $viewData = [
        'name' => 'John',
    ];
    
    return $renderer->render($response, 'hello.php', $viewData);
})->setName('profile');

$app->run();
```

Create a directory in your project root: `templates/`

Create a template file within the templates directory: `templates/hello.php`

**Template content:**

```php
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slim Example</title>
</head>
<body>
    <h1>Hello, <?= htmlspecialchars($name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?></h1>
</body>
</html>
```

Output:

```
Hello John
```

**Security note:** It's important to ensure that the dynamic
output is properly [escaped](https://github.com/slimphp/PHP-View?tab=readme-ov-file#escaping-values).

