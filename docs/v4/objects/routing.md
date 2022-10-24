---
title: Routing
---

The Slim Framework's router is built on top of the [Fast Route](https://github.com/nikic/FastRoute) component, and it is remarkably fast and stable.
While we are using this component to do all our routing, the app's core has been entirely decoupled from it and interfaces have been put in place to
pave the way for using other routing libraries.

## How to create routes

You can define application routes using proxy methods on the `Slim\App` instance. The Slim Framework provides methods for the most popular HTTP methods.

### GET Route

You can add a route that handles only `GET` HTTP requests with the Slim
application's `get()` method. It accepts two arguments:

1. The route pattern (with optional named placeholders)
2. The route callback

```php
$app->get('/books/{id}', function ($request, $response, array $args) {
    // Show book identified by $args['id']
});
```

### POST Route

You can add a route that handles only `POST` HTTP requests with the Slim
application's `post()` method. It accepts two arguments:

1. The route pattern (with optional named placeholders)
2. The route callback

```php
$app->post('/books', function ($request, $response, array $args) {
    // Create new book
});
```

### PUT Route

You can add a route that handles only `PUT` HTTP requests with the Slim
application's `put()` method. It accepts two arguments:

1. The route pattern (with optional named placeholders)
2. The route callback

```php
$app->put('/books/{id}', function ($request, $response, array $args) {
    // Update book identified by $args['id']
});
```

### DELETE Route

You can add a route that handles only `DELETE` HTTP requests with the Slim
application's `delete()` method. It accepts two arguments:

1. The route pattern (with optional named placeholders)
2. The route callback

```php
$app->delete('/books/{id}', function ($request, $response, array $args) {
    // Delete book identified by $args['id']
});
```

### OPTIONS Route

You can add a route that handles only `OPTIONS` HTTP requests with the Slim
application's `options()` method. It accepts two arguments:

1. The route pattern (with optional named placeholders)
2. The route callback

```php
$app->options('/books/{id}', function ($request, $response, array $args) {
    // Return response headers
});
```

### PATCH Route

You can add a route that handles only `PATCH` HTTP requests with the Slim
application's `patch()` method. It accepts two arguments:

1. The route pattern (with optional named placeholders)
2. The route callback

```php
$app->patch('/books/{id}', function ($request, $response, array $args) {
    // Apply changes to book identified by $args['id']
});
```

### Any Route

You can add a route that handles all HTTP request methods with the Slim application's `any()` method. It accepts two arguments:

1. The route pattern (with optional named placeholders)
2. The route callback

```php
$app->any('/books/[{id}]', function ($request, $response, array $args) {
    // Apply changes to books or book identified by $args['id'] if specified.
    // To check which method is used: $request->getMethod();
});
```

Note that the second parameter is a callback. You could specify a Class which implements the `__invoke()` method instead of a Closure. You can then do the mapping somewhere else:

```php
$app->any('/user', 'MyRestfulController');
```

### Custom Route

You can add a route that handles multiple HTTP request methods with the Slim application's `map()` method. It accepts three arguments:

1. Array of HTTP methods
2. The route pattern (with optional named placeholders)
3. The route callback

```php
$app->map(['GET', 'POST'], '/books', function ($request, $response, array $args) {
    // Create new book or list all books
});
```

## Route callbacks

Each routing method described above accepts a callback routine as its final argument. This argument can be any PHP callable, and by default it accepts three arguments.

* `Request` The first argument is a `Psr\Http\Message\ServerRequestInterface` object that represents the current HTTP request.
* `Response` The second argument is a `Psr\Http\Message\ResponseInterface` object that represents the current HTTP response.
* `Arguments` The third argument is an associative array that contains values for the current route's named placeholders.

### Writing content to the response

There are two ways you can write content to the HTTP response. First, you can simply `echo()` content from the route callback. This content will be appended to the current HTTP response object. Second, you can return a `Psr\Http\Message\ResponseInterface` object.

### Closure binding

If you use a [dependency container](/docs/v4/concepts/di.html) and a `Closure` instance as the route callback, the closure's state is bound to the `Container` instance. This means you will have access to the DI container instance _inside_ of the Closure via the `$this` keyword:

```php
$app->get('/hello/{name}', function ($request, $response, array $args) {
    // Use app HTTP cookie service
    $this->get('cookies')->set('name', [
        'value' => $args['name'],
        'expires' => '7 days'
    ]);
});
```

<div class="alert alert-info">
    <div><strong>Heads Up!</strong></div>
    <p>Slim does not support <code>static</code> closures.</p>
</div>

## Redirect helper

You can add a route that redirects `GET` HTTP requests to a different URL with
the Slim application's `redirect()` method. It accepts three arguments:

