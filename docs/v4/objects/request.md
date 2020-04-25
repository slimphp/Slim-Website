---
title: Request
---

Your Slim app's routes and middleware are given a PSR-7 request object that
represents the current HTTP request received by your web server. The request
object implements the [PSR-7 ServerRequestInterface][psr7] with which you can
inspect and manipulate the HTTP request method, headers, and body.

[psr7]: https://www.php-fig.org/psr/psr-7/#321-psrhttpmessageserverrequestinterface

## How to get the Request object

The PSR-7 request object is injected into your Slim application routes as the
first argument to the route callback like this:

<figure markdown="1">
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
<figcaption>Figure 1: Inject PSR-7 request into application route callback.</figcaption>
</figure>

The PSR-7 request object is injected into your Slim application _middleware_
as the first argument of the middleware callable like this:

<figure markdown="1">
```php
<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$app->add(function (ServerRequestInterface $request, RequestHandler $handler) {
   return $handler->handle($request);
});

// ...define app routes...

$app->run();
```
<figcaption>Figure 2: Inject PSR-7 request into application middleware.</figcaption>
</figure>

## The Request Method

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

It is possible to fake or _override_ the HTTP request method. This is
useful if, for example, you need to mimic a `PUT` request using a traditional
web browser that only supports `GET` or `POST` requests.

<div class="alert alert-info">
    <div><strong>Heads Up!</strong></div>
    To enable request method overriding the <a href="/docs/v4/middleware/method-overriding.html">Method Overriding Middleware</a> must be injected into your application.
</div>

There are two ways to override the HTTP request method. You can include a
`METHOD` parameter in a `POST` request's body. The HTTP request must use the
`application/x-www-form-urlencoded` content type.

<figure markdown="1">
```bash
POST /path HTTP/1.1
Host: example.com
Content-type: application/x-www-form-urlencoded
Content-length: 22

data=value&_METHOD=PUT
```
<figcaption>Figure 3: Override HTTP method with _METHOD parameter.</figcaption>
</figure>

You can also override the HTTP request method with a custom
`X-Http-Method-Override` HTTP request header. This works with any HTTP request
content type.

<figure markdown="1">
```bash
POST /path HTTP/1.1
Host: example.com
Content-type: application/json
Content-length: 16
X-Http-Method-Override: PUT

{"data":"value"}
```
<figcaption>Figure 4: Override HTTP method with X-Http-Method-Override header.</figcaption>
</figure>

## The Request URI

Every HTTP request has a URI that identifies the requested application
resource. The HTTP request URI has several parts:

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

The PSR-7 Request object's URI is itself an object that provides the following
methods to inspect the HTTP request's URL parts:

* getScheme()
* getAuthority()
* getUserInfo()
* getHost()
* getPort()
* getPath()
* getBasePath()
* getQuery() <small>(returns the full query string, e.g. `a=1&b=2`)</small>
* getFragment()
* getBaseUrl()

You can get the query parameters as an associative array on the Request object using `getQueryParams()`.

<div class="alert alert-info">
    <div><strong>Base Path</strong></div>
    If your Slim application's front-controller lives in a physical subdirectory
    beneath your document root directory, you can fetch the HTTP request's physical
    base path (relative to the document root) with the Uri object's <code>getBasePath()</code>
    method. This will be an empty string if the Slim application is installed
    in the document root's top-most directory.
</div>

## The Request Headers

Every HTTP request has headers. These are metadata that describe the HTTP
request but are not visible in the request's body. Slim's PSR-7
Request object provides several methods to inspect its headers.

### Get All Headers

You can fetch all HTTP request headers as an associative array with the PSR-7
Request object's `getHeaders()` method. The resultant associative array's keys
are the header names and its values are themselves a numeric array of string
values for their respective header name.

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

You can get a single header's value(s) with the PSR-7 Request object's `getHeader($name)` method. This returns an array of values for the given header name. Remember, _a single
HTTP header may have more than one value!_

<figure markdown="1">
```php
$headerValueArray = $request->getHeader('Accept');
```
<figcaption>Figure 6: Get values for a specific HTTP header.</figcaption>
</figure>

You may also fetch a comma-separated string with all values for a given header
with the PSR-7 Request object's `getHeaderLine($name)` method. Unlike the
`getHeader($name)` method, this method returns a comma-separated string.

<figure markdown="1">
```php
$headerValueString = $request->getHeaderLine('Accept');
```
<figcaption>Figure 7: Get single header's values as comma-separated string.</figcaption>
</figure>

### Detect Header

You can test for the presence of a header with the PSR-7 Request object's
`hasHeader($name)` method.

