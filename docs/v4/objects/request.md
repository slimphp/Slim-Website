---
title: Request
---

Your Slim app's routes and middleware are given a PSR-7 request object that represents the current HTTP request received by your web server.
The request object implements the [PSR-7 ServerRequestInterface][psr7] with which you can inspect and manipulate the HTTP request method, headers, and body.

[psr7]: https://www.php-fig.org/psr/psr-7/#321-psrhttpmessageserverrequestinterface

## How to get the Request object

The PSR-7 request object is injected into your Slim application routes as the 
first argument to the route callback like this:

```php
<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$app->get('/hello', function (Request $request, Response $response) {
    $response->getBody()->write('Hello World');
    return $response;
});

$app->run();
```

The PSR-7 request object is injected into your Slim application _middleware_ 
as the first argument of the middleware callable like this:

Inject PSR-7 request into application middleware:

```php
<?php

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$app->add(function (Request $request, RequestHandler $handler) {
   return $handler->handle($request);
});

// ...define app routes...

$app->run();
```

## The Request HTTP-Method

Every HTTP request has a method that is typically one of:

* GET
* POST
* PUT
* DELETE
* HEAD
* PATCH
* OPTIONS

You can inspect the HTTP request's method with the Request object method 
appropriately named `getMethod()`.

```php
$method = $request->getMethod();
```

It is possible to fake or _override_ the HTTP request method. 
This is useful if, for example, you need to mimic a `PUT` request using a traditional web browser that only supports `GET` or `POST` requests.

**Note:** To enable request method overriding the <a href="/docs/v4/middleware/method-overriding.html">Method Overriding Middleware</a> must be injected into your application.

There are two ways to override the HTTP request method. 
You can include a `METHOD` parameter in a `POST` request's body. 
The HTTP request must use the `application/x-www-form-urlencoded` content type.

Override HTTP method with _METHOD parameter:

```bash
POST /path HTTP/1.1
Host: example.com
Content-type: application/x-www-form-urlencoded
Content-length: 22

data=value&_METHOD=PUT
```

You can also override the HTTP request method with a custom `X-Http-Method-Override` 
HTTP request header. This works with any HTTP request content type.

```bash
POST /path HTTP/1.1
Host: example.com
Content-type: application/json
Content-length: 16
X-Http-Method-Override: PUT

{"data":"value"}
```

### Server Parameters

To fetch data related to the incoming request environment, you will need to use `getServerParams()`.
For example, to get a single Server Parameter:

```php
$params = $request->getServerParams();
$authorization = $params['HTTP_AUTHORIZATION'] ?? null;
```

### POST Parameters

If the request method is `POST` and the `Content-Type` is either
`application/x-www-form-urlencoded` or `multipart/form-data`,
you can retrieve all `POST` parameters as follows:

```php
// Get all POST parameters
$params = (array)$request->getParsedBody();

// Get a single POST parameter
$foo = $params['foo'];
```

## The Request URI

Every HTTP request has a URI that identifies the requested application resource. 
The HTTP request URI has several parts:

* Scheme (e.g. `http` or `https`)
* Host (e.g. `example.com`)
* Port (e.g. `80` or `443`)
* Path (e.g. `/users/1`)
* Query string (e.g. `sort=created&dir=asc`)

You can fetch the PSR-7 Request object's [URI object][psr7_uri] with its `getUri()` method:

[psr7_uri]: https://www.php-fig.org/psr/psr-7/#35-psrhttpmessageuriinterface

```php
$uri = $request->getUri();
```

The PSR-7 Request object's URI is itself an object that provides the following methods to inspect the HTTP request's URL parts:

* getScheme()
* getAuthority()
* getUserInfo()
* getHost()
* getPort()
* getPath()
* getQuery() <small>(returns the full query string, e.g. `a=1&b=2`)</small>
* getFragment()

You can get the query parameters as an associative array on the Request object using `getQueryParams()`.

### Query String Parameters

The `getQueryParams()` method retrieves all query parameters from the
URI of an HTTP request as an associative array.

If there are no query parameters, it returns an empty array.

