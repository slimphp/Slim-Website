---
title: Setting up CORS
---

CORS - Cross origin resource sharing

A good flowchart for implementing CORS support Reference:

[CORS server flowchart](http://www.html5rocks.com/static/images/cors_server_flowchart.png)

You can test your CORS Support here: http://www.test-cors.org/

You can read the specification here: https://www.w3.org/TR/cors/


## The simple solution

For simple CORS requests, the server only needs to add the following header to its response:

```bash
Access-Control-Allow-Origin: <domain>, ... 
```

The following code should enable lazy CORS.

```php
$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
});

$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
            ->withHeader('Access-Control-Allow-Origin', 'http://mysite')
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
});
```

Add the following route as the last route:

```php
<?php
use Slim\Exception\HttpNotFoundException;

/*
 * Catch-all route to serve a 404 Not Found page if none of the routes match
 * NOTE: make sure this route is defined last
 */
$app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/{routes:.+}', function ($request, $response) {
    throw new HttpNotFoundException($request);
});
```


## Access-Control-Allow-Methods

The following middleware can be used to query Slim's router and get a list of methods a particular pattern implements.

Here is a complete example application:

```php
<?php
use Slim\Factory\AppFactory;
use Slim\Routing\RouteContext;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

// This middleware will append the response header Access-Control-Allow-Methods with all allowed methods
$app->add(function($request, $handler) {
    $routeContext = RouteContext::fromRequest($request);
    $routingResults = $routeContext->getRoutingResults();
    $methods = $routingResults->getAllowedMethods();
    
    $response = $handler->handle($request);
    $response = $response->withHeader('Access-Control-Allow-Methods', implode(",", $methods));
    
    return $response;
});

// The RoutingMiddleware should be added after our CORS middleware so routing is performed first
$app->addRoutingMiddleware();

$app->get("/api/{id}", function($request, $response, $arguments) {
    // ...
});

$app->post("/api/{id}", function($request, $response, $arguments) {
    // ...
});

$app->map(["DELETE", "PATCH"], "/api/{id}", function($request, $response, $arguments) {
    // ...
});

// Pay attention to this when you are using some javascript front-end framework and you are using groups in slim php
$app->group('/api', function () {
    // Due to the behaviour of browsers when sending PUT or DELETE request, you must add the OPTIONS method. Read about preflight.
    $this->map(['PUT', 'OPTIONS'], '/{user_id:[0-9]+}', function ($request, $response, $arguments) {
        // Your code here...
    });
});

$app->run();
```