<figure markdown="1">
```php
if ($request->hasHeader('Accept')) {
    // Do something
}
```
<figcaption>Figure 8: Detect presence of a specific HTTP request header.</figcaption>
</figure>

## The Request Body

Every HTTP request has a body. If you are building a Slim application that
consumes JSON or XML data, you can use the PSR-7 Request object's
`getParsedBody()` method to parse the HTTP request body into a native PHP format. 
Note that body parsing differs from one PSR-7 implementation to another.

You may need to implement middleware in order to parse the incoming input depending on the PSR-7 implementation you have installed. Here is an example for parsing incoming `JSON` input:
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

<figure markdown="1">
```php
$parsedBody = $request->getParsedBody();
```
<figcaption>Figure 9: Parse HTTP request body into native PHP format</figcaption>
</figure>

Technically speaking, the PSR-7 Request object represents the HTTP request
body as an instance of `Psr\Http\Message\StreamInterface`. You can get
the HTTP request body `StreamInterface` instance with the PSR-7 Request object's
`getBody()` method. The `getBody()` method is preferable if the incoming HTTP
request size is unknown or too large for available memory.

<figure markdown="1">
```php
$body = $request->getBody();
```
<figcaption>Figure 10: Get HTTP request body</figcaption>
</figure>

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

The file uploads in `$_FILES` are available from the Request object's
`getUploadedFiles()` method. This returns an array keyed by the name of the
`input` element.

<figure markdown="1">
```php
$files = $request->getUploadedFiles();
```
<figcaption>Figure 11: Get uploaded files</figcaption>
</figure>

Each object in the `$files` array is an instance of
`Psr\Http\Message\UploadedFileInterface` and supports the following methods:

* getStream()
* moveTo($targetPath)
* getSize()
* getError()
* getClientFilename()
* getClientMediaType()

See the [cookbook](/docs/v4/cookbook/uploading-files.html) on how to upload files using a POST form.

## Request Helpers

Slim's PSR-7 Request implementation provides these additional proprietary methods
to help you further inspect the HTTP request.

### Detect XHR requests

You can detect XHR requests by checking if the header `X-Requested-With` is `XMLHttpRequest` using the Request's `getHeaderLine()` method.

<figure markdown="1">
```bash
POST /path HTTP/1.1
Host: example.com
Content-type: application/x-www-form-urlencoded
Content-length: 7
X-Requested-With: XMLHttpRequest

foo=bar
```
<figcaption>Figure 13: Example XHR request.</figcaption>
</figure>

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

### Request Parameter

To fetch single request parameter value. You will need to use `getServerParams()`

For example, to get a single Server Parameter:

```php
$params = $request->getServerParams();
$authorization = isset($params['HTTP_AUTHORIZATION']) ? $params['HTTP_AUTHORIZATION'] : null;
```

## Route Object

Sometimes in middleware you require the parameter of your route.

In this example we are checking first that the user is logged in and second that the user has permissions to view the particular video they are attempting to view.

```php
<?php
$app
  ->get('/course/{id}', Video::class.":watch")
  ->add(PermissionMiddleware::class);
```

```php
<?php
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Routing\RouteContext;

class PermissionMiddleware {
    public function __invoke(Request $request, RequestHandler $handler) {
        $routeContext = RouteContext::fromRequest($request);
        $route = $routeContext->getRoute();
        
        $courseId = $route->getArgument('id');
        
        // ...do permission logic...
        
        return $handler->handle($request);
    }
}
```

## Obtain Base Path From Within Route

To obtain the base path from within a route simply do the following:

```php
<?php
use Slim\Factory\AppFactory;
use Slim\Routing\RouteContext;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$app->get('/', function($request, $response) {
    $routeContext = RouteContext::fromRequest($request);
    $basePath = $routeContext->getBasePath();
    
    // ...
    
    return $response;
});
```

## Attributes

With PSR-7 it is possible to inject objects/values into the request object for further processing. In your applications middleware often need to pass along information to your route closure and the way to do it is to add it to the request object via an attribute.

Example, Setting a value on your request object.

```php
$app->add(function ($request, $handler) {
    // add the session storage to your request as [READ-ONLY]
    $request = $request->withAttribute('session', $_SESSION);
    return $handler->handle($request);
});
```

Example, how to retrieve the value.

```php
$app->get('/test', function ($request, $response, $args) {
    $session = $request->getAttribute('session'); // get the session from the request
    return $response->write('Yay, ' . $session['name']);
});
```

The request object also has bulk functions as well. `$request->getAttributes()` and `$request->withAttributes()`
