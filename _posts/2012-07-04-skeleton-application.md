---
title: Slim Framework Skeleton Application for Rapid Development
description: Use the Slim Framework skeleton application and Composer for rapid application development
layout: post
---

After launching a ton of Slim Framework applications, I grew tired of re-configuring the same filesystem structure, the same libraries, and the same boilerplate code time and time again. No more.

Now, you can quickly install and configure a Slim Framework skeleton application with Composer. The skeleton application uses the latest Slim and Slim-Extras repositories. It also uses Sensio Labs’ Twig template library.

## Install Composer

If you have not installed Composer, do that now. I prefer to install Composer globally in `/usr/local/bin`, but you may also install Composer locally in your current working directory. For this tutorial, I assume you have installed Composer locally.

<http://getcomposer.org/doc/00-intro.md#installation>

## Create A Slim Framework Application

After you install Composer, run this command from the directory in which you want to install your new Slim Framework application.

{% highlight bash %}
php composer.phar create-project slim/slim-skeleton [my-app-name]
{% endhighlight %}

Replace *[my-app-name]* with the desired directory name for your new application. You’ll want to point your virtual host document root to your new application’s `public/` directory.

That’s it! Now go build something cool.
