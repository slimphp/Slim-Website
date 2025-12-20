---
title: Blade Templates
---

## The caiquebispo/blade-slim

The [PHP-View](https://packagist.org/packages/caiquebispo/blade-slim) PHP component helps you render Blade templates.

## Installation

```
composer require caiquebispo/blade-slim
```

## Usage

You can use it with Slim like this:

```php
<?php

use Slim\Factory\AppFactory;
use Slim\Views\PhpRenderer;
use  BladeSlim\Blade;

require __DIR__ . '/../vendor/autoload.php';

// Create App
$app = AppFactory::create();

// Configuração do Blade 
$blade = new Blade(
    __DIR__ . '/../resources/views', // Views directory
    __DIR__ . '/../storage/cache',   // Cache directory
    $app->getResponseFactory()->createResponse()
);

$app->get('/', function () {
    return view('index', [
        'title' => 'Home Page',
        'appName' => 'My Slim App'
    ]);
});
$app->run();
```

Create a directory in your project root: `resources/views/`

Create a template file within the templates directory: `resources/views/index.blade.php`

**Template content:**

```php
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title> {{ $title }} </title>​​
</head>

<body>
    <h1> Bem-vindo( a ) ao {{ $appName }} ! </h1>
</body>

</html>
```

Output:

```
Bem-vindo( a ) ao My Slim App !
```

**Security note:** It's important to ensure that the dynamic
output is properly [escaped](https://packagist.org/packages/caiquebispo/blade-slim).

## Read more

* [Blade Slim documentation](https://packagist.org/packages/caiquebispo/blade-slim)
