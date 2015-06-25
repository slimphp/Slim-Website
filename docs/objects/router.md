---
layout: default
title: Router
---

# The Router Object

The Slim Framework's router is built on top of the [nikic/fastroute](https://github.com/nikic/FastRoute) component, and it is remarkably fast and stable. 

## How to create routes

You can define application routes using proxy methods on the `\Slim\App` instance. The Slim Framework provides methods for the most popular HTTP methods.

### GET Route

You can add a route that handles only `GET` HTTP requests with the Slim
application's `get()` method. It accepts two arguments:

1. The route pattern (with optional named placeholders)
2. The route callback

```php
$app = new \Slim\App();
$app->get('/books/{id}', function ($request, $response, $args) {
    // Show book identified by $args['id']
});
```

### POST Route

You can add a route that handles only `POST` HTTP requests with the Slim
application's `post()` method. It accepts two arguments:

1. The route pattern (with optional named placeholders)
2. The route callback

```php
$app = new \Slim\App();
$app->post('/books', function ($request, $response, $args) {
    // Create new book
});
```

### PUT Route

You can add a route that handles only `PUT` HTTP requests with the Slim
application's `put()` method. It accepts two arguments:

1. The route pattern (with optional named placeholders)
2. The route callback

```php
$app = new \Slim\App();
$app->put('/books/{id}', function ($request, $response, $args) {
    // Update book identified by $args['id']
});
```

### DELETE Route

You can add a route that handles only `DELETE` HTTP requests with the Slim
application's `delete()` method. It accepts two arguments:

1. The route pattern (with optional named placeholders)
2. The route callback

```php
$app = new \Slim\App();
$app->delete('/books/{id}', function ($request, $response, $args) {
    // Delete book identified by $args['id']
});
```

### OPTIONS Route

You can add a route that handles only `OPTIONS` HTTP requests with the Slim
application's `options()` method. It accepts two arguments:

1. The route pattern (with optional named placeholders)
2. The route callback

```php
$app = new \Slim\App();
$app->options('/books/{id}', function ($request, $response, $args) {
    // Return response headers
});
```

### PATCH Route

You can add a route that handles only `PATCH` HTTP requests with the Slim
application's `patch()` method. It accepts two arguments:

1. The route pattern (with optional named placeholders)
2. The route callback

```php
$app = new \Slim\App();
$app->patch('/books/{id}', function ($request, $response, $args) {
    // Apply changes to book identified by $args['id']
});
```

### Custom Route

You can add a route that handles multiple HTTP request methods with the Slim application's `map()` method. It accepts three arguments:

1. Array of HTTP methods
2. The route pattern (with optional named placeholders)
3. The route callback

```php
$app = new \Slim\App();
$app->map(['GET', 'POST'], '/books', function ($request, $response, $args) {
    // Create new book or list all books
});
```

## Route callbacks

Each routing method described above accepts a callback routine as its final argument. This argument can be any PHP callable, and it accepts three arguments.

**Request**
: The first argument is a `Psr\Http\Message\RequestInterface` object that represents the current HTTP request.

**Response**
: The second argument is a `Psr\Http\Message\ResponseInterface` object that represents the current HTTP response.

**Arguments**
: The third argument is an associative array that contains values for the current route's named placeholders.

There are two ways you can write content to the HTTP response. First, you can simply `echo()` content from the route callback. This content will be appended to the current HTTP response object. Second, you can return a `Psr\Http\Message\ResponseInterface` object.

### Closure binding

If you use a `Closure` instance as the route callback, the closure's state is bound to the `\Slim\App` instance. This means you can access the `\Slim\App` object from inside the route callback with `$this`. Becaues the `\Slim\App` is itself an instance of `\Pimple\Container`, you can quickly access any registered Pimple services from inside the Closure callback like this:

```php
$app = new \Slim\App();
$app->get('/hello/{name}', function ($request, $response, $args) {
    // Use app HTTP cookie service
    $this['cookies']->set('name', [
        'name' => $args['name'],
        'expires' => '7 days'
    ]);
});
```

## Route placeholders

Each routing method described above accepts a URL pattern that is matched against the current HTTP request URI. Route patterns may use named placeholders to dynamically match HTTP request URI segments.

### Format

A route pattern placeholder starts with a `{`, followed by the placeholder name, ending with a `}`. This is an example placeholder named `name`:

```php
$app = new \Slim\App();
$app->get('/hello/{name}', function ($request, $response, $args) {
    echo "Hello, " . $args['name'];
});
```

### Regular expression matching

By default the place holders are written inside `{}` and can accept any
values. However, placeholders can also require the HTTP request URI to match a particular regular expression. If the current HTTP request URI does not match a placeholder regular expression, the route is not invoked. This is an example placeholder named `id` that requires a digit.

```php
$app = new \Slim\App();
$app->get('/users/{id:[0-9]+}', function ($request, $response, $args) {
    // Find user identified by $args['id']
});
```

## Route names

Application route's can be assigned a name. This is useful if you want to programmatically generate a URL to a specific route with the router's `urlFor()` method. Each routing method described above returns a `\Slim\Route` object, and this object exposes a `setName()` method.

```php
$app = new \Slim\App();
$app->get('/hello/{name}', function ($request, $response, $args) {
    echo "Hello, " . $args['name'];
})->setName('hello');
```

You can generate a URL for this named route with the application router's `urlFor()`  method.

```php
echo $app['router']->urlFor('hello', [
    'name' => 'Josh'
]);
// Outputs "/hello/Josh"
```

The router's `urlFor()` method accepts two arguments:

1. The route name
2. Associative array of route pattern placeholders and replacement values
