---
title: Using Doctrine with Slim
---

This cookbook entry describes how to integrate the widely used [Doctrine ORM](http://docs.doctrine-project.org/projects/doctrine-orm/en/latest/) into a Slim 4 application from scratch.

## Adding Doctrine to your application

The first step is importing the Doctrine ORM into your project using [composer](https://getcomposer.org/).

```bash
composer require doctrine/orm symfony/cache
```

Note that on April 30th 2021 Doctrine officially deprecated `doctrine/cache` when it released version v2.0.0, which deleted all cache implementations from that library.
Since then they recommend using `symfony/cache` instead, a PSR-6 compliant implementation.
You only need it if you want to cache Doctrine metadata in production but there's no downside to do it, so we'll show how to set it up.

If you have not yet migrated to PHP8 or simply want to continue using traditional PHPDoc comments to annotate your entities you'll also need to import the `doctrine/annotations` package, which used to be a dependency of `doctrine/orm` but since 2.10.0 is optional:

```bash
composer require doctrine/annotations
```

## Define your first Entity

You can skip this step and use your actual Doctrine entities instead.
The following is just an example.

Note that it uses PHP 8 attributes, convert them to PHPDoc annotations if you need to.

<figure markdown="1">
```php
<?php

// src/Domain/User.php

use DateTimeImmutable;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Table;

#[Entity, Table(name: 'users')]
final class User
{
    #[Id, Column(type: 'integer'), GeneratedValue(strategy: 'AUTO')]
    private int $id;

    #[Column(type: 'string', unique: true, nullable: false)]
    private string $email;

    #[Column(name: 'registered_at', type: 'datetimetz_immutable', nullable: false)]
    private DateTimeImmutable $registeredAt;

    public function __construct(string $email)
    {
        $this->email = $email;
        $this->registeredAt = new DateTimeImmutable('now');
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getRegisteredAt(): DateTimeImmutable
    {
        return $this->registeredAt;
    }
}
```
<figcaption>Figure 1: A sample Doctrine entity.</figcaption>
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
        'slim' => [
            // Returns a detailed HTML page with error details and
            // a stack trace. Should be disabled in production.
            'displayErrorDetails' => true,

            // Whether to display errors on the internal PHP log or not.
            'logErrors' => true,

            // If true, display full errors with message and stack trace on the PHP log.
            // If false, display only "Slim Application Error" on the PHP log.
            // Doesn't do anything when 'logErrors' is false.
            'logErrorDetails' => true,
        ],

        'doctrine' => [
            // Enables or disables Doctrine metadata caching
            // for either performance or convenience during development.
            'dev_mode' => true,

            // Path where Doctrine will cache the processed metadata
            // when 'dev_mode' is false.
            'cache_dir' => APP_ROOT . '/var/doctrine',

            // List of paths where Doctrine will search for metadata.
            // Metadata can be either YML/XML files or PHP classes annotated
            // with comments or PHP8 attributes.
            'metadata_dirs' => [APP_ROOT . '/src/Domain'],

            // The parameters Doctrine needs to connect to your database.
            // These parameters depend on the driver (for instance the 'pdo_sqlite' driver
            // needs a 'path' parameter and doesn't use most of the ones shown in this example).
            // Refer to the Doctrine documentation to see the full list
            // of valid parameters: https://www.doctrine-project.org/projects/doctrine-dbal/en/current/reference/configuration.html
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

Now we define the `EntityManager` service, which is the main point of interaction with the ORM in your code.

Slim 4 requires that you provide your own PSR-11 container implementation.
This example uses [`uma/dic`](https://github.com/1ma/dic), a simple and concise PSR-11 container.
Adapt this to your own choice of container.

Traditionally the annotation metadata reader was the most popular, but starting from `doctrine/orm` 2.10.0 they made the dependency on `doctrine/annotations` optional, hinting that the project prefers users to migrate to the modern PHP8 attribute notation.

Here we show how to configure the metadata reader with PHP8 attributes.
If you have not yet migrated to PHP8 or want to use traditional PHPDoc annotations you'll need to explicitly require `doctrine/annotations` with Composer and call `Setup::createAnnotationMetadataConfiguration(...)` instead of `Setup::createAttributeMetadataConfiguration(...)` as in the following example.

<figure markdown="1">
```php
<?php

// bootstrap.php

use Doctrine\Common\Cache\Psr6\DoctrineProvider;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Tools\Setup;
use Psr\Container\ContainerInterface;
use Symfony\Component\Cache\Adapter\ArrayAdapter;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use UMA\DIC\Container;

require_once __DIR__ . '/vendor/autoload.php';

$container = new Container(require __DIR__ . '/settings.php');

$container->set(EntityManager::class, static function (Container $c): EntityManager {
    /** @var array $settings */
    $settings = $c->get('settings');

    // Use the ArrayAdapter or the FilesystemAdapter depending on the value of the 'dev_mode' setting
    // You can substitute the FilesystemAdapter for any other cache you prefer from the symfony/cache library
    $cache = $settings['doctrine']['dev_mode'] ?
        DoctrineProvider::wrap(new ArrayAdapter()) :
        DoctrineProvider::wrap(new FilesystemAdapter(directory: $settings['doctrine']['cache_dir']));

    $config = Setup::createAttributeMetadataConfiguration(
        $settings['doctrine']['metadata_dirs'],
        $settings['doctrine']['dev_mode'],
        null,
        $cache
    );

    return EntityManager::create($settings['doctrine']['connection'], $config);
});

return $container;
```
<figcaption>Figure 3: Defining the EntityManager service.</figcaption>
</figure>

## Create the Doctrine console

To run database migrations, validate class annotations and so on you will use the `doctrine` CLI application that is already present at `vendor/bin`. 
But in order to work this script needs a [`cli-config.php`](http://docs.doctrine-project.org/en/latest/reference/configuration.html#setting-up-the-commandline-tool) file at the root of the project telling it how to find the `EntityManager` we just set up.

Our `cli-config.php` only needs to retrieve the EntityManager service we just defined in our container and pass it to `ConsoleRunner::createHelperSet()`.

<figure markdown="1">
```php
<?php

// cli-config.php

use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Tools\Console\ConsoleRunner;
use Slim\Container;

/** @var Container $container */
$container = require_once __DIR__ . '/bootstrap.php';

return ConsoleRunner::createHelperSet($container->get(EntityManager::class));
```

<figcaption>Figure 4: Enabling Doctrine's console app.</figcaption>
</figure>

Take a moment to verify that the console app works. 
When properly configured, its output will look more or less like this:

<figure markdown="1">
```bash
$ php vendor/bin/doctrine
Doctrine Command Line Interface 2.11.0

Usage:
  command [options] [arguments]

Options:
  -h, --help            Display help for the given command. When no command is given display help for the list command
  -q, --quiet           Do not output any message
  -V, --version         Display this application version
      --ansi|--no-ansi  Force (or disable --no-ansi) ANSI output
  -n, --no-interaction  Do not ask any interactive question
  -v|vv|vvv, --verbose  Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug

Available commands:
  completion                         Dump the shell completion script
  help                               Display help for a command
  list                               List commands
 dbal
  dbal:reserved-words                Checks if the current database contains identifiers that are reserved.
  dbal:run-sql                       Executes arbitrary SQL directly from the command line.
 orm
  orm:clear-cache:metadata           Clear all metadata cache of the various cache drivers
  orm:clear-cache:query              Clear all query cache of the various cache drivers
  orm:clear-cache:region:collection  Clear a second-level cache collection region
  orm:clear-cache:region:entity      Clear a second-level cache entity region
  orm:clear-cache:region:query       Clear a second-level cache query region
  orm:clear-cache:result             Clear all result cache of the various cache drivers
  orm:convert-d1-schema              [orm:convert:d1-schema] Converts Doctrine 1.x schema into a Doctrine 2.x schema
  orm:convert-mapping                [orm:convert:mapping] Convert mapping information between supported formats
  orm:ensure-production-settings     Verify that Doctrine is properly configured for a production environment
  orm:generate-entities              [orm:generate:entities] Generate entity classes and method stubs from your mapping information
  orm:generate-proxies               [orm:generate:proxies] Generates proxy classes for entity classes
  orm:generate-repositories          [orm:generate:repositories] Generate repository classes from your mapping information
  orm:info                           Show basic information about all mapped entities
  orm:mapping:describe               Display information about mapped objects
  orm:run-dql                        Executes arbitrary DQL directly from the command line
  orm:schema-tool:create             Processes the schema and either create it directly on EntityManager Storage Connection or generate the SQL output
  orm:schema-tool:drop               Drop the complete database schema of EntityManager Storage Connection or generate the corresponding SQL output
  orm:schema-tool:update             Executes (or dumps) the SQL needed to update the database schema to match the current mapping metadata
  orm:validate-schema                Validate the mapping files
```
<figcaption>Figure 5: Sanity-checking Doctrine's CLI.</figcaption>
</figure>

At this point you can initialize the database and load the schema by running `php vendor/bin/doctrine orm:schema-tool:create`.

## Using the EntityManager in our own code

Congratulations! 
You can now manage your database from the command line and use the `EntityManager` wherever you need it in your code.

<figure markdown="1">
```php

// bootstrap.php

$container->set(UserService::class, static function (Container $c) {
    return new UserService($c->get(EntityManager::class));
});

// src/UserService.php

final class UserService
{
    private EntityManager $em;

    public function __construct(EntityManager $em)
    {
        $this->em = $em;
    }

    public function signUp(string $email): User
    {
        $newUser = new User($email);

        $this->em->persist($newUser);
        $this->em->flush();

        return $newUser;
    }
}
```
<figcaption>Figure 6: Using the EntityManager service in your own code.</figcaption>
</figure>

## Other resources

- The [official Doctrine ORM documentation](http://docs.doctrine-project.org/projects/doctrine-orm/en/latest/).
- [A full example](https://github.com/1ma/Slim-Doctrine-Demo) of the above setup in a small but complete project.
