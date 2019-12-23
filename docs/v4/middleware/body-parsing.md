---
title: Body Parsing Middleware
---

It’s very common in web APIs to send data in JSON or XML format. 
Out of the box, PSR-7 implementations do not support these formats, 
you have to decode the Request object’s getBody() yourself. 
As this is a common requirement, Slim 4 provides `BodyParsingMiddleware` 
to handle this task.

## Usage

It's recommended to put the body parsing middleware before the call to 
`addErrorMiddlware`, so that the stack looks like this:

```php
<?php

use Slim\Factory\AppFactory;

require_once __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

// Parse json, form data and xml
$app->addBodyParsingMiddleware();

$app->addRoutingMiddleware();

$app->addErrorMiddleware(true, true, true);

// ...

$app->run();
```

## Posted JSON, form or XML data

No changes are required to the POST handler because the `BodyParsingMiddleware` 
detects that the `Content-Type` is set to a `JSON` media type and so places 
the decoded body into the Request’s parsed body property.

For data posted to the website from a browser, 
you can use the $request’s `getParsedBody()` method. 

This will return an array of the posted data.

```php
$app->post('/', function (Request $request, Response $response, $args): Response {
    $data = $request->getParsedBody();
    
    $html = var_export($data, true);
    $response->getBody()->write($html);
    
    return $response;
});
```

## Media type detection

* The middleware reads the `Content-Type` from the request header to detect the media type.
* Checks if this specific media type has a parser registered
* If not, look for a media type with a structured syntax suffix (RFC 6839), e.g. `application/*`

## Supported media types

* application/json
* application/x-www-form-urlencoded
* application/xml
* text/xml