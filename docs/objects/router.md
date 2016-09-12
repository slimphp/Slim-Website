---
title: Router
---

The Slim Framework's router is built on top of the [nikic/fastroute](https://github.com/nikic/FastRoute) component, and it is remarkably fast and stable.

## How to create routes

You can define application routes using proxy methods on the `\Slim\App` instance. The Slim Framework provides methods for the most popular HTTP methods.

### GET Route

You can add a route that handles only `GET` HTTP requests with the Slim
application's `get()` method. It accepts two arguments:

1. The route pattern (with optional named placeholders)
2. The route callback

{% highlight php %}
$app = new \Slim\App();
$app->get('/books/{id}', function ($request, $response, $args) {
    // Show book identified by $args['id']
});
{% endhighlight %}

### POST Route

You can add a route that handles only `POST` HTTP requests with the Slim
application's `post()` method. It accepts two arguments:

1. The route pattern (with optional named placeholders)
2. The route callback

{% highlight php %}
$app = new \Slim\App();
$app->post('/books', function ($request, $response, $args) {
    // Create new book
});
{% endhighlight %}

### PUT Route

You can add a route that handles only `PUT` HTTP requests with the Slim
application's `put()` method. It accepts two arguments:

1. The route pattern (with optional named placeholders)
2. The route callback

{% highlight php %}
$app = new \Slim\App();
$app->put('/books/{id}', function ($request, $response, $args) {
    // Update book identified by $args['id']
});
{% endhighlight %}

### DELETE Route

You can add a route that handles only `DELETE` HTTP requests with the Slim
application's `delete()` method. It accepts two arguments:

1. The route pattern (with optional named placeholders)
2. The route callback

{% highlight php %}
$app = new \Slim\App();
$app->delete('/books/{id}', function ($request, $response, $args) {
    // Delete book identified by $args['id']
});
{% endhighlight %}

### OPTIONS Route

You can add a route that handles only `OPTIONS` HTTP requests with the Slim
application's `options()` method. It accepts two arguments:

1. The route pattern (with optional named placeholders)
2. The route callback

{% highlight php %}
$app = new \Slim\App();
$app->options('/books/{id}', function ($request, $response, $args) {
    // Return response headers
});
{% endhighlight %}

### PATCH Route

You can add a route that handles only `PATCH` HTTP requests with the Slim
application's `patch()` method. It accepts two arguments:

1. The route pattern (with optional named placeholders)
2. The route callback

{% highlight php %}
$app = new \Slim\App();
$app->patch('/books/{id}', function ($request, $response, $args) {
    // Apply changes to book identified by $args['id']
});
{% endhighlight %}

### Any Route

You can add a route that handles all HTTP request methods with the Slim application's `any()` method. It accepts two arguments:

1. The route pattern (with optional named placeholders)
2. The route callback

{% highlight php %}
$app = new \Slim\App();
$app->any('/books/[{id}]', function ($request, $response, $args) {
    // Apply changes to books or book identified by $args['id'] if specified.
    // To check which method is used: $request->getMethod();
});
{% endhighlight %}

Note that the second parameter is a callback. You could specify a Class (which need a `__invoke()` implementation) instead of a Closure. You can then do the mapping somewhere else:

{% highlight php %}
$app->any('/user', 'MyRestfulController');
{% endhighlight %}

### Custom Route

You can add a route that handles multiple HTTP request methods with the Slim application's `map()` method. It accepts three arguments:

1. Array of HTTP methods
2. The route pattern (with optional named placeholders)
3. The route callback

{% highlight php %}
$app = new \Slim\App();
$app->map(['GET', 'POST'], '/books', function ($request, $response, $args) {
    // Create new book or list all books
});
{% endhighlight %}

## Route callbacks

Each routing method described above accepts a callback routine as its final argument. This argument can be any PHP callable, and by default it accepts three arguments.

