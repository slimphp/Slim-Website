---
title: Setting up CORS
---

Cross-Origin Resource Sharing ([CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)) is a security feature implemented 
in web browsers that allows or restricts web pages from making requests 
to a domain different from the one that served the web page. 

It is a mechanism that enables controlled access to resources located 
outside of a given domain. 

CORS is essential for enabling secure communication between different 
web applications while preventing malicious cross-origin requests. 

By specifying certain headers, servers can indicate which origins are 
permitted to access their resources, thus maintaining a balance between 
usability and security.

A good flowchart for implementing CORS support:
[CORS Server Flowchart](https://www.html5rocks.com/static/images/cors_server_flowchart.png)

You can read the specification here: <https://fetch.spec.whatwg.org/#cors-protocol>

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

**Optional:** Add the following route as the last route:

```php
use Slim\Exception\HttpNotFoundException;

/**
 * Catch-all route to serve a 404 Not Found page if none of the routes match
 * NOTE: make sure this route is defined last
 */
$app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/{routes:.+}', function ($request, $response) {
    throw new HttpNotFoundException($request);
});
```

## CORS example application

Here is a complete CORS example application that uses a CORS middleware:

```php
<?php

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\Factory\AppFactory;

require_once __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$app->addBodyParsingMiddleware();

// Add the RoutingMiddleware before the CORS middleware
// to ensure routing is performed later
$app->addRoutingMiddleware();

// Add the ErrorMiddleware before the CORS middleware
// to ensure error responses contain all CORS headers.
$app->addErrorMiddleware(true, true, true);

// This CORS middleware will append the response header
// Access-Control-Allow-Methods with all allowed methods
$app->add(function (ServerRequestInterface $request, RequestHandlerInterface $handler) use ($app): ResponseInterface {
    if ($request->getMethod() === 'OPTIONS') {
        $response = $app->getResponseFactory()->createResponse();
    } else {
        $response = $handler->handle($request);
    }

    $response = $response
        ->withHeader('Access-Control-Allow-Credentials', 'true')
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', '*')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        ->withHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        ->withHeader('Pragma', 'no-cache');

    if (ob_get_contents()) {
        ob_clean();
    }

    return $response;
});

// Define app routes
$app->get('/', function (ServerRequestInterface $request, ResponseInterface $response) {
    $response->getBody()->write('Hello, World!');
    
    return $response;
});

// ...

$app->run();
```

## Access-Control-Allow-Credentials

If the request contains credentials (cookies, authorization headers or TLS client certificates), 
you might need to add an `Access-Control-Allow-Credentials` header to the response object.

```php
$response = $response->withHeader('Access-Control-Allow-Credentials', 'true');
```