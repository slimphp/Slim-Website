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

## Request URL

In accordance with the PSR-7 standard, you can inspect the Request URI by fetching the Uri instance from the Request object.

{% highlight php %}
$uri = $request->getUri();
{% endhighlight %}

### Scheme

You can fetch the HTTP request scheme (e.g., HTTP or HTTPS) with the Uri object's `getScheme()` method.

{% highlight php %}
$scheme = $uri->getScheme();
{% endhighlight %}

### Host

You can fetch the HTTP request's host (e.g., example.com) with the Uri object's `getHost()` method.

{% highlight php %}
$host = $uri->getHost();
{% endhighlight %}

### Port

You can fetch the HTTP request's port number (e.g., 443) with the Uri object's `getPort()` method.

{% highlight php %}
$port = $uri->getPort();
{% endhighlight %}

### URL Path

You can fetch the HTTP request's path (relative to the physical directory in which your Slim application is installed) with the Uri object's `getPath()` method. This method returns a string that is matched against your Slim application routes.

{% highlight php %}
$path = $uri->getPath();
{% endhighlight %}

### URL Base Path

You can fetch the HTTP request's physical base path (relative to the document root) with the Uri object's `getBasePath()` method. This will be an empty string unless the Slim application is installed in a physical subdirectory beneath your document root.

{% highlight php %}
$basePath = $uri->getBasePath();
{% endhighlight %}

### Query String

You can fetch the HTTP request's raw query string (without the leading "?") with the Uri object's `getQuery()` method. This method returns an empty string if no query string is present in the current HTTP request.

{% highlight php %}
$queryString = $uri->getQuery();
{% endhighlight %}

You may also fetch an associative array of query string parameters with the Request object's `getQueryParams()` method. This method returns an empty array if no query string is present.

{% highlight php %}
$queryParams = $request->getQueryParams();
{% endhighlight %}

## Request Headers

You can inspect the current HTTP request's headers with numerous methods on the Request object.

### All Headers

You can fetch an associative array of all headers with the Request object's `getHeaders()` method. The result is an associative array whose keys are header names and whose values are themselves an array of string values for their respective header name.

{% highlight php %}
$headers = $request->getHeaders();
foreach ($headers as $name => $values) {
    echo $name . ": " . implode(", ", $values);
}
{% endhighlight %}

### Detect Header

You can test for the presence of a header with the Request object's `hasHeader($name)` method.

{% highlight php %}
if ($request->hasHeader('Accept')) {
    // Do something
}
{% endhighlight %}

### Fetch Single Header

You can fetch a single header's value(s) with the Request object's `getHeader($name)` method. This returns an array of strings for the given header name.

{% highlight php %}
$headerValues = $request->getHeader('Accept');
{% endhighlight %}

You may also fetch a comma-concatenation of a given header's value(s) with the Request object's `getHeaderLine($name)` method. Unlike the `getHeader($name)` method that returns an array, this method returns a string and concatenates multiple header values into a single string separated by commas.

{% highlight php %}
$headerValueString = $request->getHeaderLine('Accept');
{% endhighlight %}

## Request Cookies

You can fetch the HTTP request's cookie data as an associative array with the Request object's `getCookieParams()` method. This is rudimentary, but it adheres to the PSR-7 interface. We are currently working on a better interface to inspect and manage HTTP cookies.

## Request Body

You can inspect the HTTP request's body with the Request object's `getBody()` and `getParsedBody()` methods.

### The getBody() method

The Request object's `getBody()` method returns a `\Psr\Http\Message\StreamInterface` instance, and it provides methods to iterate and read the HTTP request body's underlying stream resource. Use this method if your inbound HTTP requests are very large or of unknown size to avoid potential PHP memory exhaustion errors.

### The getParsedBody() method

You may also fetch a parsed representation of the HTTP request body using the Request object's `getParsedBody()` method. This method works for `application/json`, `application/xml`, and `application/x-www-form-urlencoded` HTTP requests. You should use this method for reasonably sized HTTP request bodies when building applications that consume JSON or XML data.

* JSON requests are converted into a PHP object with `json_decode($httpInput)`.
* XML requests are converted into a `SimpleXMLElement` with `simplexml_load_string($httpInput)`.
* Form-encoded requests are converted into a PHP array with `parse_str($httpInput)`.

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
