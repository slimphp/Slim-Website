Use the Slim application's `get()` method to map a callback function to a resource URI that is requested with
the HTTP GET method.

    <?php
    $app = new \Slim\Slim();
    $app->get('/books/:id', function ($id) {
        //Show book identified by $id
    });

In this example, an HTTP GET request for “/books/1” will invoke the associated callback function, passing “1” as the
callback's argument.

The first argument of the Slim application's `get()` method is the resource URI. The last argument is anything that
returns `true` for `is_callable()`. Typically, the last argument will be an [anonymous function][anon-func].

[anon-func]: http://php.net/manual/en/functions.anonymous.php
