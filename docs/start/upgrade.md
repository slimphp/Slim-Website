---
title: Upgrade Guide
---

If you are upgrading from version 2 to version 3, these are the significant changes that
you need to be aware of.

## New PHP version
Slim 3 requires PHP 5.5+

## Class \Slim\Slim renamed \Slim\App
Slim 3 uses `\Slim\App` for the [Application](/docs/object/application.html) object usually named `$app`.

{% highlight php %}
$app = new \Slim\App();
{% endhighlight %}

## New Route Function Signature

{% highlight php %}
$app->get('/', function (Request $req,  Response $res, $args = []) {
    return $res->withStatus(400)->write('Bad Request');
});
{% endhighlight %}

## Request and response objects are no longer accessible via the Application object
As mentioned above, Slim 3 passes the `Request` and `Response` objects as arguments to the route handling function. Since they are now accessible directly in the body of a route function, `request` and `response` are no longer properties of the `/Slim/App` ([Application](/docs/object/application.html) object) instance.

## Getting _GET and _POST variables
{% highlight php %}
$app->get('/', function (Request $req,  Response $res, $args = []) {
    $myvar1 = $req->getParam('myvar'); //checks both _GET and _POST [NOT PSR-7 Compliant]
    $myvar2 = $req->getParsedBody()['myvar']; //checks _POST  [IS PSR-7 compliant]
    $myvar3 = $req->getQueryParams()['myvar']; //checks _GET [IS PSR-7 compliant]
});
{% endhighlight %}


## Hooks
Hooks are no longer part of Slim as of v3.  You should consider reimplementing any functionality associated with the [default hooks in Slim v2](http://docs.slimframework.com/hooks/defaults/) as [middleware](/docs/concepts/middleware.html) instead.  If you need the ability to apply custom hooks at arbitrary points in your code (for example, within a route), you should consider a third-party package such as [Symfony's EventDispatcher](http://symfony.com/doc/current/components/event_dispatcher/introduction.html) or [Zend Framework's EventManager](https://zend-eventmanager.readthedocs.org/en/latest/).

## Removal HTTP Cache
In Slim v3 we have removed the HTTP-Caching into its own module [Slim\Http\Cache](https://github.com/slimphp/Slim-HttpCache).

## Removal of Stop/Halt
Slim Core has removed Stop/Halt.
In your applications, you should transition to using the withStatus() and withBody() methods.

## Removal of autoloader
`Slim::registerAutoloader()` have been removed, we have fully moved to composer.

## Changes to container
`$app->container->singleton(...)` is now `$app['...'] = function () {};` Please read Pimple docs for more info

## Removal of configureMode()
`$app->configureMode(...)` has been removed in v3.

## Removal of PrettyExceptions
PrettyExceptions cause lots of issues for many people, so these have been removed.

## Route::setDefaultConditions(...) has been removed
We have switched routers which enable you to keep the default conditions regex inside of the route pattern.

## Changes to redirect
In Slim v2.x one would use the helper function `$app->redirect();` to trigger a redirect request.
In Slim v3.x one can do the same with using the Response class like so.

Example:

{% highlight php %}
$app->get('/', function ($req, $res, $args) {
  return $res->withStatus(302)->withHeader('Location', 'your-new-uri');
});
{% endhighlight %}

## Middleware Signature
The middleware signature has changed from a class to a function.

New signature:

{% highlight php %}
use Psr\Http\Message\RequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

$app->add(function (Request $req,  Response $res, callable $next) {
    // Do stuff before passing along
    $newResponse = $next($req, $res);
    // Do stuff after route is rendered
    return $newResponse; // continue
});
{% endhighlight %}

You can still use a class:

{% highlight php %}
namespace My;

use Psr\Http\Message\RequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

class Middleware
{
    function __invoke(Request $req,  Response $res, callable $next) {
        // Do stuff before passing along
        $newResponse = $next($req, $res);
        // Do stuff after route is rendered
        return $newResponse; // continue
    }
}


// Register
$app->add(new My\Middleware());
// or
$app->add(My\Middleware::class);

{% endhighlight %}


## Middleware Execution
Application middleware is executed as Last In First Executed (LIFE).

## Flash Messages
Flash messages are no longer a part of the Slim v3 core but instead have been moved to seperate [Slim Flash](/docs/features/flash.html) package.

## Cookies
In v3.0 cookies has been removed from core. See [FIG Cookies](https://github.com/dflydev/dflydev-fig-cookies) for a PSR-7 compatible cookie component.

## Removal of Crypto
In v3.0 we have removed the dependency for crypto in core.

## New Router
Slim now utilizes [FastRoute](https://github.com/nikic/FastRoute), a new, more powerful router!

This means that the specification of route patterns has changed with named parameters now in braces and square brackets used for optional segments:

{% highlight php %}
// named parameter:
$app->get('/hello/{name}', /*...*/);

// optional segment:
$app->get('/news[/{year}]', /*...*/);
{% endhighlight %}

## Route Middleware
The syntax for adding route middleware has changed slightly.
In v3.0:

{% highlight php %}
$app->get(…)->add($mw2)->add($mw1);
{% endhighlight %}

## Getting the current route
The route is an attribute of the Request object in v3.0:

{% highlight php %}
$request->getAttribute('route');
{% endhighlight %}

When getting the current route in middleware, the value for
`determineRouteBeforeAppMiddleware` must be set to `true` in the Application
configuration, otherwise the getAttribute call returns `null`.

## urlFor() is now pathFor() in the router

`urlFor()` has been renamed `pathFor()` and can be found in the `router` object:

{% highlight php %}
$app->get('/', function ($request, $response, $args) {
    $url = $this->router->pathFor('home');
    $response->write("<a href='$url'>Home</a>");
    return $response;
})->setName('home');
{% endhighlight %}

Also, `pathFor()` is base path aware.

## Container and DI ... Constructing
Slim uses Pimple as a Dependency Injection Container.

{% highlight php %}

// index.php
$app = new Slim\App(
    new \Slim\Container(
        include '../config/container.config.php'
    )
);

// Slim will grab the Home class from the container defined below and execute its index method.
// If the class is not defined in the container Slim will still contruct it and pass the container as the first arugment to the constructor!
$app->get('/', Home::class . ':index');


// In container.config.php
// We are using the SlimTwig here
return [
    'settings' => [
        'viewTemplatesDirectory' => '../templates',
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
                'cache' => false // '../cache'
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

## PSR-7 Objects

### Request, Response, Uri & UploadFile are immutable.
This means that when you change one of these objects, the old instance is not updated.

{% highlight php %}
// This is WRONG. The change will not pass through.
$app->add(function (Request $request, Response $response, $next) {
    $request->withAttribute('abc', 'def');
    return $next($request, $response);
});

// This is correct.
$app->add(function (Request $request, Response $response, $next) {
    $request = $request->withAttribute('abc', 'def');
    return $next($request, $response);
});
{% endhighlight %}

### Message bodies are streams

{% highlight php %}
// ...
$image = __DIR__ . '/huge_photo.jpg';
$body = new Stream($image);
$response = (new Response())
     ->withStatus(200, 'OK')
     ->withHeader('Content-Type', 'image/jpeg')
     ->withHeader('Content-Length', filesize($image))
     ->withBody($body);
// ...
{% endhighlight %}

For text:
{% highlight php %}
// ...
$response = (new Response())->getBody()->write('Hello world!')

// Or Slim specific: Not PSR-7 compliant.
$response = (new Response())->write('Hello world!');
// ...
{% endhighlight %}
