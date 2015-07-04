---
title: Dependency Injection
---

## Container

Slim uses a dependency injection container to prepare, manage, and inject dependencies. Slim supports any container that implements the [Container-Interop](https://github.com/container-interop/container-interop) interface. You may use Slim's built-in container (based on [Pimple](http://pimple.sensiolabs.org/)), or you may use one of the many third-party Container-Interop containers like [Acclimate](https://github.com/jeremeamia/acclimate-container) or [PHP-DI](http://php-di.org/).

## Usage

You must inject the container instance into the Slim application constructor.

{% highlight php %}
$app = new \Slim\App(new \Slim\Container);
{% endhighlight %}

Afterwards, you can fetch objects from your container explicitly or implicitly.
You can fetch an explicit reference to the container instance from within a Slim application route like this:

{% highlight php %}
$app->get('/foo', function ($req, $res, $args) {
    $container = $this->getContainer();
    $foo = $container->get('foo');
});
{% endhighlight %}

However, you can also implicitly fetch objects from the application container like this:

{% highlight php %}
$app->get('/foo', function ($req, $res, $args) {
    $foo = $this->foo;
});
{% endhighlight %}

Slim uses magic `__get()` and `__isset()` methods that delegate to the application container for all properties that do not already exist on the application instance.

## Required services

Your container MUST implement these required services. If you use Slim's built-in container, these are provided for you. If you choose a third-party container, you must define these required services on your own.

settings
:   Associative array of application settings, including keys `cookieLifetime`, `cookiePath`, `cookieDomain`, `cookieSecure`, `cookieHttpOnly`, `httpVersion`, and `responseChunkSize`.

environment
:   Instance of `\Slim\Interfaces\Http\EnvironmentInterface`.

request
:   Instance of `\Psr\Http\Message\RequestInterface`.

response
:   Instance of `\Psr\Http\Message\ResponseInterface`.

router
:   Instance of `\Slim\Interfaces\RouterInterface`.

errorHandler
:   Callable invoked if application error. The callable **MUST** return an instance of `\Psr\Http\Message\ResponseInterface` and accept three arguments:

1. `\Psr\Http\Message\RequestInterface`
2. `\Psr\Http\Message\ResponseInterface`
3. `\Exception`

notFoundHandler
:   Callable invoked if the current HTTP request URI does not match an application route. The callable **MUST** return an instance of `\Psr\Http\Message\ResponseInterface` and accept two arguments:

1. `\Psr\Http\Message\RequestInterface`
2. `\Psr\Http\Message\ResponseInterface`

notAllowedHandler
:   Callable invoked if an application route matches the current HTTP request path but not its method. The callable **MUST** return an instance of `\Psr\Http\Message\ResponseInterface` and accept three arguments:

1. `\Psr\Http\Message\RequestInterface`
2. `\Psr\Http\Message\ResponseInterface`
3. Array of allowed HTTP methods
