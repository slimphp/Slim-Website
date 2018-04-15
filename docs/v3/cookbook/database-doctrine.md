---
title: Using Doctrine with Slim
---

This cookbook entry describes how to integrate from scratch the widely used [Doctrine ORM](http://docs.doctrine-project.org/projects/doctrine-orm/en/latest/) into a Slim application.

## Adding Doctrine to your application

The first step is importing the library into the `vendor` directory of your project using [composer](https://getcomposer.org/).

<figure markdown="1">
```bash
composer require doctrine/orm:^2
```
<figcaption>Figure 1: Require doctrine in your application.</figcaption>
</figure>

## Provide database credentials


Next, add the Doctrine settings alongside your Slim configuration.

<figure markdown="1">
```php
<?php

// settings.php

define('APP_ROOT', __DIR__);

return [
    'settings' => [
        'displayErrorDetails' => true,
        'determineRouteBeforeAppMiddleware' => false,

        'doctrine' => [
            // if true, metadata caching is forcefully disabled
            'dev_mode' => true,

            // path where the compiled metadata info will be cached
            // make sure the path exists and it is writable
            'cache_dir' => APP_ROOT . '/var/doctrine',

            // you should add any other path containing annotated entity classes
            'metadata_dirs' => [APP_ROOT . '/src/Domain'],

            'connection' => [
                'driver' => 'pdo_mysql',
                'host' => 'localhost',
                'port' => 3306,
                'dbname' => 'mydb',
                'user' => 'user',
                'password' => 'secret',
                'charset' => 'utf-8'
            ]
        ]
    ]
];
```
<figcaption>Figure 2: Slim settings array.</figcaption>
</figure>

## Define the EntityManager service

Now we define the `EntityManager` service, which is the primary way to interact with Doctrine.
Here we show how to configure the metadata reader to work with PHP annotations, which is at the
same time the most used mode and the most tricky to set up. Alternatively, XML or YAML can also
be used to describe the database schema.

<figure markdown="1">
```php
<?php

// bootstrap.php

use Doctrine\Common\Annotations\AnnotationReader;
use Doctrine\Common\Cache\FilesystemCache;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Mapping\Driver\AnnotationDriver;
use Doctrine\ORM\Tools\Setup;
use Slim\Container;

require_once __DIR__ . '/vendor/autoload.php';

$container = new Container(require __DIR__ . '/settings.php');

$container[EntityManager::class] = function (Container $container): EntityManager {
    $config = Setup::createAnnotationMetadataConfiguration(
        $container['settings']['doctrine']['metadata_dirs'],
        $container['settings']['doctrine']['dev_mode']
    );

    $config->setMetadataDriverImpl(
        new AnnotationDriver(
            new AnnotationReader,
            $container['settings']['doctrine']['metadata_dirs']
        )
    );

    $config->setMetadataCacheImpl(
        new FilesystemCache(
            $container['settings']['doctrine']['cache_dir']
        )
    );

    return EntityManager::create(
        $container['settings']['doctrine']['connection'],
        $config
    );
};

return $container;
```
<figcaption>Figure 3: Defining the EntityManager service.</figcaption>
</figure>

## Create the Doctrine console

To run database migrations, validate class annotations and so on you will use the `doctrine` CLI application that is
already present at `vendor/bin`. But in order to work, this script needs a [`cli-config.php`](http://docs.doctrine-project.org/en/latest/reference/configuration.html#setting-up-the-commandline-tool)
file at the root of the project telling it how to find the `EntityManager` we just set up:

<figure markdown="1">
```php
<?php

// cli-config.php

use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Tools\Console\ConsoleRunner;
use Slim\Container;

/** @var Container $container */
$container = require_once __DIR__ . '/bootstrap.php';

ConsoleRunner::run(
    ConsoleRunner::createHelperSet($container[EntityManager::class])
);
```
<figcaption>Figure 4: Enabling Doctrine's console app.</figcaption>
</figure>

Take a moment to verify that the console app works. When properly configured, its output will look more or less like this:


<figure markdown="1">
```bash
$ php vendor/bin/doctrine
Doctrine Command Line Interface 2.5.12

Usage:
  command [options] [arguments]

Options:
  -h, --help            Display this help message
  -q, --quiet           Do not output any message
  -V, --version         Display this application version
      --ansi            Force ANSI output
      --no-ansi         Disable ANSI output
  -n, --no-interaction  Do not ask any interactive question
  -v|vv|vvv, --verbose  Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug

Available commands:
  help                            Displays help for a command
  list                            Lists commands
 dbal
  dbal:import                     Import SQL file(s) directly to Database.
  dbal:run-sql                    Executes arbitrary SQL directly from the command line.
 orm
  orm:clear-cache:metadata        Clear all metadata cache of the various cache drivers.
  orm:clear-cache:query           Clear all query cache of the various cache drivers.
  orm:clear-cache:result          Clear all result cache of the various cache drivers.
  orm:convert-d1-schema           [orm:convert:d1-schema] Converts Doctrine 1.X schema into a Doctrine 2.X schema.
  orm:convert-mapping             [orm:convert:mapping] Convert mapping information between supported formats.
  orm:ensure-production-settings  Verify that Doctrine is properly configured for a production environment.
  orm:generate-entities           [orm:generate:entities] Generate entity classes and method stubs from your mapping information.
  orm:generate-proxies            [orm:generate:proxies] Generates proxy classes for entity classes.
  orm:generate-repositories       [orm:generate:repositories] Generate repository classes from your mapping information.
  orm:info                        Show basic information about all mapped entities
  orm:mapping:describe            Display information about mapped objects
  orm:run-dql                     Executes arbitrary DQL directly from the command line.
  orm:schema-tool:create          Processes the schema and either create it directly on EntityManager Storage Connection or generate the SQL output.
  orm:schema-tool:drop            Drop the complete database schema of EntityManager Storage Connection or generate the corresponding SQL output.
  orm:schema-tool:update          Executes (or dumps) the SQL needed to update the database schema to match the current mapping metadata.
  orm:validate-schema             Validate the mapping files.
```
<figcaption>Figure 5: Test-driving Docrine's console application.</figcaption>
</figure>

If it works, you can now create your database and load the schema by running `php vendor/bin/doctrine orm:schema-tool:update`

## Using the EntityManager in our own code

Congratulations! Now you can already manage your database from the command line, and use the `EntityManager` wherever you need it.

<figure markdown="1">
```php

$container[UserRepository::class] = function ($container) {
    return new UserRepository($container[EntityManager::class]);
};

// src/UserRepository.php

class UserRepository
{
    /**
     * @var EntityManager
     */
    private $em;

    public function __construct(EntityManager $em)
    {
        $this->em = $em;
    }

    public function signUp(string $email, string $password): User
    {
        $user = new User($email, $password);

        $this->em->persist($user);
        $this->em->flush();

        return $user;
    }
}
```
<figcaption>Figure 6: Using the EntityManager service.</figcaption>
</figure>

## Other resources

- The [official Doctrine ORM documentation](http://docs.doctrine-project.org/projects/doctrine-orm/en/latest/).
- [A full example](https://github.com/1ma/Slim-Doctrine-Demo) of the above configuration in a small, functioning project.