Internally, the method uses [parse_str](https://www.php.net/manual/en/function.parse-str.php)
to parse the query string into an array.

**Usage**

```php
// URL: https://example.com/search?key1=value1&key2=value2
$queryParams = $request->getQueryParams();
```

```php
Array
(
    [key1] => value1
    [key2] => value2
)
```

To read a single value from the query parameters array, you can use the parameter's name as the key.

```php
// Output: value1
$key1 = $queryParams['key1'] ?? null;

// Output: value2
$key2 = $queryParams['key2'] ?? null;

// Output: null
$key3 = $queryParams['key3'] ?? null;
```

**Note:** `?? null` ensures that if the query parameter does
not exist, `null` is returned instead of causing a warning.

## The Request Headers

Every HTTP request has headers. 
These are metadata that describe the HTTP request but are not visible in the request's body. Slim's PSR-7 Request object provides several methods to inspect its headers.

### Get All Headers

You can fetch all HTTP request headers as an associative array with the PSR-7
Request object's `getHeaders()` method. 
The resultant associative array's keys are the header names and its values are themselves a numeric array of string values for their respective header name.

<figure markdown="1">
```php
$headers = $request->getHeaders();
foreach ($headers as $name => $values) {
    echo $name . ": " . implode(", ", $values);
}
```
<figcaption>Figure 5: Fetch and iterate all HTTP request headers as an associative array.</figcaption>
</figure>

### Get One Header

You can get a single header's value(s) with the PSR-7 Request object's `getHeader($name)` method. 
This returns an array of values for the given header name. 
Remember, _a single HTTP header may have more than one value!_

Get values for a specific HTTP header:
```php
$headerValueArray = $request->getHeader('Accept');
```

You may also fetch a comma-separated string with all values for a given header with the PSR-7 Request object's `getHeaderLine($name)` method. 
Unlike the `getHeader($name)` method, this method returns a comma-separated string.

Get single header's values as comma-separated string:
```php
$headerValueString = $request->getHeaderLine('Accept');
```

### Detect Header

You can test for the presence of a header with the PSR-7 Request object's `hasHeader($name)` method.

```php
if ($request->hasHeader('Accept')) {
    // Do something
}
```

### Detect XHR requests

You can detect XHR requests by checking if the header `X-Requested-With` 
is `XMLHttpRequest` using the Request's `getHeaderLine()` method.

Example XHR request:

```bash
POST /path HTTP/1.1
Host: example.com
Content-type: application/x-www-form-urlencoded
Content-length: 7
X-Requested-With: XMLHttpRequest

foo=bar
```

```php
if ($request->getHeaderLine('X-Requested-With') === 'XMLHttpRequest') {
    // Do something
}
```

### Content Type

You can fetch the HTTP request content type with the Request object's `getHeaderLine()` method.

```php
$contentType = $request->getHeaderLine('Content-Type');
```

### Content Length

You can fetch the HTTP request content length with the Request object's `getHeaderLine()` method.

```php
$length = $request->getHeaderLine('Content-Length');
```

## The Request Body

Every HTTP request has a body. 
If you are building a Slim application that consumes JSON or XML data, you can use the PSR-7 Request object's `getParsedBody()` method to parse the HTTP request body into a native PHP format. 
Note that body parsing differs from one PSR-7 implementation to another.

You may need to implement middleware in order to parse the incoming input depending on the PSR-7 implementation you have installed. 
Here is an example for parsing incoming `JSON` input:

```php
<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

class JsonBodyParserMiddleware implements MiddlewareInterface
{
    public function process(Request $request, RequestHandler $handler): Response
    {
        $contentType = $request->getHeaderLine('Content-Type');

        if (strstr($contentType, 'application/json')) {
            $contents = json_decode(file_get_contents('php://input'), true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $request = $request->withParsedBody($contents);
            }
        }

        return $handler->handle($request);
    }
}
```

Parse HTTP request body into native PHP format:

```php
$parsedBody = $request->getParsedBody();
```

Technically speaking, the PSR-7 Request object represents the HTTP request body as an instance of `Psr\Http\Message\StreamInterface`. 
You can get the HTTP request body `StreamInterface` instance with the PSR-7 Request object's `getBody()` method. 
The `getBody()` method is preferable if the incoming HTTP request size is unknown or too large for available memory.

Get HTTP request body:

```php
$body = $request->getBody();
```

The resultant `Psr\Http\Message\StreamInterface` instance provides the following 
methods to read and iterate its underlying PHP `resource`.

* getSize()
* tell()
* eof()
* isSeekable()
* seek()
* rewind()
* isWritable()
* write($string)
* isReadable()
* read($length)
* getContents()
* getMetadata($key = null)

## Uploaded Files

The file uploads in `$_FILES` are available from the Request object's `getUploadedFiles()` method. 
This returns an array keyed by the name of the `input` element.

Get uploaded files:

```php
$files = $request->getUploadedFiles();
```

Each object in the `$files` array is an instance of `Psr\Http\Message\UploadedFileInterface` 
and supports the following methods:

* getStream()
* moveTo($targetPath)
* getSize()
* getError()
* getClientFilename()
* getClientMediaType()

See the [cookbook](/docs/v4/cookbook/uploading-files.html) on how to upload files using a POST form.

## Attributes

With PSR-7 it is possible to inject objects/values into the request object for further processing. 
In your applications middleware often need to pass along information to your route closure and the way to do it is to add it to the request object via an attribute.

Example, setting a value on your request object.

```php
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

$app->add(function (Request $request, RequestHandler $handler) {
    // Add the session storage to your request as [READ-ONLY]
    $request = $request->withAttribute('session', $_SESSION);
    
    return $handler->handle($request);
});
```

Example, how to retrieve the value.

```php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

$app->get('/test', function (Request $request, Response $response) {
    // Get the session from the request
    $session = $request->getAttribute('session');
    
    $response->getBody()->write('Yay, ' . $session['name']);
    
    return $response;
});
```

The request object also has bulk functions as well. `$request->getAttributes()` and `$request->withAttributes()`
