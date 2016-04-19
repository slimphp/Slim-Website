---
title: Installation
---

## System Requirements

* Web server with URL rewriting
* PHP 5.5 or newer

## How to Install Slim

We recommend you install Slim with [Composer](https://getcomposer.org/).
Navigate into your project's root directory and execute the bash command
shown below. This command downloads the Slim Framework and its third-party
dependencies into your project's `vendor/` directory.

{% highlight bash %}
composer require slim/slim "^3.0"
{% endhighlight %}

Require the Composer autoloader into your PHP script, and you are ready
to start using Slim.

{% highlight php %}
<?php
require 'vendor/autoload.php';
{% endhighlight %}

## How to Install Composer

Don't have Composer? It's easy to install by following the instructions on their [download](https://getcomposer.org/download/) page.
