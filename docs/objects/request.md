---
title: Request
---

A Request object encapsulates the HTTP request data derived from the Environment object. You use the Request object to inspect the current HTTP request's method, headers, and body. Typically, you are provided a PSR-7 Request object (e.g., in middleware or an application route).

{% highlight php %}
<?php
$app = new \Slim\App;
$app->get('/foo', function ($request, $response) {
    // Use the provided `$request` object
});
$app->run();
{% endhighlight %}

However, you can fetch a _new_ Request object from the application container like this:

{% highlight php %}
$newRequest = $app->request;
{% endhighlight %}

## Request Method

You can inspect the current HTTP request method with the Request object's `getMethod()` method. This returns a string value equal to `GET`, `POST`, `PUT`, `DELETE`, `HEAD`, `OPTIONS`, or `PATCH`.

{% highlight php %}
$method = $request->getMethod();
{% endhighlight %}

### GET Method

You can detect HTTP `GET` requests with the Request object's `isGet()` method.

{% highlight php %}
if ($request->isGet()) {
    // Do something
}
{% endhighlight %}

### POST Method

You can detect HTTP `POST` requests with the Request object's `isPost()` method.

{% highlight php %}
if ($request->isPost()) {
    // Do something
}
{% endhighlight %}

### PUT Method

You can detect HTTP `PUT` requests with the Request object's `isPut()` method.

{% highlight php %}
if ($request->isPut()) {
    // Do something
}
{% endhighlight %}

### DELETE Method

You can detect HTTP `DELETE` requests with the Request object's `isDelete()` method.

{% highlight php %}
if ($request->isDelete()) {
    // Do something
}
{% endhighlight %}

### HEAD Method

You can detect HTTP `HEAD` requests with the Request object's `isHead()` method.

{% highlight php %}
if ($request->isHead()) {
    // Do something
}
{% endhighlight %}

### OPTIONS Method

You can detect HTTP `OPTIONS` requests with the Request object's `isOptions()` method.

{% highlight php %}
if ($request->isOptions()) {
    // Do something
}
{% endhighlight %}

### PATCH Method

You can detect HTTP `PATCH` requests with the Request object's `isPatch()` method.

{% highlight php %}
if ($request->isPatch()) {
    // Do something
}
{% endhighlight %}

### Method Override

There are two ways to override the HTTP request method. You can override the HTTP request method using the `_METHOD` parameter, or you can send a custom `X-HTTP-Method-Override` header. This is particularly useful if, for example, you need to mimic a `PUT` request using a traditional web browser that only supports `POST` requests. You can always fetch the _original_ (non-overridden) HTTP method with the Request object's `getOriginalMethod()` method.

#### With a body parameter

Include a `_METHOD` parameter in a `POST` request body. You must use the `application/x-www-form-urlencoded` content type.

{% highlight text %}
POST /path HTTP/1.1
Host: example.com
Content-type: application/x-www-form-urlencoded
Content-length: 22

data=value&_METHOD=PUT
{% endhighlight %}

#### With a header

You may also include the `X-HTTP-Method-Override` header in the HTTP request. You can use any content type.

{% highlight text %}
POST /path HTTP/1.1
Host: example.com
Content-type: application/json
Content-length: 16
X-HTTP-Method-Override: PUT

{"data":"value"}
{% endhighlight %}

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

You can fetch the HTTP request's source IP address with the Request object's `getIp()` method. This method respects the `X-Forwarded-For` header if present.

{% highlight php %}
$ip = $request->getIp();
{% endhighlight %}
