---
title: Upgrade Guide
---

If you are upgrading from version 2 to version 3, these are the significant changes that
you need to be aware of.

# New PHP version
`"php": ">=5.5.0"`

# Changed Signature of Route Functions
In Slim 2.x:

{% highlight php %}
$app->get('/', function () {  $app->halt(400, 'Bad Request'); });
{% endhighlight %}

In Slim 3.x:

{% highlight php %}
$app->get('/', function (Request $req,  Response $res, $args = []) {
    return $res->withStatus(400)->write('Bad Request');
});
{% endhighlight %}

# Hooks
Slim v3 no longer has the concept of hooks. Hooks were removed as they duplicate the functionality already present in middlewares. You should be able to easily convert your Hook code into Middleware code.

# Removal HTTP Cache
In Slim v3 we have removed the HTTP-Caching into its own module Slim\Http\Cache ( https://github.com/slimphp/Slim-HttpCache )

# Removal of Stop/Halt
Slim Core has removed Stop/Halt.
In your applications, you should transition to using the withStatus() and withBody()

# Changed Redirect
In Slim v2.x one would use the helper function $app->redirect(); to trigger a redirect request.
In Slim v3.x one can do the same with using the Response class like so.

Example:

{% highlight php %}
$app->get('/', function ($req, $res, $args) {
  return $res->withStatus(301)->withHeader("Location", "yournewuri");
});
{% endhighlight %}

# Middleware
Signature
----
The middleware signature has changed from a class to a function
New signature:

{% highlight php %}
$app->add(function (Request $req,  Response $res, $next) {
    //Do stuff before passing a long
    $newRespose = $next($req, $res);
    //Do Stuff after route is rendered
    return $newResponse; //continue
});
{% endhighlight %}

# Middleware Execution
Application middleware is executed as Last In First Executed (LIFE)

# Flash Messages
Flash messages are no longer a part of the Slim v3 core but instead have been moved to seperate [Slim Flash](/docs/features/flash.html) package.

# Cookies
In v3.0 cookies has been removed from core and moved to a separate component. See (https://github.com/slimphp/Slim-Http-Cookies)

# Removal of Crypto
In v3.0 we have removed the dependency for crypto in core.

# PHP Version
Slim v3.0 requires PHP 5.5+

# New Router
Slim now utilizes a new, more powerful router ( https://github.com/nikic/FastRoute )!

# Route Middleware
The syntax for adding route middleware has changed slightly.
In v3.0:

{% highlight php %}
php $app->get(…)->add($mw2)->add($mw1);
{% endhighlight %}

# urlFor() is now pathfor() in the router

`urlFor()` has been renamed `pathFor()` and can be found in the `router` object:

{% highlight php %}
$app->get('/', function ($request, $response, $args) {
    $url = $this->router->pathFor('home');
    $response->write("<a href='$url'>Home</a>");
    return $response;
})->setName('home');
{% endhighlight %}

Also, `pathFor()` is base path aware.

# Container and DI ... Constructing
Slim uses Pimple as a Dependency Injection Container

{% highlight php %}

//index.php
$app = new Slim\App(
    new \Slim\Container(
        include "../config/container.config.php"
    )
);

//Slim will grab the Home class from the container defined below and execute its index method
//If the class is not defined in the container Slim will still contruct it and pass the container as the first arugment to the constructor!
$app->get('/', Home::class . ':index');


//In container.config.php
// We are using the SlimTwig here
return [
    "settings" => [
        'viewTemplatesDirectory' => "../templates",
    ],
    'twig' => [
        'title' => '',
        'description' => '',
        'author' => ''
    ],
    'view' => function ($c) {
        $view = new Twig(
            $c['settings']['viewTemplatesDirectory'],
            [
                'cache' => false //"../cache"
            ]
        );

        // Instantiate and add Slim specific extension
        $view->addExtension(
            new TwigExtension(
                $c['router'],
                $c['request']->getUri()
            )
        );

        foreach ($c['twig'] as $name => $value) {
            $view->getEnvironment()->addGlobal($name, $value);
        }

        return $view;
    },
    Home::class => function ($c) {
        return new Home($c['view']);
    }
];

{% endhighlight %}

# PSR-7 Objects
//To Do
