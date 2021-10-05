---
title: Templates
l10n-link: features-v4-templates
---

Slim does not have a view layer like traditional MVC frameworks. Instead,
Slim's "view" _is the HTTP response_. Each Slim application route is responsible
for preparing and returning an appropriate PSR-7 response object.

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

<figure markdown="1">
```
composer require slim/twig-view
```
<figcaption>Figure 1: Install slim/twig-view component.</figcaption>
</figure>

Next, you need to add the slim/twig-view middleware to the Slim app:

<figure markdown="1">
```php
<?php
use Slim\Factory\AppFactory;
use Slim\Views\Twig;
use Slim\Views\TwigMiddleware;

require __DIR__ . '/vendor/autoload.php';

// Create App
$app = AppFactory::create();

// Create Twig
$twig = Twig::create('path/to/templates', ['cache' => false]);

// Add Twig-View Middleware
$app->add(TwigMiddleware::create($app, $twig));
```
<figcaption>Figure 2: Add slim/twig-view middleware.</figcaption>
</figure>

Note : For production scenarios, `cache` should be set to some `'path/to/cache'` to store compiled templates (thus avoiding recomplication on every request). For more information, see [Twig environment options](http://twig.sensiolabs.org/doc/2.x/api.html#environment-options)

Now you can use the `slim/twig-view` component service inside an app route
to render a template and write it to a PSR-7 Response object like this:

<figure markdown="1">
```php
$app->get('/hello/{name}', function ($request, $response, $args) {
    $view = Twig::fromRequest($request);
    return $view->render($response, 'profile.html', [
        'name' => $args['name']
    ]);
})->setName('profile');

// Run app
$app->run();
```
<figcaption>Figure 3: Render template with slim/twig-view container service.</figcaption>
</figure>

In this example, `$view` invoked inside the route callback is a reference
to the `\Slim\Views\Twig` instance returned by the `fromRequest` method.
The `\Slim\Views\Twig` instance's `render()` method accepts a PSR-7 Response
object as its first argument, the Twig template path as its second argument,
and an array of template variables as its final argument. The `render()` method
returns a new PSR-7 Response object whose body is the rendered Twig template.

### The url_for() method

The `slim/twig-view` component exposes a custom `url_for()` function
to your Twig templates. You can use this function to generate complete
URLs to any named route in your Slim application. The `url_for()`
function accepts two arguments:

1. A route name
2. A hash of route placeholder names and replacement values

The second argument's keys should correspond to the selected route's pattern
placeholders. This is an example Twig template that draws a link URL
for the "profile" named route shown in the example Slim application above.

```html
{% raw %}
{% extends "layout.html" %}

{% block body %}
<h1>User List</h1>
<ul>
    <li><a href="{{ url_for('profile', { 'name': 'josh' }) }}">Josh</a></li>
</ul>
{% endblock %}
{% endraw %}
```

## The slim/php-view component

The [PHP-View][phpview] PHP component helps you render PHP templates.
This component is available on Packagist and can be installed using
Composer like this:

[phpview]: https://github.com/slimphp/PHP-View

<figure markdown="1">
```
composer require slim/php-view
```
<figcaption>Figure 6: Install slim/php-view component.</figcaption>
</figure>

You can use it with Slim like this:

<figure markdown="1">
```php
<?php
use Slim\Factory\AppFactory;
use Slim\Views\PhpRenderer;

require __DIR__ . '/vendor/autoload.php';



// Create App
$app = AppFactory::create();

$app->get('/hello/{name}', function ($request, $response, $args) {
    $renderer = new PhpRenderer('path/to/templates');
    return $renderer->render($response, "hello.php", $args);
})->setName('profile');

$app->run();
```
<figcaption>Figure 8: Render template with slim/php-view service.</figcaption>
</figure>

## Other template systems

You are not limited to the `Twig-View` and `PHP-View` components. You
can use any PHP template system provided that you ultimately write the rendered
template output to the PSR-7 Response object's body.
