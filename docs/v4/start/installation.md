---
title: Installation
---

## System Requirements

* Web server with URL rewriting
* PHP 7.1 or newer

## How to Install Slim

We recommend you install Slim with [Composer](https://getcomposer.org/).
Navigate into your project's root directory and execute the bash command
shown below. This command downloads the Slim Framework and its third-party
dependencies into your project's `vendor/` directory.

```bash
composer require slim/slim "^4.0"
```

Require the Composer autoloader into your PHP script, and you are ready
to start using Slim.

```php
<?php
require 'vendor/autoload.php';
```

## How to Install Composer

Don't have Composer? It's easy to install by following the instructions on their [download](https://getcomposer.org/download/) page.
