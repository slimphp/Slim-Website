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

## Install Manually

You can install the Slim Framework without Composer. Download the Slim Framework files into your project directory. Next, require the `Slim/Autoloader.php` file into your PHP script and invoke its static `register()` method.

{% highlight php %}
<?php
require 'Slim/Autoloader.php';
\Slim\Autoloader::register();
{% endhighlight %}

If you install Slim manually, you are responsible for installing and autoloading these third-party dependencies:

* [Pimple 3.x](http://pimple.sensiolabs.org/)
* [PSR HTTP Message 0.x](https://github.com/php-fig/http-message)
* [FastRoute 4.x](https://github.com/nikic/FastRoute/)