**Request**
: The first argument is a `Psr\Http\Message\ServerRequestInterface` object that represents the current HTTP request.

**Response**
: The second argument is a `Psr\Http\Message\ResponseInterface` object that represents the current HTTP response.

**Arguments**
: The third argument is an associative array that contains values for the current route's named placeholders.

### Writing content to the response

There are two ways you can write content to the HTTP response. First, you can simply `echo()` content from the route callback. This content will be appended to the current HTTP response object. Second, you can return a `Psr\Http\Message\ResponseInterface` object.

### Closure binding

If you use a `Closure` instance as the route callback, the closure's state is bound to the `Container` instance. This means you will have access to the DI container instance _inside_ of the Closure via the `$this` keyword:

{% highlight php %}
$app = new \Slim\App();
$app->get('/hello/{name}', function ($request, $response, $args) {
    // Use app HTTP cookie service
    $this->get('cookies')->set('name', [
        'value' => $args['name'],
        'expires' => '7 days'
    ]);
});
{% endhighlight %}

## Route strategies

The route callback signature is determined by a route strategy. By default, Slim expects route callbacks to accept the request, response, and an array of route placeholder arguments. This is called the RequestResponse strategy. However, you can change the expected route callback signature by simply using a different strategy. As an example, Slim provides an alternative strategy called RequestResponseArgs that accepts request and response, plus each route placeholder as a separate argument. Here is an example of using this alternative strategy; simply replace the `foundHandler` dependency provided by the default `\Slim\Container`:

{% highlight php %}
$c = new \Slim\Container();
$c['foundHandler'] = function() {
    return new \Slim\Handlers\Strategies\RequestResponseArgs();
};

$app = new \Slim\App($c);
$app->get('/hello/{name}', function ($request, $response, $name) {
    return $response->write($name);
});
{% endhighlight %}

You can provide your own route strategy by implementing the `\Slim\Interfaces\InvocationStrategyInterface`.

## Route placeholders

Each routing method described above accepts a URL pattern that is matched against the current HTTP request URI. Route patterns may use named placeholders to dynamically match HTTP request URI segments.

### Format

A route pattern placeholder starts with a `{`, followed by the placeholder name, ending with a `}`. This is an example placeholder named `name`:

{% highlight php %}
$app = new \Slim\App();
$app->get('/hello/{name}', function ($request, $response, $args) {
    echo "Hello, " . $args['name'];
});
{% endhighlight %}

### Optional segments

To make a section optional, simply wrap in square brackets:

{% highlight php %}
$app->get('/users[/{id}]', function ($request, $response, $args) {
    // reponds to both `/users` and `/users/123`
    // but not to `/users/`
});
{% endhighlight %}


Multiple optional parameters are supported by nesting:

{% highlight php %}
$app->get('/news[/{year}[/{month}]]', function ($request, $response, $args) {
    // reponds to `/news`, `/news/2016` and `/news/2016/03`
});
{% endhighlight %}

For "Unlimited" optional parameters, you can do this:

{% highlight php %}
$app->get('/news[/{params:.*}]', function ($request, $response, $args) {
    $params = explode('/', $request->getAttribute('params'));

    // $params is an array of all the optional segments
});
{% endhighlight %}

In this example, a URI of `/news/2016/03/20` would result in the `$params` array
containing three elements: `['2016', '03', '20']`.


### Regular expression matching

By default the placeholders are written inside `{}` and can accept any
values. However, placeholders can also require the HTTP request URI to match a particular regular expression. If the current HTTP request URI does not match a placeholder regular expression, the route is not invoked. This is an example placeholder named `id` that requires one or more digits.

{% highlight php %}
$app = new \Slim\App();
$app->get('/users/{id:[0-9]+}', function ($request, $response, $args) {
    // Find user identified by $args['id']
});
{% endhighlight %}

## Route names

