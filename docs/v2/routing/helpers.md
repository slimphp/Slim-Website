---
title: Helpers
---
Slim provides several helper methods (exposed via the Slim application instance) that will help you control the flow
of your application.

Please be aware that the following application instance method helpers `halt()`, `pass()`, `redirect()` and `stop()`
are implemented using Exceptions. Each will throw a `\Slim\Exception\Stop` or `\Slim\Exception\Pass` exception.
Throwing the Exception in these cases is a simple way to stop user code from processing, have the framework take over,
and  immediately send the necessary response to the client. This behavior can be surprising if unexpected. Take a look
at the following code.

    <?php
    $app->get('/', function() use ($app, $obj) {
        try {
            $obj->thisMightThrowException();
            $app->redirect('/success');
        } catch(\Exception $e) {
            $app->flash('error', $e->getMessage());
            $app->redirect('/error');
        }
    });

If `$obj->thisMightThrowException()` does throw an Exception the code will run as expected. However, if no exception
is thrown the call to $app->redirect() will throw a `\Slim\Exception\Stop` Exception that will be caught by the
user `catch` block rather than by the framework redirecting the browser to the "/error" page. Where possible
in your own application you should use typed Exceptions so your `catch` blocks are more targeted rather than
swallowing all Exceptions. In some situations the `thisMightThrowException()` might be an external component call
that you don’t control, in which case typing all exceptions thrown may not be feasible. For these instances we can
adjust our code slightly by moving the success `$app->redirect()` after the try/catch block to fix the issues.
Since processing will stop on the error redirect this code will now execute as expected.

    <?php
    $app->get('/', function() use ($app, $obj) {
        try {
            $obj->thisMightThrowException();
        } catch(Exception $e) {
            $app->flash('error', $e->getMessage());
            $app->redirect('/error');
        }
        $app->redirect('/success');
    });

### Halt

The Slim application's `halt()` method will immediately return an HTTP response with a given status code and body.
This method accepts two arguments: the HTTP status code and an optional message. Slim will immediately halt the current
application and send an HTTP response to the client with the specified status and optional message (as the response body).
This will override the existing `\Slim\Http\Response` object.

    <?php
    $app = new \Slim\Slim();

    //Send a default 500 error response
    $app->halt(500);

    //Or if you encounter a Balrog...
    $app->halt(403, 'You shall not pass!');

    //Or if you'd like to have a tea but you have no teapot at hand (and you respect [RFC7168](https://tools.ietf.org/html/rfc7168))
    $app->halt(418, 'Feel free to take me as teapot!');

If you would like to render a template with a list of error messages, you should use the Slim application's `render()`
method instead.

    <?php
    $app = new \Slim\Slim();
    $app->get('/foo', function () use ($app) {
        $errorData = array('error' => 'Permission Denied');
        $app->render('errorTemplate.php', $errorData, 403);
    });
    $app->run();

The `halt()` method may send any type of HTTP response to the client: informational, success, redirect, not found,
client error, or server error.

### Pass

A route can tell the Slim application to continue to the next matching route with the Slim application's `pass()`
method. When this method is invoked, the Slim application will immediately stop processing the current matching route
and invoke the next matching route. If no subsequent matching route is found, a **404 Not Found** response is sent to
the client. Here is an example. Assume an HTTP request for “GET /hello/Frank”.

    <?php
    $app = new \Slim\Slim();
    $app->get('/hello/Frank', function () use ($app) {
        echo "You won't see this...";
        $app->pass();
    });
    $app->get('/hello/:name', function ($name) use ($app) {
        echo "But you will see this!";
    });
    $app->run();

### Redirect

It is easy to redirect the client to another URL with the Slim application's `redirect()` method. This method accepts
two arguments: the first argument is the URL to which the client will redirect; the second optional argument is the
HTTP status code. By default the `redirect()` method will send a **302 Temporary Redirect** response.

    <?php
    $app = new \Slim\Slim();
    $app->get('/foo', function () use ($app) {
        $app->redirect('/bar');
    });
    $app->run();

Or if you wish to use a permanent redirect, you must specify the destination URL as the first parameter and the
HTTP status code as the second parameter.

    <?php
    $app = new \Slim\Slim();
    $app->get('/old', function () use ($app) {
        $app->redirect('/new', 301);
    });
    $app->run();

This method will automatically set the Location: header. The HTTP redirect response will be sent to the HTTP
client immediately.

### Stop

The Slim application's `stop()` method will stop the Slim application and send the current HTTP response to the
client as is. No ifs, ands, or buts.

    <?php
    $app = new \Slim\Slim();
    $app->get('/foo', function () use ($app) {
        echo "You will see this...";
        $app->stop();
        echo "But not this";
    });
    $app->run();

### URL For

The Slim applications' `urlFor()` method lets you dynamically create URLs for a named route so that, were a route
pattern to change, your URLs would update automatically without breaking your application. This example demonstrates
how to generate URLs for a named route.

    <?php
    $app = new \Slim\Slim();

    //Create a named route
    $app->get('/hello/:name', function ($name) use ($app) {
        echo "Hello $name";
    })->name('hello');

    //Generate a URL for the named route
    $url = $app->urlFor('hello', array('name' => 'Josh'));

In this example, $url is “/hello/Josh”. To use the `urlFor()` method, you must first assign a name to a route.
Next, invoke the `urlFor()` method. The first argument is the name of the route, and the second argument is an
associative array used to replace the route’s URL parameters with actual values; the array’s keys must match
parameters in the route’s URI and the values will be used as substitutions.
