---
title: Request
---

Your Slim app's routes and middleware are given a PSR 7 request object that
represents the current HTTP request received by your web server. The request
object implements the [PSR 7 ServerRequestInterface][psr7] with which you can
inspect and manipulate the HTTP request method, headers, and body.

[psr7]: http://www.php-fig.org/psr/psr-7/#3-2-1-psr-http-message-serverrequestinterface

## How to get the Request object

The PSR 7 request object is injected into your Slim application routes as the
first argument to the route callback like this:

<figure>
{% highlight php %}
<?php
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;

$app = new \Slim\App;
$app->get('/foo', function (ServerRequestInterface $request, ResponseInterface $response) {
    // Use the PSR 7 $request object

    return $response;
});
$app->run();
{% endhighlight %}
<figcaption>Figure 1: Inject PSR 7 request into application route callback.</figcaption>
</figure>

The PSR 7 request object is injected into your Slim application _middleware_
as the first argument of the middleware callable like this:

<figure>
{% highlight php %}
<?php
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;

$app = new \Slim\App;
$app->add(function (ServerRequestInterface $request, ResponseInterface $response, callable $next) {
    // Use the PSR 7 $request object

    return $next($request, $response);
});
// Define app routes...
$app->run();
{% endhighlight %}
<figcaption>Figure 2: Inject PSR 7 request into application middleware.</figcaption>
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

{% highlight php %}
$method = $request->getMethod();
{% endhighlight %}

Because this is a common task, Slim's
built-in PSR 7 implementation also provides these proprietary methods that return
`true` or `false`.

* `$request->isGet()`
* `$request->isPost()`
* `$request->isPut()`
* `$request->isDelete()`
* `$request->isHead()`
* `$request->isPatch()`
* `$request->isOptions()`

It is possible to fake or _override_ the HTTP request method. This is
useful if, for example, you need to mimic a `PUT` request using a traditional
web browser that only supports `GET` or `POST` requests.

There are two ways to override the HTTP request method. You can include a
`_METHOD` parameter in a `POST` request's body. The HTTP request must use the
`application/x-www-form-urlencoded` content type.

<figure>
{% highlight text %}
POST /path HTTP/1.1
Host: example.com
Content-type: application/x-www-form-urlencoded
Content-length: 22

data=value&_METHOD=PUT
{% endhighlight %}
<figcaption>Figure 3: Override HTTP method with _METHOD parameter.</figcaption>
</figure>

You can also override the HTTP request method with a custom
`X-Http-Method-Override` HTTP request header. This works with any HTTP request
content type.

<figure>
{% highlight text %}
POST /path HTTP/1.1
Host: example.com
Content-type: application/json
Content-length: 16
X-Http-Method-Override: PUT

{"data":"value"}
{% endhighlight %}
<figcaption>Figure 4: Override HTTP method with X-Http-Method-Override header.</figcaption>
</figure>

You can fetch the _original_ (non-overridden) HTTP method with the PSR 7 Request
object's method named `getOriginalMethod()`.

## The Request URI

Every HTTP request has a URI that identifies the requested application
resource. The HTTP request URI has several parts:

* Scheme (e.g. `http` or `https`)
* Host (e.g. `example.com`)
* Port (e.g. `80` or `443`)
* Path (e.g. `/users/1`)
* Query string (e.g. `sort=created&dir=asc`)

You can fetch the PSR 7 Request object's URI with its `getUri()` method:

{% highlight php %}
$uri = $request->getUri();
{% endhighlight %}

The PSR 7 Request object's URI is itself an object that provides the following
methods to inspect the HTTP request's URL parts:

* `getScheme()`
* `getHost()`
* `getPort()`
* `getPath()`
* `getBasePath()`
* `getQuery()` <small>(returns string)</small>
* `getQueryParams()` <small>(returns associative array)</small>

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
request but are not visible reflected in the request's body. Slim's PSR 7
Request object provides several methods to inspect its headers.

### Get All Headers

You can fetch all HTTP request headers an associative array with the PSR 7
Request object's `getHeaders()` method. The resultant associative array's keys
are the header names and its values are themselves a numeric array of string
values for their respective header name.

<figure>
{% highlight php %}
$headers = $request->getHeaders();
foreach ($headers as $name => $values) {
    echo $name . ": " . implode(", ", $values);
}
{% endhighlight %}
<figcaption>Figure 5: Fetch and iterate all HTTP request headers as an associative array.</figcaption>
</figure>

### Get One Header

