Slim enables you to associate middleware with a specific application route. When the given route matches the current
HTTP request and is invoked, Slim will first invoke the associated middleware in the order they are defined.

### What is route middleware?

Route middleware is anything that returns `true` for `is_callable`. Route middleware will be invoked in the sequence
defined before its related route callback is invoked.

### How do I add route middleware?

When you define a new application route with the Slim application’s `get()`, `post()`, `put()`, or `delete()` methods
you must define a route pattern and a callable to be invoked when the route matches an HTTP request.

    <?php
    $app = new \Slim\Slim();
    $app->get('/foo', function () {
        //Do something
    });

In the example above, the first argument is the route pattern. The last argument is the callable to be invoked when
the route matches the current HTTP request. The route pattern must always be the first argument. The route callable
must always be the last argument.

You can assign middleware to this route by passing each middleware as a separate interior or... (ahem) middle...
argument like this:

    <?php
    function mw1() {
        echo "This is middleware!";
    }
    function mw2() {
        echo "This is middleware!";
    }
    $app = new \Slim\Slim();
    $app->get('/foo', 'mw1', 'mw2', function () {
        //Do something
    });

When the /foo route is invoked, the `mw1` and `mw2` functions will be invoked in sequence before the route’s callable
is invoked.

Suppose you wanted to authenticate the current user against a given role for a specific route. You could use some
closure magic like this:

    <?php
    $authenticateForRole = function ( $role = 'member' ) {
        return function () use ( $role ) {
            $user = User::fetchFromDatabaseSomehow();
            if ( $user->belongsToRole($role) === false ) {
                $app = \Slim\Slim::getInstance();
                $app->flash('error', 'Login required');
                $app->redirect('/login');
            }
        };
    };
    $app = new \Slim\Slim();
    $app->get('/foo', $authenticateForRole('admin'), function () {
        //Display admin control panel
    });

### What arguments are passed into each route middleware callable?

Each middleware callable is invoked with one argument, the currently matched `\Slim\Route` object.

    <?php
    $aBitOfInfo = function (\Slim\Route $route) {
        echo "Current route is " . $route->getName();
    };

    $app->get('/foo', $aBitOfInfo, function () {
        echo "foo";
    });
