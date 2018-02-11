Slim lets you assign a name to a route. Naming a route enables you to dynamically generate URLs using the urlFor
helper method. When you use the Slim application's `urlFor()` method to create application URLs, you can freely
change route patterns without breaking your application. Here is an example of a named route:

    <?php
    $app = new \Slim\Slim();
    $app->get('/hello/:name', function ($name) {
        echo "Hello, $name!";
    })->name('hello');

You may now generate URLs for this route using the `urlFor()` method, described later in this documentation.
The route `name()` method is also chainable:

    <?php
    $app = new \Slim\Slim();
    $app->get('/hello/:name', function ($name) {
        echo "Hello, $name!";
    })->name('hello')->conditions(array('name' => '\w+'));