Application routes can be assigned a name. This is useful if you want to programmatically generate a URL to a specific route with the router's `pathFor()` method. Each routing method described above returns a `\Slim\Route` object, and this object exposes a `setName()` method.

{% highlight php %}
$app = new \Slim\App();
$app->get('/hello/{name}', function ($request, $response, $args) {
    echo "Hello, " . $args['name'];
})->setName('hello');
{% endhighlight %}

You can generate a URL for this named route with the application router's `pathFor()`  method.

{% highlight php %}
echo $app->getContainer()->get('router')->pathFor('hello', [
    'name' => 'Josh'
]);
// Outputs "/hello/Josh"
{% endhighlight %}

The router's `pathFor()` method accepts two arguments:

1. The route name
2. Associative array of route pattern placeholders and replacement values

## Route groups

To help organize routes into logical groups, the `\Slim\App` also provides a `group()` method. Each group's route pattern is prepended to the routes or groups contained within it, and any placeholder arguments in the group pattern are ultimately made available to the nested routes:

{% highlight php %}
$app = new \Slim\App();
$app->group('/users/{id:[0-9]+}', function () {
    $this->map(['GET', 'DELETE', 'PATCH', 'PUT'], '', function ($request, $response, $args) {
        // Find, delete, patch or replace user identified by $args['id']
    })->setName('user');
    $this->get('/reset-password', function ($request, $response, $args) {
        // Route for /users/{id:[0-9]+}/reset-password
        // Reset the password for user identified by $args['id']
    })->setName('user-password-reset');
});
{% endhighlight %}

Note inside the group closure, `$this` is used instead of `$app`. Slim binds the closure to the application instance for you, just like it is the case with route callback binds with container instance.
* inside group closure, `$this` is binded to the instance of `Slim\App`
* inside route callbacks, `$this` is binded to the instance of `Slim\Container`

## Route middleware

You can also attach middleware to any route or route group. [Learn more](/docs/concepts/middleware.html).

## Container Resolution

You are not limited to defining a function for your routes. In Slim there are a few different ways to define your route action functions.

In addition to a function, you may use:
 - An invokable class
 - `Class:method`
 
This function is enabled by Slim's Callable Resolver Class. It translates a string entry into a function call.
Example:

{% highlight php %}
$app->get('/home', '\HomeController:home');
{% endhighlight %}

In this code above we are defining a `/home` route and telling Slim to execute the `home()` method on the `\HomeController` class.

Slim first looks for an entry of `\HomeController` in the container, if it's found it will use that instance otherwise it will call it's constructor with the container as the first argument. Once an instance of the class is created it will then call the specified method using whatever Strategy you have defined.
 
Alternatively, you can use an invokable class, such as:

{% highlight php %}
class MyAction {
   protected $ci;
   //Constructor
   public function __construct(ContainerInterface $ci) {
       $this->ci = $ci;
   }
   
   public function __invoke($request, $response, $args) {
        //your code
        //to access items in the container... $this->ci->get('');
   }
}
{% endhighlight %}

You can use this class like so.

{% highlight php %}
$app->get('/home', '\MyAction');
{% endhighlight %}

In a more traditional MVC approach you can construct controllers with many actions instead of an invokable class which only handles one action.

{% highlight php %}
class MyController {
   protected $ci;
   //Constructor
   public function __construct(ContainerInterface $ci) {
       $this->ci = $ci;
   }
   
   public function method1($request, $response, $args) {
        //your code
        //to access items in the container... $this->ci->get('');
   }
   
   public function method2($request, $response, $args) {
        //your code
        //to access items in the container... $this->ci->get('');
   }
      
   public function method3($request, $response, $args) {
        //your code
        //to access items in the container... $this->ci->get('');
   }
}
{% endhighlight %}

You can use your controller methods like so.

{% highlight php %}
$app->get('/method1', '\MyController:method1');
$app->get('/method2', '\MyController:method2');
$app->get('/method3', '\MyController:method3');
{% endhighlight %}
