A callable is assigned to a hook using the Slim application’s `hook()` method:

    <?php
    $app = new \Slim\Slim();
    $app->hook('the.hook.name', function () {
        //Do something
    });

The first argument is the hook name, and the second argument is the callable. Each hook maintains a priority
list of registered callables. By default, each callable assigned to a hook is given a priority of 10. You can give
your callable a different priority by passing an integer as the third parameter of the `hook()` method:

    <?php
    $app = new \Slim\Slim();
    $app->hook('the.hook.name', function () {
        //Do something
    }, 5);

The example above assigns a priority of 5 to the callable. When the hook is called, it will sort all callables
assigned to it by priority (ascending). A callable with priority 1 will be invoked before a callable with priority 10.

Hooks do not pass arguments to their callables. If a callable needs to access the Slim application, you can inject
the application into the callback with the `use` keyword or with the Slim application's static `getInstance()` method:

    <?php
    $app = new \Slim\Slim();
    $app->hook('the.hook.name', function () use ($app) {
        // Do something
    });
