Slim has a built-in resource locator, providing an easy way to inject objects into a Slim app, or
to override any of the Slim app's internal objects (e.g. Request, Response, Log).

## Injecting simple values

If you want to use Slim as a simple key-value store, it is as simple as this:

    <?php
    $app = new \Slim\Slim();
    $app->foo = 'bar';

Now, you can fetch this value anywhere with `$app->foo` and get its value `bar`.

## Using the resource locator

You can also use Slim as a resource locator by injecting closures that define how
your desired objects will be constructed. When the injected closure is requested, it will
be invoked and the closure's return value will be returned.

    <?php
    $app = new \Slim\Slim();

    // Determine method to create UUIDs
    $app->uuid = function () {
        return exec('uuidgen');
    };

    // Get a new UUID
    $uuid = $app->uuid;

### Singleton resources

Sometimes, you may want your resource definitions to stay the same each time they are requested
(i.e. they should be singletons within the scope of the Slim app). This is easy to do:

    <?php
    $app = new \Slim\Slim();

    // Define log resource
    $app->container->singleton('log', function () {
        return new \My\Custom\Log();
    });

    // Get log resource
    $log = $app->log;

Every time you request the log resource with `$app->log`, it will return the same instance.

### Closure resources

What if you want to literally store a closure as the raw value and not have it invoked? You can do that
like this:

    <?php
    $app = new \Slim\Slim();

    // Define closure
    $app->myClosure = $app->container->protect(function () {});

    // Return raw closure without invoking it
    $myClosure = $app->myClosure;
