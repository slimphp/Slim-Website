---
title: How to use Laravel's Eloquent ORM with the Slim Framework
description: Learn how to use Laravel's Eloquent ORM component in your Slim Framework application.
layout: post
---

I’m building a small Slim Framework application at [New Media Campaigns](http://www.newmediacampaigns.com/). Because this application is for internal use, I figured I’d learn something new while building it. Even though the database schema is pretty simple, I’ve heard great things about [Laravel](http://laravel.com/) — a full-stack framework from [Taylor Otwell](https://twitter.com/taylorotwell) — and how many of its components are available as separate [Composer](http://getcomposer.org/) packages on [Packagist](https://packagist.org/search/?q=illuminate).

So I decided to use Laravel’s [Eloquent ORM](http://laravel.com/docs/database/eloquent) with my Slim Framework application. Several of my readers asked how I did this. So here goes…

## File Structure

Here’s how I’m organizing my application. The virtual host document root is the `public/` directory.

{% highlight text %}
app/
    models/
        Book.php
public/
    index.php
vendor/
composer.json
{% endhighlight %}

## Installation

First, prepare the `composer.json` file so it will pull down and install the Slim Framework and the Eloquent ORM. The composer.json file should look like this:

{% highlight json %}
{
    "require": {
        "slim/slim": "*",
        "illuminate/database": "*"
    }
}
{% endhighlight %}

When this is done, run composer install to install the application dependencies.

## Bootstrap The Eloquent ORM

Next, I tell Composer to autoload the application’s dependencies by requiring Composer’s `autoload.php` file.

{% highlight php %}
// Autoload our dependencies with Composer
require '../vendor/autoload.php';
{% endhighlight %}

And now I bootstrap the Eloquent ORM and pass it my database connection information (be sure you add your own username, password, and database name).

{% highlight php %}
// Database information
$settings = array(
    'driver' => 'mysql',
    'host' => '127.0.0.1',
    'database' => '',
    'username' => '',
    'password' => '',
    'collation' => 'utf8_general_ci',
    'prefix' => ''
);

// Bootstrap Eloquent ORM
$connFactory = new \Illuminate\Database\Connectors\ConnectionFactory();
$conn = $connFactory->make($settings);
$resolver = new \Illuminate\Database\ConnectionResolver();
$resolver->addConnection('default', $conn);
$resolver->setDefaultConnection('default');
\Illuminate\Database\Eloquent\Model::setConnectionResolver($resolver);
{% endhighlight %}

Now that the Eloquent ORM is bootstrapped, I can create and use models that extend the Eloquent abstract model. This example assumes your database contains a table named books with columns title and author.

{% highlight php %}
class Book extends \Illuminate\Database\Eloquent\Model
{

}
{% endhighlight %}

Include this model file into index.php and use your Eloquent ORM models in your Slim application routes:

{% highlight php %}
// Create Slim app
$app = new \Slim\Slim();

$app->get('/foo', function () {
    // Fetch all books
    $books = \Book::all();
    echo $books->toJson();

    // Or create a new book
    $book = new \Book(array(
        'title' => 'Sahara',
        'author' => 'Clive Cussler'
    ));
    $book->save();
    echo $book->toJson();
});

$app->run();
{% endhighlight %}

If you want to read a more indepth tutorial about the Slim Framework and the Eloquent ORM, read [Mixing and matching PHP components with composer](http://www.12devsofxmas.co.uk/post/2012-12-29-day-4-mixing-and-matching-php-components-with-composer) by [Phil Sturgeon](http://philsturgeon.co.uk/).

Happy coding!
