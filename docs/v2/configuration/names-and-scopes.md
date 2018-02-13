When you build a Slim application you will enter various scopes in your code (e.g. global scope and function scope).
You will likely need a reference to your Slim application in each scope. There are several ways to do this:

* Use application names with the Slim application's `getInstance()` static method
* Curry an application instance into function scope with the `use` keyword

### Application Names

Every Slim application may be given a name. **This is optional**. Names help you get a reference to a Slim
application instance in any scope throughout your code. Here is how you set and get an application’s name:

    <?php
    $app = new \Slim\Slim();
    $app->setName('foo');
    $name = $app->getName(); // "foo"

### Scope Resolution

So how do you get a reference to your Slim application? The example below demonstrates how to obtain a reference
to a Slim application within a route callback function. The `$app` variable is used in the global scope to define
the HTTP GET route. But the `$app` variable is also needed within the route’s callback scope to render a template.

    <?php
    $app = new \Slim\Slim();
    $app->get('/foo', function () {
        $app->render('foo.php'); // <-- ERROR
    });

This example fails because the `$app` variable is unavailable inside the route callback function.

#### Currying

We can inject the `$app` variable into the callback function with the `use` keyword:

    <?php
    $app = new \Slim\Slim();
    $app->get('/foo', function () use ($app) {
        $app->render('foo.php'); // <-- SUCCESS
    });

#### Fetch by Name

You can use the Slim application's `getInstance()` static method, too:

    <?php
    $app = new \Slim\Slim();
    $app->get('/foo', 'foo');
    function foo() {
        $app = Slim::getInstance();
        $app->render('foo.php');
    }
