Use the Slim application's `post()` method to map a callback function to a resource URI that is requested with
the HTTP POST method.

    <?php
    $app = new \Slim\Slim();
    $app->post('/books', function () {
        //Create book
    });

In this example, an HTTP POST request for “/books” will invoke the associated callback function

The first argument of the Slim application's `post()` method is the resource URI. The last argument is anything that
returns `true` for `is_callable()`. Typically, the last argument will be an [anonymous function][anon-func].

[anon-func]: http://php.net/manual/en/functions.anonymous.php
