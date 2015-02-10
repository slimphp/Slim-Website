---
title: Say Hello World with Slim
description: Build a simple Hello World application with the Slim Framework for PHP 5
layout: post
---

This tutorial demonstrates the typical process for writing a Slim Framework application. The Slim Framework uses the front controller pattern to send all HTTP requests through a single file — usually `index.php`. By default, Slim comes with a `.htaccess` file for use with the Apache web server. You'll typically intitialize your app, define your routes, and run your app in the ``index.php`.

## Step 1: Initialize your app

First, instantiate your Slim application. Provide an optional array of settings to configure the application.

{% highlight php %}
//With default settings
$app = new Slim();

//With custom settings
$app = new Slim(array(
    'log.enable' => true,
    'log.path' => './logs',
    'log.level' => 4,
    'view' => 'MyCustomViewClassName'
));
{% endhighlight %}

## Step 2: Define Routes

Third, define the application’s routes with the methods shown in the example below.

I recommend PHP >= 5.3 to enjoy Slim’s support for anonymous functions. If using a lesser PHP version, the final argument may be anything that returns true for `is_callable()`.

{% highlight php %}
//GET route
$app->get('/hello/:name', function ($name) {
    echo "Hello, $name";
});

//POST route
$app->post('/person', function () {
    //Create new Person
});

//PUT route
$app->put('/person/:id', function ($id) {
    //Update Person identified by $id
});

//DELETE route
$app->delete('/person/:id', function ($id) {
    //Delete Person identified by $id
});
{% endhighlight %}

## Step 3: Run The Application

Finally, run your Slim application. This will usually be the final statement executed in the `index.php` file.

{% highlight php %}
$app->run();
{% endhighlight %}
