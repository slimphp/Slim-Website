---
title: Slim 4 Tutorial
---

This tutorial shows you how to work with the powerful and lightweight Slim 4 framework.

## Table of contents

* [Requirements](#requirements)
* [Introduction](#introduction)
* [Installation](#installation)
* [Directory structure](#directory-structure)
* [Apache URL rewriting](#apache-url-rewriting)
* [Configuration](#configuration)
* [Startup](#startup)
* [Routing](#routing-setup)
* [Middleware](#middleware)
  * [What is a middleware?](#what-is-a-middleware)
  * [Routing and error middleware](#routing-and-error-middleware)
* [Container](#container)
  * [A quick guide to the container](#a-quick-guide-to-the-container)
  * [Container definitions](#container-definitions)
* [Your first route](#your-first-route)
* [PSR-4 autoloading](#psr-4-autoloading)
* [Actions](#action)
* [Writing JSON to the response](#writing-json-to-the-response)
* [Domain](#domain)
  * [Services](#services)
  * [Data Transfer Objects](#data-transfer-objects-dto)
  * [Repositories](#repositories)
* [Deployment](#deployment)
* [Conclusion](#conclusion)

## Requirements

* PHP 7.1+
* MySQL 5.7+
* Apache webserver
* Composer

## Introduction

Slim Framework is a great micro framework for web application, RESTful API's and websites.

Our aim is to create a RESTful API with routing, business logic and database operations.

Standards like [PSR](https://www.php-fig.org/psr/) and best practices are very 
imported and integrated part of this tutorial.

## Installation

Create a new project directory and run this command to install the Slim 4 core components:

```
composer require slim/slim:4.*
```

In Slim 4 the PSR-7 implementation is decoupled from the App core. 
This means you can also install other PSR-7 implementations like 
[nyholm/psr7](https://github.com/Nyholm/psr7).

In our case we are installing the Slim PSR-7 implementations using this command:

```
composer require slim/psr7
```

Now we install a number of useful convenience methods such as `$response->withJson()`:

```
composer require slim/http
```

As next we need a PSR-11 container implementation for **dependency injection** and **autowiring**.

Run this command to install [PHP-DI](http://php-di.org/):

```
composer require php-di/php-di
```

To access the application configuration install the `selective/config` package:

```
composer require selective/config
```

For testing purpose we are installing [phpunit](https://phpunit.de/) as development 
dependency with the `--dev` option:

```
composer require phpunit/phpunit --dev
```

Ok nice, now we have installed the most basic dependencies for our project. Later we will add more.

**Note:** Please don't commit the `vendor/` to your git repository. To set up the git repository 
correctly, create a file called `.gitignore` in the project root folder and add the following 
lines to this file:

```
vendor/
.idea/
```

## Directory structure

A good directory structure helps you organize your code, simplifies setup on the web server and 
increases the security of the entire application.

Create the following directory structure in the root directory of your project:

```
.
├── config/             Configuration files
├── logs/               Log files
├── public/             Web server files (DocumentRoot)
│   └── .htaccess       Apache redirect rules for the front controller
│   └── index.php       The front controller
├── templates/          Twig or PHP templates
├── src/                PHP source code (The App namespace)
├── tmp/                Temporary files (cache and logfiles)
├── vendor/             Reserved for composer
├── .htaccess           Internal redirect to the public/ directory
└── .gitignore          Git ignore rules
```

In a web application, it is important to distinguish between the public and 
non-public areas.

The `public/` directory serves your application and will therefore also be 
directly accessible by all browsers, search engines and API clients. 
All other folders are not public and must not be accessible online. 
This can be done by defining the `public` folder in Apache as `DocumentRoot` 
of your website. But more about that later.


## Apache URL rewriting

To run a Slim app with apache we have to add url rewrite rules to redirect the web traffic to a so called [front controller](https://en.wikipedia.org/wiki/Front_controller).

The front controller is just a `index.php` file and the entry point to the application.

* Create a directory: `public/`
* Create a `.htaccess` file in your `public/` directory and copy/paste this content:

```htaccess
# Redirect to front controller
RewriteEngine On
# RewriteBase /
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.php [QSA,L]
```

* Create a second `.htaccess` file in your project root-directory and copy/paste this content:

```htaccess
RewriteEngine on
RewriteRule ^$ public/ [L]
RewriteRule (.*) public/$1 [L]
```

* Create the front-controller file `public/index.php` and copy/paste this content:

```php
<?php

(require __DIR__ . '/../config/bootstrap.php')->run();
```

The [front controller](https://en.wikipedia.org/wiki/Front_controller) is the entry point 
to your slim application and handles all requests by channeling requests through a 
single handler object.

## Configuration

The directory for all configuration files is: `config/`

The file `config/settings.php` is the main configuration file and combines 
the default settings with environment specific settings. 

* Create a directory: `config/`
* Create a configuration file `config/settings.php` and copy/paste this content:

```php
<?php

// Error reporting
error_reporting(0);
ini_set('display_errors', '0');

// Timezone
date_default_timezone_set('Europe/Berlin');

// Settings
$settings = [];

// Path settings
$settings['root'] = dirname(__DIR__);
$settings['temp'] = $settings['root'] . '/tmp';
$settings['public'] = $settings['root'] . '/public';

// Error Handling Middleware settings
$settings['error_handler_middleware'] = [

    // Should be set to false in production
    'display_error_details' => true,

    // Parameter is passed to the default ErrorHandler
    // View in rendered output by enabling the "displayErrorDetails" setting.
    // For the console and unit tests we also disable it
    'log_errors' => true,

    // Display error details in error log
    'log_error_details' => true,
];

return $settings;
```

### Startup

The app startup process contains the code that is executed when the application (request) is started. 

The bootstrap procedure includes the composer autoloader and then continues to
build the container, creates the app and registers the routes + middleware entries.

Create the bootstrap file `config/bootstrap.php` and copy/paste this content:

```php
<?php

use DI\ContainerBuilder;
use Slim\App;

require_once __DIR__ . '/../vendor/autoload.php';

$containerBuilder = new ContainerBuilder();

// Set up settings
$containerBuilder->addDefinitions(__DIR__ . '/container.php');

// Build PHP-DI Container instance
$container = $containerBuilder->build();

// Create App instance
$app = $container->get(App::class);

// Register routes
(require __DIR__ . '/routes.php')($app);

// Register middleware
(require __DIR__ . '/middleware.php')($app);

return $app;
```

### Routing setup

Create a file for all routes `config/routes.php` and copy/paste this content:

```php
<?php

use Slim\App;

return function (App $app) {
    // empty
};

```

## Middleware

### What is a middleware?

A middleware can be executed before and after your Slim application to manipulate the 
request and response object according to your requirements.

[Read more](http://www.slimframework.com/docs/v4/concepts/middleware.html)

### Routing and error middleware

Create a file to load global middleware handler `config/middleware.php` and copy/paste this content:

```php
<?php

use Selective\Config\Configuration;
use Slim\App;

return function (App $app) {
    // Parse json, form data and xml
    $app->addBodyParsingMiddleware();

    // Add global middleware to app
    $app->addRoutingMiddleware();

    $container = $app->getContainer();
    
    // Error handler
    $settings = $container->get(Configuration::class)->getArray('error_handler_middleware');
    $displayErrorDetails = (bool)$settings['display_error_details'];
    $logErrors = (bool)$settings['log_errors'];
    $logErrorDetails = (bool)$settings['log_error_details'];

    $app->addErrorMiddleware($displayErrorDetails, $logErrors, $logErrorDetails);
};

```

## Container

### A quick guide to the container

**[Dependency injection](https://en.wikipedia.org/wiki/Dependency_injection)** is passing dependency to other objects.
Dependency injection makes testing easier. The injection can be done through a constructor.

A **dependencies injection container** (DIC) is a tool for injecting dependencies.

**A general rule:** The application itself should not use the container.
Injecting the container into a class is an **anti-pattern**. Please declare all class dependencies in your 
constructor explicitly instead. 

Why is injecting the container (in the most cases) an anti-pattern?

In Slim 3 the [Service Locator](https://blog.ploeh.dk/2010/02/03/ServiceLocatorisanAnti-Pattern/) (anti-pattern) was the
default "style" to inject the whole ([Pimple](https://pimple.symfony.com/)) container and fetch the dependencies from it. 
However, there are the following disadvantages:

* The Service Locator (anti-pattern) **hides the actual dependencies** of your class. 
* The Service Locator (anti-pattern) also violates the [Inversion of Control](https://en.wikipedia.org/wiki/Inversion_of_control) (IoC) principle of [SOLID](https://en.wikipedia.org/wiki/SOLID).

Q: How can I make it better? 

A: Use [composition over inheritance](https://en.wikipedia.org/wiki/Composition_over_inheritance) 
and (explicit) **constructor dependency injection**. 

Dependency injection is a programming practice of passing into an object it’s collaborators, 
rather the object itself creating them. 

Since **Slim 4** you can use modern tools like [PHP-DI](http://php-di.org/) with the awesome [autowire](http://php-di.org/doc/autowiring.html) feature. 
This means: Now you can declare all dependencies explicitly in your constructor and let the DIC inject these 
dependencies for you. 

To be more clear: Composition has nothing to do with the "autowire" feature of the DIC. You can use composition 
with pure classes and without a container or anything else. The autowire feature just uses the 
[PHP Reflection](https://www.php.net/manual/en/book.reflection.php) classes to resolve and inject the 
dependencies automatically for you.

### Container definitions
 
Slim 4 uses a dependency injection container to prepare, manage and inject application dependencies. 

You can add any container library that implements the [PSR-11](https://www.php-fig.org/psr/psr-11/) interface.

Create a new file for the container entries `config/container.php` and copy/paste this content:

```php
<?php

use Psr\Container\ContainerInterface;
use Selective\Config\Configuration;
use Slim\App;
use Slim\Factory\AppFactory;

return [
    Configuration::class => function () {
        return new Configuration(require __DIR__ . '/settings.php');
    },

    App::class => function (ContainerInterface $container) {
        AppFactory::setContainer($container);
        $app = AppFactory::create();

        // Optional: Set the base path to run the app in a subdirectory.
        //$app->setBasePath('/slim4-tutorial');

        return $app;
    },

];
```

## Your first route

Open the file `config/routes.php` and insert the code for the first route:

```php
<?php

use Slim\Http\Response;
use Slim\Http\ServerRequest;
use Slim\App;

return function (App $app) {
    $app->get('/', function (ServerRequest $request, Response $response) {
        $response->getBody()->write('Hello, World!');

        return $response;
    });
};

```

Now open your website, e.g. http://localhost and you should see the message `Hello, World!`.

If you get a **404 error (not found)**, you should define the correct **basePath** in `config/container.php`.

**Example:**

```
$app->setBasePath('/slim4-tutorial');
```

## PSR-4 autoloading

For the next steps we have to register the `\App` namespace for the PSR-4 autoloader.

Add this autoloading settings into `composer.json`:

```json
"autoload": {
    "psr-4": {
        "App\\": "src"
    }
},
"autoload-dev": {
    "psr-4": {
        "App\\Test\\": "tests"
    }
}
```

The complete `composer.json` file should look like this:

```json
{
    "require": {
        "php-di/php-di": "^6.0",
        "selective/config": "^0.1.0",
        "slim/http": "^0.8.0",
        "slim/psr7": "^0.6.0",
        "slim/slim": "^4.3"
    },
    "require-dev": {
        "phpunit/phpunit": "^8.4"
    },
    "autoload": {
        "psr-4": {
            "App\\": "src"
        }
    },
    "autoload-dev": {
        "psr-4": {
            "App\\Test\\": "tests"
        }
    },
    "config": {
        "process-timeout": 0,
        "sort-packages": true
    }
}
```

Run `composer update` for the changes to take effect.

## Action

Each **Single Action Controller** is represented by a individual class or closure.

The *Action* does only these things:

* collects input from the HTTP request (if needed)
* invokes the **Domain** with those inputs (if required) and retains the result
* builds an HTTP response (typically with the Domain invocation results).

All other logic, including all forms of input validation, error handling, and so on, 
are therefore pushed out of the Action and into the **Domain** 
(for domain logic concerns) or the response renderer (for presentation logic concerns). 

A response could be rendered to HTML (e.g with Twig) for a standard web request; or 
it might be something like JSON for RESTful API requests.

**Note:** [Closures](https://www.php.net/manual/en/class.closure.php) (functions) as routing 
handlers are quite "expensive", because PHP has to create all closures for each request. 
The use of class names is more lightweight, faster and scales better for larger applications.

* Create a directory: `src/`
* Create a sub-directory: `src/Action`
* Create this action class in: `src/Action/HomeAction.php`

```php
<?php

namespace App\Action;

use Slim\Http\Response;
use Slim\Http\ServerRequest;

final class HomeAction
{
    public function __invoke(ServerRequest $request, Response $response): Response
    {
        $response->getBody()->write('Hello, World!');

        return $response;
    }
}
```

Then open `config/routes.php` and replace the route closure for `/` with this line:

```php
$app->get('/', \App\Action\HomeAction::class);
```

The complete `config/routes.php` should look like this now:

```php
<?php

use Slim\App;

return function (App $app) {
    $app->get('/', \App\Action\HomeAction::class);
};
```

Now open your website, e.g. http://localhost and you should see the message `Hello, World!`.

### Writing JSON to the response

Instead of calling `json_encode` everytime, you can use the `withJson()` method to render the response.

```php
<?php

namespace App\Action;

use Slim\Http\Response;
use Slim\Http\ServerRequest;

final class HomeAction
{
    public function __invoke(ServerRequest $request, Response $response): Response
    {
        return $response->withJson(['success' => true]);
    }
}
```

Open your website, e.g. http://localhost and you should see the JSON response `{"success":true}`.

To change to http status code, just use the `$response->withStatus(x)` method. Example:

```php
$result = ['error' => ['message' => 'Validation failed']];
        
return $response->withJson($result)->withStatus(422);
```

## Domain

### Services

The [Domain](https://github.com/pmjones/adr/blob/master/ADR.md#model-versus-domain) is the place for the
complex [business logic](https://en.wikipedia.org/wiki/Business_logic).

Instead of putting the logic into gigantic (fat) "Models", we but the logic into smaller, 
specialized **Service** classes, aka Application Service.

A service provides a specific functionality or a set of functionalities, such as the retrieval of 
specified information or the execution of a set of operations, with a purpose that different clients 
can reuse for different purposes.

There can be multiple clients for a service, e.g. the action (request), 
another service, the CLI (console) and the unit-test environment (phpunit).

> A service class is not a "Manager" or "Utility" class.

Each service class should have only one responsibility, e.g. to transfer money from A to B, and not more.

Separate **data** from **behavior** by using services for the behavior and DTO's for the data.

The directory for all (domain) modules and sub-modules is: `src/Domain`

**Pseudo example:**

```php
use App\Domain\User\Data\UserCreateData;
use App\Domain\User\Service\UserCreator;

$user = new UserCreateData();
$user->username = 'john.doe';
$user->firstName = 'John';
$user->lastName = 'Doe';
$user->email = 'john.doe@example.com';

$service = new UserCreator();
$service->createUser($user);
```

### Data Transfer Objects (DTO) 
  
A DTO contains only pure **data**. There is no business or domain specific logic. 
There is also no database access within a DTO. 
A service fetches data from a repository and  the repository (or the service) 
fills the DTO with data. A DTO can be used to transfer data inside or outside the domain.

Create a DTO class to hold the data in this file: `src/Domain/User/Data/UserCreateData.php`

```php
<?php

namespace App\Domain\User\Data;

final class UserCreateData
{
    /** @var string */
    public $username;

    /** @var string */
    public $firstName;

    /** @var string */
    public $lastName;

    /** @var string */
    public $email;
}
```

Create the code for the service class `src/Domain/User/Service/UserCreator.php`:

```php
<?php

namespace App\Domain\User\Service;

use App\Domain\User\Data\UserCreateData;
use App\Domain\User\Repository\UserCreatorRepository;
use UnexpectedValueException;

/**
 * Service.
 */
final class UserCreator
{
    /**
     * @var UserCreatorRepository
     */
    private $repository;

    /**
     * The constructor.
     *
     * @param UserCreatorRepository $repository The repository
     */
    public function __construct(UserCreatorRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Create a new user.
     *
     * @param UserCreateData $user The user data
     *
     * @return int The new user ID
     */
    public function createUser(UserCreateData $user): int
    {
        // Validation
        if (empty($user->username)) {
            throw new UnexpectedValueException('Username required');
        }

        // Insert user
        $userId = $this->repository->insertUser($user);

        // Logging here: User created successfully

        return $userId;
    }
}
```

Take a look at the **constructor**! You can see that we have declared the `UserCreatorRepository` as a
dependency, because the service can only interact with the database through the repository.

### Repositories

A repository is responsible for the data access logic, communication with database(s).

There are two types of repositories: collection-oriented and persistence-oriented repositories. 
In this case, we are talking about **persistence-oriented repositories**, since these are better 
suited for processing large amounts of data.

A repository is the source of all the data your application needs 
and mediates between the service and the database. A repository improves code maintainability, testing and readability by separating **business logic** 
from **data access logic** and provides centrally managed and consistent access rules for a data source. 
Each public repository method represents a query. The return values represent the result set 
of a query and can be primitive/object or list (array) of them. Database transactions must 
be handled on a higher level (service) and not within a repository.

### Creating a repository

For this tutorial we need a test database with a `users` table.
Please execute this SQL statement in your test database.

```sql
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

Add the database settings into: `config/settings.php`:

```php
// Database settings
$settings['db'] = [
    'driver' => 'Pdo_Mysql',
    'hostname' => 'localhost',
    'username' => 'root',
    'database' => 'test',
    'password' => '',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'driver_options' => [
        // Turn off persistent connections
        PDO::ATTR_PERSISTENT => false,
        // Enable exceptions
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        // Emulate prepared statements
        PDO::ATTR_EMULATE_PREPARES => true,
        // Set default fetch mode to array
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        // Set character set
        PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci'
    ],
];
```

As next we are installing [zendframework/zend-db](https://docs.zendframework.com/zend-db/) for building SQL queries.

To install the query builder, run:

```php
composer require zendframework/zend-db
```

To configure the database connection we have to add an `\Zend\Db\Adapter\AdapterInterface` container definition. 

Copy and paste the following entries into `config/container.php`:

```php
<?php

use Psr\Container\ContainerInterface;
use Selective\Config\Configuration;
use Slim\App;
use Slim\Factory\AppFactory;
use Zend\Db\Adapter\Adapter;
use Zend\Db\Adapter\AdapterInterface;

return [

    // ...
    
    AdapterInterface::class => function (ContainerInterface $container) {
        return new Adapter($container->get(Configuration::class)->getArray('db'));
    },

    PDO::class => function (ContainerInterface $container) {
        $connection = $container->get(AdapterInterface::class)->getDriver()->getConnection();
        $connection->connect();

        return $connection->getResource();
    },
];
```

Add the `QueryFactory` class into: `src/Factory/QueryFactory.php` and copy / paste this content:

```php
<?php

namespace App\Factory;

use Zend\Db\Adapter\AdapterInterface;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\TableGateway\TableGateway;

final class QueryFactory
{
    /**
     * @var AdapterInterface The database connection
     */
    private $adapter;

    public function __construct(AdapterInterface $adapter)
    {
        $this->adapter = $adapter;
    }

    public function table(string $table): TableGateway
    {
        return new TableGateway($table, $this->adapter, null, new ResultSet(ResultSet::TYPE_ARRAY));
    }
}
```

Create a new directory: `src/Domain/User/Repository`

Create the file: `src/Domain/User/Repository/UserCreatorRepository.php` and insert this content:

```php
<?php

namespace App\Domain\User\Repository;

use App\Domain\User\Data\UserCreateData;
use App\Factory\QueryFactory;

/**
 * Repository.
 */
class UserCreatorRepository
{
    /**
     * @var QueryFactory The query builder factory
     */
    private $queryFactory;

    /**
     * Constructor.
     *
     * @param QueryFactory $queryFactory The query builder factory
     */
    public function __construct(QueryFactory $queryFactory)
    {
        $this->queryFactory = $queryFactory;
    }

    /**
     * Insert user row.
     *
     * @param UserCreateData $user The user
     *
     * @return int The new ID
     */
    public function insertUser(UserCreateData $user): int
    {
        $values = [
            'username' => $user->username,
            'first_name' => $user->firstName,
            'last_name' => $user->lastName,
            'email' => $user->email,
        ];

        // Insert record
        $table = $this->queryFactory->table('users');
        $table->insert($values);

        // Return new primary key value (id)
        return (int)$table->getLastInsertValue();
    }
}

```

Note that we have declared `QueryFactory` as a dependency, because the repository requires a database connection.

You can use the query builder to create `SELECT`, `UPDATE`, `INSERT` and `DELETE` statements.
Here are some examples:

Select all rows (for simple queries):

```php
$rows = $this->queryFactory->table('users')->select( /* where */ );

foreach ($rows as $row) {
    print_r($row);
}
```

Select all rows (for complex queries):

```php
$table = $this->queryFactory->table('users');

$select = $table->getSql()->select();
$select->columns(['id']);
$select->where(['id' => 1]);

$rows = $table->selectWith($select);

foreach ($rows as $row) {
    print_r($row);
}
```

Select only the first row:

```php
$row = $this->queryFactory->table('users')
    ->select(['id' => 1])->current();
```

Insert a record:

```php
$table = $this->queryFactory->table('users');
$table->insert($values);

$newId = (int)$table->getLastInsertValue();
```

Update a record:

```php
$this->queryFactory->table('users')
    ->update(['email' => 'new@example.com'], ['id' => 1]);
```

Delete a record:

```php
$this->queryFactory->table('users')
    ->delete(['id' => 1]);
```

The last part is to register a new route for `POST /users`.

Create a new action class in: `src/Action/UserCreateAction.php`:

```php
<?php

namespace App\Action;

use App\Domain\User\Data\UserCreateData;
use App\Domain\User\Service\UserCreator;
use Slim\Http\Response;
use Slim\Http\ServerRequest;

final class UserCreateAction
{
    private $userCreator;

    public function __construct(UserCreator $userCreator)
    {
        $this->userCreator = $userCreator;
    }

    public function __invoke(ServerRequest $request, Response $response): Response
    {
        // Collect input from the HTTP request
        $data = (array)$request->getParsedBody();

        // Mapping (should be done in a mapper class)
        $user = new UserCreateData();
        $user->username = $data['username'];
        $user->firstName = $data['first_name'];
        $user->lastName = $data['last_name'];
        $user->email = $data['email'];

        // Invoke the Domain with inputs and retain the result
        $userId = $this->userCreator->createUser($user);

        // Transform the result into the JSON representation
        $result = [
            'user_id' => $userId
        ];

        // Build the HTTP response
        return $response->withJson($result)->withStatus(201);
    }
}
```

In this example, we create a "barrier" between source data and output 
so that schema changes do not affect the clients. For the sake of 
simplicity, this is done using the same method. In reality, you would 
separate the input data mapping and output JSON conversion into 
separate parts of your application.

Add the new route in `config/routes.php`:

```php
$app->post('/users', \App\Action\UserCreateAction::class);
```

The complete project structure should look like this now:

![image](https://user-images.githubusercontent.com/781074/69903795-bde6c700-139e-11ea-8b97-8e56bb5d8bf6.png)

Now you can test the `POST /users` route with [Postman](https://www.getpostman.com/) to see if it works.

If successful, the result should look like this:

![image](https://user-images.githubusercontent.com/781074/68299379-ddd6e380-009b-11ea-9ead-4c3b12b62807.png)

## Deployment

For deployment on a productive server, there are some important settings and security related things to consider.

You can use composer to generate an optimized build of your application. 
All dev-dependencies are removed and the Composer autoloader is optimized for performance. 

Run this command in the same directory as the project’s composer.json file:

```
composer install --no-dev --optimize-autoloader
```

You don't have to run composer on your production server. Instead you should implement a [build pipeline](https://www.amazon.com/dp/B003YMNVC0) that creates
an so called "artifact". An artifact is an ZIP file you can upload and deploy on your production server. 
[selective-php/artifact](https://github.com/selective-php/artifact) is a tool to build artifacts from your source code.

For security reason you should turn of all error details in production:

```php
$app->addErrorMiddleware(false, false, false);
```

If you have to run your Slim application in a sub-directory, you could try this library: [selective/basepath](https://github.com/selective-php/basepath)

**Important**: It's very important to set the Apache `DocumentRoot` to the `public/` directory. 
Otherwise, it may happen that someone else could access internal files from the web. [More details](https://www.digitalocean.com/community/tutorials/how-to-move-an-apache-web-root-to-a-new-location-on-ubuntu-16-04)

`/etc/apache2/sites-enabled/000-default.conf`

```htacess
DocumentRoot /var/www/example.com/htdocs/public
```

**Tip:** Never store secret passwords in your git / SVN repository. 
Instead you could store them in a file like `env.php` and place this file one directory above your application directory. e.g.

```
/var/www/example.com/env.php
```

## Conclusion

Remember the relationships:

* Slim - To handle the routing
* Single Action Controllers - To invoke the correct service method (domain)
* Domain - The core of your application
* Services - To handle business logic
* DTO - To carry data (no behavior)
* Repositories - To build and execute database queries
