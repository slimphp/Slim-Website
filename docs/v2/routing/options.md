Use the Slim application's `options()` method to map a callback function to a resource URI that is requested with
the HTTP OPTIONS method.

    <?php
    $app = new \Slim\Slim();
    $app->options('/books/:id', function ($id) {
        //Return response headers
    });

In this example, an HTTP OPTIONS request for “/books/1” will invoke the associated callback function, passing "1" as
the callback function's argument.

The first argument of the Slim application's `options()` method is the resource URI. The last argument is anything that
returns `true` for `is_callable()`. Typically, the last argument will be an [anonymous function][anon-func].

### Method Override

Unfortunately, modern browsers do not provide native support for HTTP OPTIONS requests. To work around this limitation,
ensure your HTML form’s method attribute is “post”, then add a method override parameter to your HTML form like this:

    <form action="/books/1" method="post">
        ... other form fields here...
        <input type="hidden" name="_METHOD" value="OPTIONS"/>
        <input type="submit" value="Fetch Options For Book"/>
    </form>

If you are using [Backbone.js][backbone] or a command-line HTTP client, you may also override the HTTP method by
using the **X-HTTP-Method-Override** header.

[anon-func]: http://php.net/manual/en/functions.anonymous.php
[backbone]: http://documentcloud.github.com/backbone/