1. The route pattern (with optional named placeholders) to redirect `from`
2. The location to redirect `to`, which may be a `string` or a
   [Psr\Http\Message\UriInterface](https://www.php-fig.org/psr/psr-7/#35-psrhttpmessageuriinterface)
3. The HTTP status code to use (optional; `302` if unset)

```php
$app->redirect('/books', '/library', 301);
```

`redirect()` routes respond with the status code requested and a `Location`
header set to the second argument.

## Route strategies

The route callback signature is determined by a route strategy. By default, Slim expects route callbacks to accept the request, response, and an array of route placeholder arguments. This is called the RequestResponse strategy. However, you can change the expected route callback signature by simply using a different strategy. As an example, Slim provides an alternative strategy called `RequestResponseArgs` that accepts request and response, plus each route placeholder as a separate argument.

Here is an example of using this alternative strategy:

```php
<?php
use Slim\Factory\AppFactory;
use Slim\Handlers\Strategies\RequestResponseArgs;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

/**
 * Changing the default invocation strategy on the RouteCollector component
 * will change it for every route being defined after this change being applied
 */
$routeCollector = $app->getRouteCollector();
$routeCollector->setDefaultInvocationStrategy(new RequestResponseArgs());

$app->get('/hello/{name}', function ($request, $response, $name) {
    $response->getBody()->write($name);
    
    return $response;
});
```

Alternatively you can set a different invocation strategy on a per route basis:

```php
<?php
use Slim\Factory\AppFactory;
use Slim\Handlers\Strategies\RequestResponseArgs;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();
$routeCollector = $app->getRouteCollector();

$route = $app->get('/hello/{name}', function ($request, $response, $name) {
    $response->getBody()->write($name);
    
    return $response;
});
$route->setInvocationStrategy(new RequestResponseArgs());
```

You can provide your own route strategy by implementing the `Slim\Interfaces\InvocationStrategyInterface`.

## Route placeholders

Each routing method described above accepts a URL pattern that is matched against the current HTTP request URI. Route patterns may use named placeholders to dynamically match HTTP request URI segments.

### Format

A route pattern placeholder starts with a `{`, followed by the placeholder name, ending with a `}`. This is an example placeholder named `name`:

```php
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
// ...

$app->get('/hello/{name}', function (ServerRequestInterface $request, ResponseInterface $response, array $args) {
    $name = $args['name'];
    $response->getBody()->write("Hello, $name");
    
    return $response;
});
```

### Optional segments

To make a section optional, simply wrap in square brackets:

```php
$app->get('/users[/{id}]', function ($request, $response, array $args) {
    // responds to both `/users` and `/users/123`
    // but not to `/users/`
    
    return $response;
});
```

Multiple optional parameters are supported by nesting:

```php
$app->get('/news[/{year}[/{month}]]', function ($request, $response, array $args) {
    // responds to `/news`, `/news/2016` and `/news/2016/03`
    // ...
    
    return $response;
});
```

For "Unlimited" optional parameters, you can do this:

```php
$app->get('/news[/{params:.*}]', function ($request, $response, array $args) {
    // $params is an array of all the optional segments
    $params = explode('/', $args['params']);
    // ...
    
    return $response;
});
```

In this example, a URI of `/news/2016/03/20` would result in the `$params` array
containing three elements: `['2016', '03', '20']`.


### Regular expression matching

By default the placeholders are written inside `{}` and can accept any
values. However, placeholders can also require the HTTP request URI to match a particular regular expression. If the current HTTP request URI does not match a placeholder regular expression, the route is not invoked. This is an example placeholder named `id` that requires one or more digits.

```php
$app->get('/users/{id:[0-9]+}', function ($request, $response, array $args) {
    // Find user identified by $args['id']
    // ...
    
    return $response;
});
```

## Route names

Application routes can be assigned a name. This is useful if you want to programmatically generate a URL to a specific route with the RouteParser's `urlFor()` method. Each routing method described above returns a `Slim\Route` object, and this object exposes a `setName()` method.

```php
$app->get('/hello/{name}', function ($request, $response, array $args) {
    $response->getBody()->write("Hello, " . $args['name']);
    return $response;
})->setName('hello');
```

You can generate a URL for this named route with the application RouteParser's `urlFor()`  method.

```php
$routeParser = $app->getRouteCollector()->getRouteParser();
echo $routeParser->urlFor('hello', ['name' => 'Josh'], ['example' => 'name']);

// Outputs "/hello/Josh?example=name"
```

The RouteParser's `urlFor()` method accepts three arguments:

* `$routeName` The route name. A route's name can be set via `$route->setName('name')`. Route mapping methods return an instance of `Route` so you can set the name directly after mapping the route. e.g.: `$app->get('/', function () {...})->setName('name')`
* `$data` Associative array of route pattern placeholders and replacement values.
* `$queryParams` Associative array of query parameters to be appended to the generated url.

## Route groups

To help organize routes into logical groups, the `Slim\App` also provides a `group()` method. Each group's route pattern is prepended to the routes or groups contained within it, and any placeholder arguments in the group pattern are ultimately made available to the nested routes:

```php
use Slim\Routing\RouteCollectorProxy;
// ...

$app->group('/users/{id:[0-9]+}', function (RouteCollectorProxy $group) {
    $group->map(['GET', 'DELETE', 'PATCH', 'PUT'], '', function ($request, $response, array $args) {
        // Find, delete, patch or replace user identified by $args['id']
        // ...
        
        return $response;
    })->setName('user');
    
    $group->get('/reset-password', function ($request, $response, array $args) {
        // Route for /users/{id:[0-9]+}/reset-password
        // Reset the password for user identified by $args['id']
        // ...
        
        return $response;
    })->setName('user-password-reset');
});
```

The group pattern can be empty, enabling the logical grouping of routes that do not share a common pattern.

```php
use Slim\Routing\RouteCollectorProxy;
// ...

$app->group('', function (RouteCollectorProxy $group) {
    $group->get('/billing', function ($request, $response, array $args) {
        // Route for /billing
        return $response;
    });
    
    $group->get('/invoice/{id:[0-9]+}', function ($request, $response, array $args) {
        // Route for /invoice/{id:[0-9]+}
        return $response;
    });
})->add(new GroupMiddleware());
```

Note inside the group closure, Slim binds the closure to the container instance.

* inside route closure, `$this` is bound to the instance of `Psr\Container\ContainerInterface`

## Route middleware
You can also attach middleware to any route or route group.
```php
use Slim\Routing\RouteCollectorProxy;
// ...

$app->group('/foo', function (RouteCollectorProxy $group) {
    $group->get('/bar', function ($request, $response, array $args) {
        // ...
        return $response;
    })->add(new RouteMiddleware());
})->add(new GroupMiddleware());
```

## Route expressions caching

It's possible to enable router cache via `RouteCollector::setCacheFile()`. See examples below:
```php
<?php
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

/**
 * To generate the route cache data, you need to set the file to one that does not exist in a writable directory.
 * After the file is generated on first run, only read permissions for the file are required.
 *
 * You may need to generate this file in a development environment and committing it to your project before deploying
 * if you don't have write permissions for the directory where the cache file resides on the server it is being deployed to
 */
$routeCollector = $app->getRouteCollector();
$routeCollector->setCacheFile('/path/to/cache.file');
```

## Container Resolution

You are not limited to defining a function for your routes. In Slim there are a few different ways to define your route action functions.

In addition to a function, you may use:

 - container_key:method
 - Class:method
 - Class implementing `__invoke()` method
 - container_key

This functionality is enabled by Slim's Callable Resolver Class. It translates a string entry into a function call.
Example:

```php
$app->get('/', '\HomeController:home');
```

Alternatively, you can take advantage of PHP's `::class` operator which works well with IDE lookup systems and produces the same result:

```php
$app->get('/', \HomeController::class . ':home');
```

You can also pass an array, the first element of which will contain the name of the class, and the second will contain the name of the method being called:
```php
$app->get('/', [\HomeController::class, 'home']);
```

In this code above we are defining a `/` route and telling Slim to execute the `home()` method on the `HomeController` class.

Slim first looks for an entry of `HomeController` in the container, if it's found it will use that instance otherwise it will call it's constructor with the container as the first argument. Once an instance of the class is created it will then call the specified method using whatever Strategy you have defined.

### Registering a controller with the container

Create a controller with the `home` action method. The constructor should accept
the dependencies that are required. For example:

```php
<?php

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

class HomeController
{
    private $view;

    public function __construct(Twig $view)
    {
        $this->view = $view;
    }
    
    public function home(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
      // your code here
      // use $this->view to render the HTML
      // ...
      
      return $response;
    }
}
```

Create a factory in the container that instantiates the controller with the dependencies:

```php
use Psr\Container\ContainerInterface;
// ...

$container = $app->getContainer();

$container->set('HomeController', function (ContainerInterface $container) {
    // retrieve the 'view' from the container
    $view = $container->get('view');
    
    return new HomeController($view);
});
```

This allows you to leverage the container for dependency injection and so you can
inject specific dependencies into the controller.


### Allow Slim to instantiate the controller

Alternatively, if the class does not have an entry in the container, then Slim
will pass the container's instance to the constructor. You can construct controllers
with many actions instead of an invokable class which only handles one action.

```php
<?php

use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class HomeController
{
   private $container;

   // constructor receives container instance
   public function __construct(ContainerInterface $container)
   {
       $this->container = $container;
   }

   public function home(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
   {
        // your code to access items in the container... $this->container->get('');
        
        return $response;
   }

   public function contact(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
   {
        // your code to access items in the container... $this->container->get('');
        
        return $response;
   }
}
```

You can use your controller methods like so.

```php
$app->get('/', \HomeController::class . ':home');
$app->get('/contact', \HomeController::class . ':contact');
```

### Using an invokable class

You do not have to specify a method in your route callable and can just set it to be an invokable class such as:

```php
<?php

use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class HomeAction
{
   private $container;

   public function __construct(ContainerInterface $container)
   {
       $this->container = $container;
   }

   public function __invoke(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
   {
        // your code to access items in the container... $this->container->get('');
        
        return $response;
   }
}
```

You can use this class like so.

```php
$app->get('/', \HomeAction::class);
```

Again, as with controllers, if you register the class name with the container, then you
can create a factory and inject just the specific dependencies that you require into your
action class.
