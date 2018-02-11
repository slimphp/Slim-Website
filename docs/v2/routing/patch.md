Use the Slim application's `patch()` method to map a callback function to a resource URI that is requested with
the HTTP PATCH method.

    <?php
    $app = new \Slim\Slim();
    $app->patch('/books/:id', function ($id) {
        // Patch book with given ID
    });

In this example, an HTTP PATCH request for “/books/1” will invoke the associated callback function, passing "1" as
the callback function's argument.

The first argument of the Slim application's `patch()` method is the resource URI. The last argument is anything that
returns `true` for `is_callable()`. Typically, the last argument will be an [anonymous function][anon-func].
