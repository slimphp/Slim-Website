---
title: Twig Templates
---

## The slim/twig-view component

The [Twig-View][twigview] PHP component helps you render [Twig][twig] templates in your application.
This component is available on Packagist, and it's easy to install with Composer like this:

[twigview]: https://github.com/slimphp/Twig-View
[twig]: https://twig.symfony.com/

## Installation

```
composer require slim/twig-view
```

## Usage

Next, you need to add the middleware to the Slim app:

```php
<?php

use Slim\Factory\AppFactory;
use Slim\Views\Twig;
use Slim\Views\TwigMiddleware;

require __DIR__ . '/../vendor/autoload.php';

// Create App
$app = AppFactory::create();

// Create Twig
$twig = Twig::create(__DIR__ . '/../templates', ['cache' => false]);

// Add Twig-View Middleware
$app->add(TwigMiddleware::create($app, $twig));
```

**Note:** For production scenarios, `cache` should be set to some 
`'path/to/cache'` to store compiled templates (thus avoiding recompilation on every request). 
For more information, see [Twig environment options](https://twig.symfony.com/doc/3.x/api.html#environment-options)

Now you can use the `slim/twig-view` component service inside 
an app route to render a template and write it to a PSR-7 Response object like this:

```php
$app->get('/', function ($request, $response) {
    $view = Twig::fromRequest($request);
    
    return $view->render($response, 'home.html.twig', [
        'name' => 'John',
    ]);
});

// Run app
$app->run();
```

In this example, `$view` invoked inside the route callback is a reference to the `\Slim\Views\Twig` instance returned by the `fromRequest` method.
The `\Slim\Views\Twig` instance's `render()` method accepts a PSR-7 Response object as its first argument, the Twig template path as its second argument, and an array of template variables as its final argument.
The `render()` method returns a new PSR-7 Response object whose body is the rendered Twig template.

Create a directory in your project root: `templates/`

Create a Twig template file within the templates directory: `templates/home.html.twig`

```html
{% raw %}
<!DOCTYPE html>
<html>
<head>
    <title>Welcome to Slim!</title>
</head>
<body>
<h1>Hello {{ name }}</h1>
</body>
</html>
{% endraw %}
```

### The url_for() method

The `slim/twig-view` component exposes a custom `url_for()` function to your Twig templates.
You can use this function to generate complete URLs to any named route in your Slim application.
The `url_for()` function accepts two arguments:

1. A route name
2. A hash of route placeholder names and replacement values

The second argument's keys should correspond to the selected route's pattern placeholders.
This is an example Twig template that draws a link URL for the "profile" named route shown in the example Slim application above.

```html
{% raw %}
<a href="{{ url_for('profile', { 'name': 'josh' }) }}">Josh</a></li>
{% endraw %}
```

## Read more

* [PHP-View documentation](https://github.com/slimphp/PHP-View)