---
title: How to organize a large Slim Framework application
description: Learn how to organize a larger Slim Framework application using separate files for related routes
layout: post
---

The Slim Micro Framework is a micro framework that enables developers to quickly write RESTful web applications and APIs. I emphasize micro because Slim is just that — a lightweight and nimble PHP framework used to build smaller web applications and APIs. Unlike CodeIgniter and Symfony (excellent frameworks created by EllisLab and Sensio Labs, respectively), Slim forgoes controllers and abstract components for simplicity and ease-of-use.

You can build a Slim Framework web application with only a single file. Over time, however, projects grow in scope and size; better organization becomes necessary. Slim does not use controllers to organize application methods or routes; controllers are beyond Slim’s concern. That being said, it is possible to organize larger Slim Framework applications. Here’s how I organize my own Slim Framework applications.

## Filesystem Layout

Here’s the directory structure I use for my own Slim Framework applications:

{% highlight text %}
public_html/
    .htaccess
    index.php
    styles/
    images/
    scripts/
app/
    routes/
        session.php
        member.php
        admin.php
    vendor/
    lib/
    data/
public_html/
{% endhighlight %}

Contains the Slim Framework’s .htaccess and index.php. files. The index.php file is where you instantiate and run your Slim Framework application. Public assets (stylesheets, images, and scripts) are in this directory, too.

`app/`
:   Contains the application’s code that should not be available in the public document root.

`vendor/`
:   Contains third-party libraries, like Twig or Smarty.

`lib/`
:   Contains my own custom libraries used by my application.

`data/`
:   Contains the application’s database schema and (if needed) SQLite databases.

## Organize Routes Into Separate Files

An example Slim Framework application may have an admin control panel, members-only pages, and public pages (e.g. log in, log out, and register). As shown in the filesystem layout above, I separate related routes into separate files. Admin routes go into `app/routes/admin.php`. Member routes go into `app/routes/member.php`. Session management routes (e.g. log in, log out, register) go into `app/routes/session.php`. These separate route files are required by `public_html/index.php` like this:

{% highlight php %}
$app = new Slim();
require '../app/routes/session.php';
require '../app/routes/member.php';
require '../app/routes/admin.php';
$app->run();
{% endhighlight %}

Instead of having one very large `index.php` file, there are several smaller files that make building a larger Slim Framework application much easier.