You can get a single header's value(s) with the PSR 7 Request object's `getHeader($name)` method. This returns an array of values for the given header name. Remember, _a single
HTTP header may have more than one value!_

<figure>
{% highlight php %}
$headerValueArray = $request->getHeader('Accept');
{% endhighlight %}
<figcaption>Figure 6: Get values for a specific HTTP header.</figcaption>
</figure>

You may also fetch a comma-separated string with all values for a given header
with the PSR 7 Request object's `getHeaderLine($name)` method. Unlike the
`getHeader($name)` method, this method returns a comma-separated string.

<figure>
{% highlight php %}
$headerValueString = $request->getHeaderLine('Accept');
{% endhighlight %}
<figcaption>Figure 7: Get single header's values as comma-separated string.</figcaption>
</figure>

### Detect Header

You can test for the presence of a header with the PSR 7 Request object's
`hasHeader($name)` method.

<figure>
{% highlight php %}
if ($request->hasHeader('Accept')) {
    // Do something
}
{% endhighlight %}
<figcaption>Figure 8: Detect presence of a specific HTTP request header.</figcaption>
</figure>

## Request Body

Every HTTP request has a body. Slim's PSR 7 Request object represents the HTTP
request body as an instance of `\Psr\Http\Message\StreamInterface`. You can get
the HTTP request body with the PSR 7 Request object's `getBody()` method. The
`getBody()` method is preferable if the incoming HTTP request size is unknown
or too large for available memory.

<figure>
{% highlight php %}
$body = $request->getBody();
{% endhighlight %}
<figcaption>Figure 9: Get HTTP request body</figcaption>
</figure>

The resultant `\Psr\Http\Message\StreamInterface` instance provides the following
methods to read and iterate its underlying PHP `resource`.

* `getSize()`
* `tell()`
* `eof()`
* `isSeekable()`
* `seek()`
* `rewind()`
* `isWritable()`
* `write($string)`
* `isReadable()`
* `read($length)`
* `getContents()`
* `getMetadata($key = null)`

If you are building a Slim application that consumes JSON or XML data, you
can use the PSR 7 Request object's `getParsedBody()` method to parse the HTTP
request body into a native PHP format. Slim can parse JSON, XML, and URL-encoded
data out of the box.

<figure>
{% highlight php %}
$parsedBody = $request->getParsedBody();
{% endhighlight %}
<figcaption>Figure 10: Parse HTTP request body into native PHP format</figcaption>
</figure>

* JSON requests are converted into a PHP object with `json_decode($input)`.
* XML requests are converted into a `SimpleXMLElement` with `simplexml_load_string($input)`.
* URL-encoded requests are converted into a PHP array with `parse_str($input)`.

## Request Helpers

The Request object provides additional methods to inspect the HTTP request metadata (e.g., content type, charset, length, and IP address).

### Detect AJAX / XHR requests

You can detect AJAX/XHR requests with the Request object's `isAjax()` and `isXhr()` methods. Both methods do the same thing, so choose only one. These methods detect the presence of the `X-Requested-With` HTTP request header and ensure its value is `XMLHttpRequest`. These methods also return `true` if the `isajax` parameter is provided in the HTTP request query string or body.

{% highlight php %}
if ($request->isAjax()) {
    // Do something
}
{% endhighlight %}

### Content Type

You can fetch the HTTP request content type with the Request object's `getContentType()` method. This returns the `Content-Type` header's full value as provided by the HTTP client.

{% highlight php %}
$contentType = $request->getContentType();
{% endhighlight %}

### Media Type

You may not want the complete `Content-Type` header. What if, instead, you only want the media type? You can fetch the HTTP request media type with the Request object's `getMediaType()` method.

{% highlight php %}
$mediaType = $request->getMediaType();
{% endhighlight %}

You can fetch the appended media type parameters as an associative array with the Request object's `getMediaTypeParams()` method.

{% highlight php %}
$mediaParams = $request->getMediaTypeParams();
{% endhighlight %}

### Character Set

One of the most common media type parameters is the HTTP request character set. The Request object provides a dedicated method to retrieve this media type parameter.

{% highlight php %}
$charset = $request->getContentCharset();
{% endhighlight %}

### Content Length

You can fetch the HTTP request content length with the Request object's `getContentLength()` method.

{% highlight php %}
$length = $request->getContentLength();
{% endhighlight %}

### IP Address

You can fetch the HTTP request's source IP address with the Request object's `getIp()` method. This method respects the `X-Forwarded-For` header, if present.

{% highlight php %}
$ip = $request->getIp();
{% endhighlight %}
