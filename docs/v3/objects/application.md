---
title: Application
---

The Application, (or `Slim\App`) is the entry point to your Slim application and is used to register the routes that link to your callbacks or controllers.

```php
// instantiate the App object
$app = new \Slim\App();

// Add route callbacks
$app->get('/', function ($request, $response, $args) {
    return $response->withStatus(200)->write('Hello World!');
});

// Run application
$app->run();
```

## Application Configuration

The Application accepts just one argument. This can be either a [Container](/docs/v3/concepts/di.html) instance or
an array to configure the default container that is created automatically.

There are also a number of settings that are used by Slim. These are stored in the `settings`
configuration key. You can also add your application-specific settings.

For example, we can set the Slim setting `displayErrorDetails` to true and also configure
Monolog like this:

```php
$config = [
    'settings' => [
        'displayErrorDetails' => true,

        'logger' => [
            'name' => 'slim-app',
            'level' => Monolog\Logger::DEBUG,
            'path' => __DIR__ . '/../logs/app.log',
        ],
    ],
];
$app = new \Slim\App($config);
```


### Retrieving Settings

As the settings are stored in the DI container so you can access them via the `settings` key in container factories. For example:

```php
$loggerSettings = $container->get('settings')['logger'];
```

You can also access them in route callables via `$this`:

```php
$app->get('/', function ($request, $response, $args) {
    $loggerSettings = $this->get('settings')['logger'];
    // ...
});
```

### Updating Settings

If you need to add or update settings stored in the DI container *after* the container is initialized,
you can use the `replace` method on the settings container. For example:

```php
$settings = $container->get('settings');
$settings->replace([
    'displayErrorDetails' => true,
    'determineRouteBeforeAppMiddleware' => true,
]);
```

## Slim Default Settings

Slim has the following default settings that you can override:

<dl>
<dt><code>httpVersion</code></dt>
    <dd>The protocol version used by the <a href="/docs/v3/objects/response.html">Response</a>
        object.
        <br>(Default: <code>'1.1'</code>)</dd>
<dt><code>responseChunkSize</code></dt>
    <dd>Size of each chunk read from the Response body when sending to the
        browser.
        <br>(Default: <code>4096</code>)</dd>
<dt><code>outputBuffering</code></dt>
    <dd>If <code>false</code>, then no output buffering is enabled. If <code>'append'</code>
        or <code>'prepend'</code>, then any <code>echo</code> or <code>print</code>
        statements are captured and are either appended or prepended to the Response
        returned from the route callable.
        <br>(Default: <code>'append'</code>)</dd>
<dt><code>determineRouteBeforeAppMiddleware</code></dt>
    <dd>When true, the route is calculated before any middleware is executed. This
    means that you can inspect route parameters in middleware if you need to.
    <br>(Default: <code>false</code>)</dd>
<dt><code>displayErrorDetails</code></dt>
    <dd>When true, additional information about exceptions are displayed by the
    <a href="/docs/v3/handlers/error.html">default error handler</a>.
    <br>(Default: <code>false</code>)</dd>
<dt><code>addContentLengthHeader</code></dt>
    <dd>When true, Slim will add a <code>Content-Length</code> header to the response.
    If you are using a runtime analytics tool, such as New Relic, then this should be disabled.
    <br>(Default: <code>true</code>)</dd>
<dt><code>routerCacheFile</code></dt>
    <dd>Filename for caching the FastRoute routes. To create the file, this needs to be set to a filename 
    that does not exist in a writable directory upon first run. Once the file has been populated with the cache data, 
    only read permissions are required for this file. You may need to generate this file in your development environment 
    and commit it to your project if the application does not have write permissions on your deployment server.
    <br/>Set to <code>false</code> to disable the FastRoute cache system.
    <br/>(Default: <code>false</code>)</dd>
</dl>
