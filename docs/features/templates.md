---
title: Templates
---

Slim does not have a view layer like traditional MVC frameworks. Instead,
Slim's "view" _is the HTTP response_. Each Slim application route is responsible
for preparing and returning an appropriate PSR 7 response object.

> Slim's "view" is the HTTP response.

That being said, the Slim project provides the [Twig-View](#the-slimtwig-view-component) and
[PHP-View](#the-slimphp-view-component) components to help you render templates to a PSR7
Response object.

## The slim/twig-view component

The [Twig-View][twigview] PHP component helps you render [Twig][twig]
templates in your application. This component is available on Packagist, and
it's easy to install with Composer like this:

[twigview]: https://github.com/slimphp/Twig-View
[twig]: http://twig.sensiolabs.org/

<figure>
{% highlight text %}
composer require slim/twig-view
{% endhighlight %}
<figcaption>Figure 1: Install slim/twig-view component.</figcaption>
</figure>

Next, you need to register the component as a service on the Slim app's
container like this:

<figure>
{% highlight php %}
<?php
// Create app
$app = new \Slim\App();

// Get container
$container = $app->getContainer();

// Register component on container
$container['view'] = function ($container) {
    $view = new \Slim\Views\Twig('path/to/templates', [
        'cache' => 'path/to/cache'
    ]);
    
    // Instantiate and add Slim specific extension
    $basePath = rtrim(str_ireplace('index.php', '', $container['request']->getUri()->getBasePath()), '/');
    $view->addExtension(new Slim\Views\TwigExtension($container['router'], $basePath));

    return $view;
};
{% endhighlight %}
<figcaption>Figure 2: Register slim/twig-view component with container.</figcaption>
</figure>

Note : "cache" could be set to false to disable it, see also 'auto_reload' option, useful in development environment. For more information, see [Twig environment options](http://twig.sensiolabs.org/doc/2.x/api.html#environment-options)

Now you can use the `slim/twig-view` component service inside an app route
to render a template and write it to a PSR 7 Response object like this:

<figure>
{% highlight php %}
// Render Twig template in route
$app->get('/hello/{name}', function ($request, $response, $args) {
    return $this->view->render($response, 'profile.html', [
        'name' => $args['name']
    ]);
})->setName('profile');

// Run app
$app->run();
{% endhighlight %}
<figcaption>Figure 3: Render template with slim/twig-view container service.</figcaption>
</figure>

In this example, `$this->view` invoked inside the route callback is a reference
to the `\Slim\Views\Twig` instance returned by the `view` container service.
The `\Slim\Views\Twig` instance's `render()` method accepts a PSR 7 Response
object as its first argument, the Twig template path as its second argument,
and an array of template variables as its final argument. The `render()` method
returns a new PSR 7 Response object whose body is the rendered Twig template.

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

## The slim/php-view component

The [PHP-View][phpview] PHP component helps you render PHP templates.
This component is available on Packagist and can be installed using
Composer like this:

[phpview]: https://github.com/slimphp/PHP-View

<figure>
{% highlight text %}
composer require slim/php-view
{% endhighlight %}
<figcaption>Figure 4: Install slim/php-view component.</figcaption>
</figure>

To register this component as a service on Slim App's container, do this:

<figure>
{% highlight php %}
<?php
// Create app
$app = new \Slim\App();

// Get container
$container = $app->getContainer();

// Register component on container
$container['view'] = function ($container) {
    return new \Slim\Views\PhpRenderer('path/to/templates/with/trailing/slash/');
};
{% endhighlight %}
<figcaption>Figure 5: Register slim/php-view component with container.</figcaption>
</figure>

Use the view component to render a PHP view like this:

<figure>
{% highlight php %}

// Render PHP template in route
$app->get('/hello/{name}', function ($request, $response, $args) {
    return $this->view->render($response, 'profile.html', [
        'name' => $args['name']
    ]);
})->setName('profile');

// Run app
$app->run();
{% endhighlight %}
<figcaption>Figure 6: Render template with slim/php-view container service.</figcaption>
</figure>

## Other template systems

You are not limited to the `Twig-View` and `PHP-View` components. You
can use any PHP template system provided that you ultimately write the rendered
template output to the PSR 7 Response object's body.
