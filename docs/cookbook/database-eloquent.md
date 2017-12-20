---
title: Using Eloquent with Slim
---

You can use a database ORM such as [Eloquent](https://laravel.com/docs/5.1/eloquent) to connect your SlimPHP application to a database.

## Adding Eloquent to your application

<figure markdown="1">
```bash
composer require illuminate/database "~5.1"
```
<figcaption>Figure 1: Add Eloquent to your application.</figcaption>
</figure>

## Configure Eloquent

Add the database settings to Slim's settings array.

<figure markdown="1">
```php
<?php
return [
    'settings' => [
        // Slim Settings
        'determineRouteBeforeAppMiddleware' => false,
        'displayErrorDetails' => true,
        'db' => [
            'driver' => 'mysql',
            'host' => 'localhost',
            'database' => 'database',
            'username' => 'user',
            'password' => 'password',
            'charset'   => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix'    => '',
        ]
    ],
];
```
<figcaption>Figure 2: Settings array.</figcaption>
</figure>

In your `dependencies.php` or wherever you add your Service Factories:

<figure markdown="1">
```php
// Service factory for the ORM
$container['db'] = function ($container) {
    $capsule = new \Illuminate\Database\Capsule\Manager;
    $capsule->addConnection($container['settings']['db']);

    $capsule->setAsGlobal();
    $capsule->bootEloquent();

    return $capsule;
};
```
<figcaption>Figure 3: Configure Eloquent.</figcaption>
</figure>

## Pass a controller an instance of your table

<figure markdown="1">
```php
$container[App\WidgetController::class] = function ($c) {
    $view = $c->get('view');
    $logger = $c->get('logger');
    $table = $c->get('db')->table('table_name');
    return new \App\WidgetController($view, $logger, $table);
};
```
<figcaption>Figure 4: Pass table object into a controller.</figcaption>
</figure>

## Query the table from a controller

<figure markdown="1">
```php
<?php

namespace App;

use Slim\Views\Twig;
use Psr\Log\LoggerInterface;
use Illuminate\Database\Query\Builder;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

class WidgetController
{
    private $view;
    private $logger;
    protected $table;

    public function __construct(
        Twig $view,
        LoggerInterface $logger,
        Builder $table
    ) {
        $this->view = $view;
        $this->logger = $logger;
        $this->table = $table;
    }

    public function __invoke(Request $request, Response $response, $args)
    {
        $widgets = $this->table->get();

        $this->view->render($response, 'app/index.twig', [
            'widgets' => $widgets
        ]);

        return $response;
    }
}
```
<figcaption>Figure 5: Sample controller querying the table.</figcaption>
</figure>

### Query the table with where

<figure markdown="1">
```php
...
$records = $this->table->where('name', 'like', '%foo%')->get();
...
```
<figcaption>Figure 6: Query searching for names matching foo.</figcaption>
</figure>

### Query the table by id

<figure markdown="1">
```php
...
$record = $this->table->find(1);
...
```
<figcaption>Figure 7: Selecting a row based on id.</figcaption>
</figure>

## More information

[Eloquent](https://laravel.com/docs/5.1/eloquent) Documentation
