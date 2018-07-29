---
title: Using Atlas 3 with Slim
---

This cookbook entry describes how to use the [Atlas 3](http://atlasphp.io) ORM
and its command-line tooling with Slim.


## Installation

Install Atlas using Composer. The ORM and CLI packages are delivered separately,
since you are likely to need the command line tooling only in development:

```
composer require atlas/orm ~3.0
composer require --dev atlas/cli ~2.0
```

> **Note:**
>
> If you are using PHPStorm, you may wish to copy the IDE meta file to your
> project to get full autocompletion on Atlas classes:
>
> ```
> cp ./vendor/atlas/orm/resources/phpstorm.meta.php ./.phpstorm.meta.php
> ```

## Settings and Configuration

Now you need to add some database connection settings to your configuration.
You can add them under any array key you like; the following example uses
`['settings']['atlas']`:

```php
<?php
// ./config/settings.php
return [
    'settings' => [
        'displayErrorDetails' => true,
        'determineRouteBeforeAppMiddleware' => false,
        'atlas' => [
            'pdo' => [
                'mysql:dbname=testdb;host=localhost',
                'username',
                'password',
            ],
            'namespace' => 'DataSource',
            'directory' => dirname(__DIR__) . '/src/classes/DataSource',
        ]
    ]
];
```

The `pdo` elements are used as arguments for your
[PDO connection](https://secure.php.net/manual/en/pdo.construct.php).

The `namespace` and `directory` elements specify the namespace for your Atlas
data source classes, and the directory where they will be saved by the skeleton
generator. Your `composer.json` will need have a PSR autoloader entry for these;
the above example corresponds to the Slim
[tutorial application](https://github.com/slimphp/Tutorial-First-Application).

## Generating Skeleton Classes

Now you can generate your skeleton data source classes with the Atlas CLI
tooling. First, create the target directory, then issue the skeleton command:

```
mkdir -p ./src/classes/DataSource
php ./vendor/bin/atlas-skeleton.php ./config/settings.php settings.atlas
```

The first argument to `atlas-skeleton` is the path to your Slim config file. The
second argument is a dot-separated list of the keys leading to the Atlas array
within the settings.

With that command, Atlas will examine your database and generate a series of
classes and traits for each table in the schema. You can see the files generated
for each table [here](http://atlasphp.io/cassini/skeleton/usage.html#1-2-1-2).

## Container Service Definition

With the data mapper classes in place, you can now add the Atlas ORM as a
service in the Slim container:

```php
<?php
$container = $app->getContainer();
$container['atlas'] = function ($container) {
    $args = $container['settings']['atlas']['pdo'];
    $atlasBuilder = new AtlasBuilder(...$args);
    $atlasBuilder->setFactory(function ($class) use ($container) {
        if ($container->has($class)) {
            return $container->get($class);
        }

        return new $class();
    });
    return $atlasBuilder->newAtlas();
};
```

This uses the AtlasBuilder class to create and return a new ORM instance, with
the PDO connection arguments from your settings configuration.

> **Note:**
>
> This service definition tells Atlas to use the Container itself as a factory
> for certain class constructions. If you have Atlas TableEvent or MapperEvent
> classes defined as services in the Container, Atlas will use the Container
> to build them for you.

## Using the ORM

At this point, you can use the full power of the Atlas ORM in your action code.
The following examples are adapted from the
[tutorial application](https://github.com/slimphp/Tutorial-First-Application):

```php
<?php
use DataSource\Ticket\Ticket;
use DataSource\Component\Component;

$app->get('/tickets', function (Request $request, Response $response) {
    $this->logger->addInfo("Ticket list");
    $tickets = $this->atlas->select(Ticket::class)->fetchRecordSet();

    $response = $this->view->render(
        $response,
        "tickets.phtml",
        [
            "tickets" => $tickets,
            "router" => $this->router
        ]
    );
    return $response;
});

$app->get('/ticket/{id}', function (Request $request, Response $response, $args) {
    $ticket_id = (int) $args['id'];
    $ticket = $this->atlas->fetchRecord(Ticket::class, $ticket_id);

    $response = $this->view->render(
        $response,
        "ticketdetail.phtml",
        [
            "ticket" => $ticket
        ]
    );
    return $response;
})->setName('ticket-detail');

$app->post('/ticket/new', function (Request $request, Response $response) {
    $data = $request->getParsedBody();

    $ticket = $this->atlas->newRecord(Ticket::class);
    $ticket->title = filter_var($data['title'], FILTER_SANITIZE_STRING);
    $ticket->description = filter_var($data['description'], FILTER_SANITIZE_STRING);

    $component_id = (int) $data['component'];
    $component = $this->atlas->fetchRecord(Component::class, $component_id)
    $ticket->component = $component->getName();

    $this->atlas->persist($ticket);

    $response = $response->withRedirect("/tickets");
    return $response;
});
```

That's it!

For more information on how to use Atlas to its greatest extent, be sure to
[read the official documentation](http://atlasphp.io/cassini/orm/):

- [Defining relationships between mappers](http://atlasphp.io/cassini/orm/relationships.html)

- [Fetching Records and RecordSets](http://atlasphp.io/cassini/orm/reading.html)

- Working with [Records](http://atlasphp.io/cassini/orm/records.html)
  and [RecordSets](http://atlasphp.io/cassini/orm/record-sets.html)

- [Managing transactions](http://atlasphp.io/cassini/orm/transactions.html)

- [Adding behaviors](http://atlasphp.io/cassini/orm/behavior.html)

- [Handling events](http://atlasphp.io/cassini/orm/events.html)

- [Direct lower-level queries](http://atlasphp.io/cassini/orm/direct.html)

- [Other topics](http://atlasphp.io/cassini/orm/other.html) such as custom mapper
  methods, single table inheritance, many-to-many relationships, and automated
  validation

Enjoy!
