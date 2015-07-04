---
title: Installation
---

## System Requirements

* Web server with URL rewriting
* PHP 5.4.0 or newer

## Install with Composer

The preferred installation method is [Composer](https://getcomposer.org/). Navigate into your project directory and execute the following bash command. This command downloads the Slim Framework and its third-party dependencies into your project's `vendor/` directory.

    composer require slim/slim

Next, require the Composer autoloader into your PHP script.

{% highlight php %}
<?php
require 'vendor/autoload.php';
{% endhighlight %}
