---
title: Templates
---

A Slim Framework application's view _is the HTTP response_. If you
want to send content to the HTTP client, you must write the appropriate
content to the HTTP response body. There are two ways you can write
content to the HTTP response body.

## The HTTP response

### Write to the Response object

You can write directly to the Slim application's Response object
using the Response object's `write()` method. This is an example
scenario inside a Slim application route:

{% highlight php %}
$app->get('/user/{id:\d+}', function ($request, $response, $args) {
    $response->write(sprintf(
        'You are viewing user with ID: %s',
        $args['id']
    ));

    return $response;
});
{% endhighlight %}

We write a message directly to the Response object, and we return the
response object from the route callback routine when ready.

### Write to the output buffer

We can also write to the current output buffer. Any content captured
by the current output buffer will be appended to the Response
object's body after the route callback routine completes. This example
demonstrates this scenario inside a Slim application route:

{% highlight php %}
$app->get('/user/{id:\d+}', function ($request, $response, $args) {
    echo sprintf(
        'You are viewing user with ID: %s',
        $args['id']
    );
});
{% endhighlight %}

## Templates

The Slim Framework does not provide a built-in templating system.
Instead, you may generate output using third-party template-related tools most
appropriate for your Slim application. Whichever tools you choose,
they are still bound by the rules above: content must be written
directly to the Response object or captured into the current output buffer.

Some great third-party tools for generating templated output include:

* [league/plates](http://platesphp.com/)
* [slim/twig-view](https://github.com/slimphp/Twig-View)

### The slim/twig-view component

The Slim Framework does provide an optional, standalone
component named [slim/twig-view](https://github.com/slimphp/Twig-View). This
standalone component is a Pimple service that provides a [Twig](http://twig.sensiolabs.org/)
templating system for your Slim application.

#### Install with Composer

First, install the [slim/twig-view](https://github.com/slimphp/Twig-View) component
with Composer. Execute this bash command in your project's root directory.

    composer require slim/twig-view

#### Register the view service

The `slim/twig-view` component must be registerd with the Slim application
_before_ you invoke your application's `run()` method.

{% highlight php %}
// Create Slim app
$app = new \Slim\App();

// Get DI Container
$container = $app->getContainer();

// Register Twig View service
$container['view'] = function () {
    $view = new \Slim\Views\Twig('path/to/templates', [
        'cache' => 'path/to/cache'
    ]);

    // Instantiate and add Slim specific extension
    $view->addExtension(new Slim\Views\TwigExtension(
        $c['router'],
        $c['request']->getUri()
    ));

    return $view;
};

// Define your routes here...

// Run app
$app->run();
{% endhighlight %}

The `\Slim\Views\Twig` constructor's first argument is the relative
or absolute path to the filesystem directory that contains your
Twig templates. The constructor's second argument is an associative
array of [Twig environment settings](http://twig.sensiolabs.org/doc/api.html#environment-options).

#### Use the view service

After you register the `slim/twig-view` component, you can access the view
anywhere in your Slim application with `$app->view` or in a route `Closure` with `$this->view`. 
This example demonstrates how to render a template with the Twig View
service.

{% highlight php %}
// Create Slim app
$app = new \Slim\App();

// Get DI Container
$container = $app->getContainer();

// Register Twig View helper
$container['view'] = function () {
    $view = new \Slim\Views\Twig('path/to/templates', [
        'cache' => 'path/to/cache'
    ]);

    // Instantiate and add Slim specific extension
    $view->addExtension(new Slim\Views\TwigExtension(
        $c['router'],
        $c['request']->getUri()
    ));

    return $view;
};

// Define named route
$app->get('/hello/{name}', function ($request, $response, $args) {
    $this->view->render($response, 'profile.html', [
        'name' => $args['name']
    ]);
})->setName('profile');

// Run app
$app->run();
{% endhighlight %}

### The path_for() method

The `slim/twig-view` component exposes a custom `path_for()` function
to your Twig templates. You can use this function to generate complete
URLs to any named route in your Slim application. The `path_for()`
function accepts two arguments:

1. A route name
2. A hash of route placeholder names and replacement values

The second argument's keys should correspond to the selected route's pattern
placeholders. This is an example Twig template that draws a link URL
for the "profile" named route shown in the example Slim application above.

{% highlight html %}
{% raw %}
{% extends "layout.html" %}

{% block body %}
<h1>User List</h1>
<ul>
    <li><a href="{{ path_for('profile', { 'name': 'josh' }) }}">Josh</a></li>
</ul>
{% endblock %}
{% endraw %}
{% endhighlight %}
