---
title: First Application Walkthrough
---

If you're looking for a tour through all the ingredients for setting up a very simple Slim application (this one doesn't use Twig, but does use Monolog and a PDO database connection) then you're in the right place.  Either walk through the tutorial to build the example application, or adapt each step for your own needs.

Before you start: There is also a [skeleton project](https://github.com/slimphp/Slim-Skeleton) which will give you a quick-start for a sample application, so use that if you'd rather just have something working rather than exploring how all the moving parts work.

> This tutorial walks through building an example application.  The [code for the application is available](https://github.com/slimphp/Tutorial-First-Application) if you want to refer to it.

## Getting Set Up

Start by making a folder for your project (mine is called `project`, because naming things is hard).  I like to reserve the top level for things-that-are-not-code and then have a folder for source code, and a folder inside that which is my webroot, so my initial structure looks like this:

```
.
├── project
│   └── src
│       └── public
```

### Installing Slim Framework

[Composer](https://getcomposer.org) is the best way to install Slim Framework.  If you don't have it already, you can follow the [installation instructions](https://getcomposer.org/download/), in my project I've just downloaded the `composer.phar` into my `src/` directory and I'll use it locally.  So my first command looks like this (I'm in the `src/` directory):

    php composer.phar require slim/slim

This does two things:

* Add the Slim Framework dependency to `composer.json` (in my case it creates the file for me as I don't already have one, it's safe to run this if you do already have a `composer.json` file)
* Run `composer install` so that those dependencies are actually available to use in your application

If you look inside the project directory now, you'll see that you have a `vendor/` folder with all the library code in it.  There are also two new files: `composer.json` and `composer.lock`.  This would be a great time to get our source control setup correct as well: when working with composer, we always exclude the `vendor/` directory, but both `composer.json` and `composer.lock` should be included under source control.  Since I'm using `composer.phar` in this directory I'm going to include it in my repo as well; you could equally install the `composer` command on all the systems that need it.

To set up the git ignore correctly, create a file called `src/.gitignore` and add the following single line to the file:

    vendor/*


Now git won't prompt you to add the files in `vendor/` to the repository - we don't want to do this because we're letting composer manage these dependencies rather than including them in our source control repository.

### Create The Application

There's a really excellent and minimal example of an `index.php` for Slim Framework on the [project homepage](http://www.slimframework.com) so we'll use that as our starting point.  Put the following code into `src/public/index.php`:

```php
<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require '../vendor/autoload.php';

$app = new \Slim\App;
$app->get('/hello/{name}', function (Request $request, Response $response, array $args) {
    $name = $args['name'];
    $response->getBody()->write("Hello, $name");

    return $response;
});
$app->run();

```

We just pasted a load of code ... let's take a look at what it does.

The `use` statements at the top of the script are just bringing the `Request` and `Response` classes into our script so we don't have to refer to them by their long-winded names.  Slim framework supports PSR-7 which is the PHP standard for HTTP messaging, so you'll notice as you build your application that the `Request` and `Response` objects are something you see often.  This is a modern and excellent approach to writing web applications.

Next we include the `vendor/autoload.php` file - this is created by Composer and allows us to refer to the Slim and other related dependencies we installed earlier.  Look out that if you're using the same file structure as me then the `vendor/` directory is one level up from your `index.php` and you may need to adjust the path as I did above.

Finally we create the `$app` object which is the start of the Slim goodness.  The `$app->get()` call is our first "route" - when we make a GET request to `/hello/someone` then this is the code that will respond to it.  **Don't forget** you need that final `$app->run()` line to tell Slim that we're done configuring and it's time to get on with the main event.

Now we have an application, we'll need to run it.  I'll cover two options: the built-in PHP webserver, and an Apache virtual host setup.

### Run Your Application With PHP's Webserver

This is my preferred "quick start" option because it doesn't rely on anything else!  From the `src/public` directory run the command:

    php -S localhost:8080

This will make your application available at http://localhost:8080 (if you're already using port 8080 on your machine, you'll get a warning.  Just pick a different port number, PHP doesn't care what you bind it to).

**Note** you'll get an error message about "Page Not Found" at this URL - but it's an error message **from** Slim, so this is expected.  Try http://localhost:8080/hello/joebloggs instead :)

### Run Your Application With Apache or nginx

To get this set up on a standard LAMP stack, we'll need a couple of extra ingredients: some virtual host configuration, and one rewrite rule.

The vhost configuration should be fairly straightforward; we don't need anything special here.  Copy your existing default vhost configuration and set the `ServerName` to be how you want to refer to your project.  For example you can set:

    ServerName slimproject.test

    or for nginx:

    server_name slimproject.test;

Then you'll also want to set the `DocumentRoot` to point to the `public/` directory of your project, something like this (edit the existing line):

    DocumentRoot    /home/lorna/projects/slim/project/src/public/

    or for nginx:

    root    /home/lorna/projects/slim/project/src/public/


**Don't forget** to restart your server process now you've changed the configuration!

I also have a `.htaccess` file in my `src/public` directory; this relies on Apache's rewrite module being enabled and simply makes all web requests go to index.php so that Slim can then handle all the routing for us.  Here's my `.htaccess` file:

```
RewriteEngine on
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule . index.php [L]
```

nginx does not use `.htaccess` files, so you will need to add the following to your server configuration in the `location` block:

```
if (!-e $request_filename){
    rewrite ^(.*)$ /index.php break;
}
```

*NOTE:* If you want your entry point to be something other than index.php you will need your config to change as well. `api.php` is also commonly used as an entry point, so your set up should match accordingly. This example assumes your are using index.php.

With this setup, just remember to use http://slimproject.test instead of http://localhost:8080 in the other examples in this tutorial.  The same health warning as above applies: you'll see an error page at http://slimproject.test but crucially it's *Slim's* error page.  If you go to http://slimproject.test/hello/joebloggs then something better should happen.

## Configuration and Autoloaders

Now we've set up the platform, we can start getting everything we need in place in the application itself.

### Add Config Settings to Your Application

The initial example uses all the Slim defaults, but we can easily add configuration to our application when we create it.  There are a few options but here I've just created an array of config options and then told Slim to take its settings from here when I create it.

First the configuration itself:

```php
$config['displayErrorDetails'] = true;
$config['addContentLengthHeader'] = false;

$config['db']['host']   = 'localhost';
$config['db']['user']   = 'user';
$config['db']['pass']   = 'password';
$config['db']['dbname'] = 'exampleapp';
```

The first line is the most important!  Turn this on in development mode to get information about errors (without it, Slim will at least log errors so if you're using the built in PHP webserver then you'll see them in the console output which is helpful). The second line allows the web server to set the Content-Length header which makes Slim behave more predictably.

The other settings here are not specific keys/values, they're just some data that I want to be able to access later.

Now to feed this into Slim, we need to *change* where we create the `Slim/App` object so that it now looks like this:

```php
$app = new \Slim\App(['settings' => $config]);
```

We'll be able to access any settings we put into that `$config` array from our application later on.

## Set up Autoloading for Your Own Classes

Composer can handle the autoloading of your own classes just as well as the vendored ones. For an in-depth guide, take a look at [using Composer to manage autoloading rules](https://getcomposer.org/doc/04-schema.md#autoload).

My setup is pretty simple since I only have a few extra classes, they're just in the global namespace, and the files are in the `src/classes/` directory.  So to autoload them, I add this `autoload` section to my `composer.json` file:

```javascript
{
    "require": {
        "slim/slim": "^3.1",
        "slim/php-view": "^2.0",
        "monolog/monolog": "^1.17",
        "robmorgan/phinx": "^0.5.1"
    },
    "autoload": {
        "psr-4": {
            "": "classes/"
        }
    }
}
```

## Add Dependencies

Most applications will have some dependencies, and Slim handles them nicely using a DIC (Dependency Injection Container) built on [Pimple](http://pimple.sensiolabs.org/).  This example will use both [Monolog](https://github.com/Seldaek/monolog) and a [PDO](http://php.net/manual/en/book.pdo.php) connection to MySQL.

The idea of the dependency injection container is that you configure the container to be able to load the dependencies that your application needs, when it needs them.  Once the DIC has created/assembled the dependencies, it stores them and can supply them again later if needed.

To get the container, we can add the following after the line where we create `$app` and before we start to register the routes in our application:

```php
$container = $app->getContainer();
```

Now we have the `Slim\Container` object, we can add our services to it.

### Use Monolog In Your Application

If you're not already familiar with Monolog, it's an excellent logging framework for PHP applications, which is why I'm going to use it here.  First of all, get the Monolog library installed via Composer:

    php composer.phar require monolog/monolog

The dependency is named `logger` and the code to add it looks like this:

```php
$container['logger'] = function($c) {
    $logger = new \Monolog\Logger('my_logger');
    $file_handler = new \Monolog\Handler\StreamHandler('../logs/app.log');
    $logger->pushHandler($file_handler);
    return $logger;
};
```

We're adding an element to the container, which is itself an anonymous function (the `$c` that is passed in is the container itself so you can access other dependencies if you need to).  This will be called when we try to access this dependency for the first time; the code here does the setup of the dependency.  Next time we try to access the same dependency, the same object that was created the first time will be used the next time.

My Monolog config here is fairly light; just setting up the application to log all errors to a file called `logs/app.log` (remember this path is from the point of view of where the script is running, i.e. `index.php`).

With the logger in place, I can use it from inside my route code with a line like this:

```php
    $this->logger->addInfo('Something interesting happened');
```

Having good application logging is a really important foundation for any application so I'd always recommend putting something like this in place.  This allows you to add as much or as little debugging as you want, and by using the appropriate log levels with each message, you can have as much or as little detail as is appropriate for what you're doing in any one moment.

### Add A Database Connection

There are many database libraries available for PHP, but this example uses PDO - this is available in PHP as standard so it's probably useful in every project, or you can use your own libraries by adapting the examples below.

Exactly as we did for adding Monolog to the DIC, we'll add an anonymous function that sets up the dependency, in this case called `db`:

```php
$container['db'] = function ($c) {
    $db = $c['settings']['db'];
    $pdo = new PDO('mysql:host=' . $db['host'] . ';dbname=' . $db['dbname'],
        $db['user'], $db['pass']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    return $pdo;
};
```

Remember the config that we added into our app earlier?  Well, this is where we use it - the container knows how to access our settings, and so we can grab our configuration very easily from here.  With the config, we create the `PDO` object (remember this will throw a `PDOException` if it fails and you might like to handle that here) so that we can connect to the database.  I've included two `setAttribute()` calls that really aren't necessary but I find these two settings make PDO itself much more usable as a library so I left the settings in this example so you can use them too!  Finally, we return our connection object.

Again, we can access our dependencies with just `$this->` and then the name of the dependency we want which in this case is `$this->db`, so there is code in my application that looks something like:

```php
    $mapper = new TicketMapper($this->db);
```

This will fetch the `db` dependency from the DIC, creating it if necessary, and in this example just allows me to pass the `PDO` object straight into my mapper class.

## Create Routes

"Routes" are the URL patterns that we'll describe and attach functionality to.  Slim doesn't use any automatic mapping or URL formulae so you can make any route pattern you like map onto any function you like, it's very flexible.  Routes can be linked to a particular HTTP verb (such as GET or POST), or more than one verb.

As a first example, here's the code for making a GET request to `/tickets` which lists the tickets in my bug tracker example application.  It just spits out the variables since we haven't added any views to our application yet:

```php
$app->get('/tickets', function (Request $request, Response $response) {
    $this->logger->addInfo("Ticket list");
    $mapper = new TicketMapper($this->db);
    $tickets = $mapper->getTickets();

    $response->getBody()->write(var_export($tickets, true));
    return $response;
});
```

The use of `$app->get()` here means that this route is only available for GET requests; there's an equivalent `$app->post()` call that also takes the route pattern and a callback for POST requests.  There are also [methods for other verbs](http://www.slimframework.com/docs/v4/objects/router.html) - and also the `map()` function for situations where more than one verb should use the same code for a particular route.

Slim routes match in the order they are declared, so if you have a route which could overlap another route, you need to put the most specific one first.  Slim will throw an exception if there's a problem, for example in this application I have both `/ticket/new` and `/ticket/{id}` and they need to be declared in that order otherwise the routing will think that "new" is an ID!

In this example application, all the routes are in `index.php` but in practice this can make for a rather long and unwieldy file!  It's fine to refactor your application to put routes into a different file or files, or just register a set of routes with callbacks that are actually declared elsewhere.

All route callbacks accept three parameters (the third one is optional):

 * Request: this contains all the information about the incoming request, headers, variables, etc.
 * Response: we can add output and headers to this and, once complete, it will be turned into the HTTP response that the client receives
 * Arguments: the named placeholders from the URL (more on those in just a moment), this is optional and is usually omitted if there aren't any

This emphasis on Request and Response illustrates Slim 3 being based on the PSR-7 standard for HTTP Messaging.  Using the Request and Response object also makes the application more testable as we don't need to make **actual** requests and responses, we can just set up the objects as desired.

### Routes with Named Placeholders

Sometimes, our URLs have variables in them that we want to use in our application.  In my bug tracking example, I want to have URLs like `/ticket/42` to refer to the ticket - and Slim has an easy way of parsing out the "42" bit and making it available for easy use in the code.  Here's the route that does exactly that:

```php
$app->get('/ticket/{id}', function (Request $request, Response $response, $args) {
    $ticket_id = (int)$args['id'];
    $mapper = new TicketMapper($this->db);
    $ticket = $mapper->getTicketById($ticket_id);

    $response->getBody()->write(var_export($ticket, true));
    return $response;
});
```

Look at where the route itself is defined: we write it as `/ticket/{id}`.  When we do this, the route will take the portion of the URL from where the `{id}` is declared, and it becomes available as `$args['id']` inside the callback.

### Using GET Parameters

Since GET and POST send data in such different ways, then the way that we get that data from the Request object differs hugely in Slim.

It is possible to get all the query parameters from a request by doing `$request->getQueryParams()` which will return an associative array.  So for the URL `/tickets?sort=date&order=desc` we'd get an associative array like:

    ['sort' => 'date', 'order' => 'desc']

These can then be used (after validating of course) inside your callback.


### Working with POST Data

When working with incoming data, we can find this in the body.  We've already seen how we can parse data from the URL and how to obtain the GET variables by doing `$request->getQueryParams()` but what about POST data?  The POST request data can be found in the body of the request, and Slim has some good built in helpers to make it easier to get the information in a useful format.

For data that comes from a web form, Slim will turn that into an array.  My tickets example application has a form for creating new tickets that just sends two fields: "title" and "description".  Here is the first part of the route that receives that data, note that for a POST route use `$app->post()` rather than `$app->get()`:

```php
$app->post('/ticket/new', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $ticket_data = [];
    $ticket_data['title'] = filter_var($data['title'], FILTER_SANITIZE_STRING);
    $ticket_data['description'] = filter_var($data['description'], FILTER_SANITIZE_STRING);
    // ...
```

The call to `$request->getParsedBody()` asks Slim to look at the request and the `Content-Type` headers of that request, then do something smart and useful with the body.  In this example it's just a form post and so the resulting `$data` array looks very similar to what we'd expect from `$_POST` - and we can go ahead and use the [filter](https://php.net/manual/en/book.filter.php) extension to check the value is acceptable before we use it.  A huge advantage of using the built in Slim methods is that we can test things by injecting different request objects - if we were to use `$_POST` directly, we aren't able to do that.

What's really neat here is that if you're building an API or writing AJAX endpoints, for example, it's super easy to work with data formats that arrive by POST but which aren't a web form.  As long as the `Content-Type` header is set correctly, Slim will parse a JSON payload into an array and you can access it exactly the same way: by using `$request->getParsedBody()`.

## Views and Templates

Slim doesn't have an opinion on the views that you should use, although there are some options that are ready to plug in.  Your best choices are either Twig or plain old PHP.  Both options have pros and cons: if you're already familiar with Twig then it offers lots of excellent features and functionality such as layouts - but if you're not already using Twig, it can be a large learning curve overhead to add to a microframework project.  If you're looking for something dirt simple then the PHP views might be for you!  I picked PHP for this example project, but if you're familiar with Twig then feel free to use that; the basics are mostly the same.

Since we'll be using the PHP views, we'll need to add this dependency to our project via Composer.  The command looks like this (similar to the ones you've already seen):

    php composer.phar require slim/php-view

In order to be able to render the view, we'll first need to create a view and make it available to our application; we do that by adding it to the DIC.  The code we need goes with the other DIC additions near the top of `src/public/index.php` and it looks like this:

```php
$container['view'] = new \Slim\Views\PhpRenderer('../templates/');
```

Now we have a `view` element in the DIC, and by default it will look for its templates in the `src/templates/` directory.  We can use it to render templates in our actions - here's the ticket list route again, this time including the call to pass data into the template and render it:

```php
$app->get('/tickets', function (Request $request, Response $response) {
    $this->logger->addInfo('Ticket list');
    $mapper = new TicketMapper($this->db);
    $tickets = $mapper->getTickets();

    $response = $this->view->render($response, 'tickets.phtml', ['tickets' => $tickets]);
    return $response;
});
```

The only new part here is the penultimate line where we set the `$response` variable.  Now that the `view` is in the DIC, we can refer to it as `$this->view`.  Calling `render()` needs us to supply three arguments: the `$response` to use, the template file (inside the default templates directory), and any data we want to pass in.  Response objects are *immutable* which means that the call to `render()` won't update the response object; instead it will return us a new object which is why it needs to be captured like this.  This is always true when you operate on the response object.

When passing the data to templates, you can add as many elements to the array as you want to make available in the template.  The keys of the array are the variables that the data will exist in once we get to the template itself.

As an example, here's a snippet from the template that displays the ticket list (i.e. the code from `src/templates/tickets.phtml` - which uses [Pure.css](http://purecss.io/) to help cover my lack of frontend skills):

```php
<h1>All Tickets</h1>

<p><a href="/ticket/new">Add new ticket</a></p>

<table class="pure-table">
    <tr>
        <th>Title</th>
        <th>Component</th>
        <th>Description</th>
        <th>Actions</th>
    </tr>

<?php foreach ($tickets as $ticket): ?>

    <tr>
        <td><?=$ticket->getTitle() ?></td>
        <td><?=$ticket->getComponent() ?></td>
        <td><?=$ticket->getShortDescription() ?> ...</td>
        <td>
            <a href="<?=$router->pathFor('ticket-detail', ['id' => $ticket->getId()])?>">view</a>
        </td>
    </tr>

<?php endforeach; ?>
</table>
```

In this case, `$tickets` is actually a `TicketEntity` class with getters and setters, but if you passed in an array, you'd be able to access it using array rather than object notation here.

Did you notice something fun going on with `$router->pathFor()` right at the end of the example?  Let's talk about named routes next :)

### Easy URL Building with Named Routes

When we create a route, we can give it a name by calling `->setName()` on the route object.  In this case, I am adding the name to the route that lets me view an individual ticket so that I can quickly create the right URL for a ticket by just giving the name of the route, so my code now looks something like this (just the changed bits shown here):

```php
$app->get('/ticket/{id}', function (Request $request, Response $response, $args) {
    // ...
})->setName('ticket-detail');
```

To use this in my template, I need to make the router available in the template that's going to want to create this URL, so I've amended the `tickets/` route to pass a router through to the template by changing the render line to look like this:

```php
    $response = $this->view->render($response, 'tickets.phtml', ['tickets' => $tickets, 'router' => $this->router]);
```

With the `/tickets/{id}` route having a friendly name, and the router now available in our template, this is what makes the `pathFor()` call in our template work.  By supplying the `id`, this gets used as a named placeholder in the URL pattern, and the correct URL for linking to that route with those values is created.  This feature is brilliant for readable template URLs and is even better if you ever need to change a URL format for any reason - no need to grep templates to see where it's used.  This approach is definitely recomended, especially for links you'll use a lot.

## Where Next?

This article gave a walkthrough of how to get set up with a simple application of your own, which I hope will let you get quickly started, see some working examples, and build something awesome.

From here, I'd recommend you take a look at the other parts of the project documentation for anything you need that wasn't already covered or that you want to see an alternative example of.  A great next step would be to take a look at the [Middleware](https://www.slimframework.com/docs/v4/concepts/middleware.html) section - this technique is how we layer up our application and add functionality such as authentication which can be applied to multiple routes.
