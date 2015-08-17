---
title: Response
---

Your Slim app's routes and middleware are given a PSR 7 response object that
represents the current HTTP response to be returned to the client. The response
object implements the [PSR 7 ResponseInterface][psr7] with which you can
inspect and manipulate the HTTP response status, headers, and body.

[psr7]: http://www.php-fig.org/psr/psr-7/#3-2-1-psr-http-message-responseinterface

## How to get the Response object

The PSR 7 response object is injected into your Slim application routes as the
second argument to the route callback like this:

<figure>
{% highlight php %}
<?php
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;

$app = new \Slim\App;
$app->get('/foo', function (ServerRequestInterface $request, ResponseInterface $response) {
    // Use the PSR 7 $response object

    return $response;
});
$app->run();
{% endhighlight %}
<figcaption>Figure 1: Inject PSR 7 response into application route callback.</figcaption>
</figure>

The PSR 7 response object is injected into your Slim application _middleware_
as the second argument of the middleware callable like this:

<figure>
{% highlight php %}
<?php
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;

$app = new \Slim\App;
$app->add(function (ServerRequestInterface $request, ResponseInterface $response, callable $next) {
    // Use the PSR 7 $response object

    return $next($request, $response);
});
// Define app routes...
$app->run();
{% endhighlight %}
<figcaption>Figure 2: Inject PSR 7 response into application middleware.</figcaption>
</figure>

## The Response Status

Every HTTP response has a numeric [status code][statuscodes]. The status code
identifies the _type_ of HTTP response to be returned to the client. The PSR 7
Response object's default status code is `200` (OK). You can get the PSR 7
Response object's status code with the `getStatusCode()` method like this.

[statuscodes]: http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html

<figure>
{% highlight php %}
$status = $response->getStatusCode();
{% endhighlight %}
<figcaption>Figure 3: Get response status code.</figcaption>
</figure>

You can copy a PSR 7 Response object and assign a new status code like this:

<figure>
{% highlight php %}
$newResponse = $response->withStatus(302);
{% endhighlight %}
<figcaption>Figure 4: Create response with new status code.</figcaption>
</figure>

## The Response Headers

Every HTTP response has headers. These are metadata that describe the HTTP
response but are not visible in the response's body. Slim's PSR 7
Response object provides several methods to inspect and manipulate its headers.

### Get All Headers

You can fetch all HTTP response headers as an associative array with the PSR 7
Response object's `getHeaders()` method. The resultant associative array's keys
are the header names and its values are themselves a numeric array of string
values for their respective header name.

<figure>
{% highlight php %}
$headers = $response->getHeaders();
foreach ($headers as $name => $values) {
    echo $name . ": " . implode(", ", $values);
}
{% endhighlight %}
<figcaption>Figure 5: Fetch and iterate all HTTP response headers as an associative array.</figcaption>
</figure>

### Get One Header

You can get a single header's value(s) with the PSR 7 Response object's
`getHeader($name)` method. This returns an array of values for the given header
name. Remember, _a single HTTP header may have more than one value!_

<figure>
{% highlight php %}
$headerValueArray = $response->getHeader('Vary');
{% endhighlight %}
<figcaption>Figure 6: Get values for a specific HTTP header.</figcaption>
</figure>

You may also fetch a comma-separated string with all values for a given header
with the PSR 7 Response object's `getHeaderLine($name)` method. Unlike the
`getHeader($name)` method, this method returns a comma-separated string.

<figure>
{% highlight php %}
$headerValueString = $response->getHeaderLine('Vary');
{% endhighlight %}
<figcaption>Figure 7: Get single header's values as comma-separated string.</figcaption>
</figure>

### Detect Header

You can test for the presence of a header with the PSR 7 Response object's
`hasHeader($name)` method.

<figure>
{% highlight php %}
if ($response->hasHeader('Vary')) {
    // Do something
}
{% endhighlight %}
<figcaption>Figure 8: Detect presence of a specific HTTP header.</figcaption>
</figure>

### Set Header

You can set a header value with the PSR 7 Response object's
`withHeader($name, $value)` method.

<figure>
{% highlight php %}
$newResponse = $oldResponse->withHeader('Content-type', 'application/json');
{% endhighlight %}
<figcaption>Figure 9: Set HTTP header</figcaption>
</figure>

<div class="alert alert-info">
    <div><strong>Reminder</strong></div>
    <div>
        The Response object is immutable. This method returns a <em>copy</em> of
        the Response object that has the new header value. <strong>This method is
        destructive</strong>, and it <em>replaces</em> existing header
        values already associated with the same header name.
    </div>
</div>

### Append Header

You can append a header value with the PSR 7 Response object's
`withAddedHeader($name, $value)` method.

<figure>
{% highlight php %}
$newResponse = $oldResponse->withAddedHeader('Allow', 'PUT');
{% endhighlight %}
<figcaption>Figure 10: Append HTTP header</figcaption>
</figure>

<div class="alert alert-info">
    <div><strong>Reminder</strong></div>
    <div>
        Unlike the <code>withHeader()</code> method, this method <em>appends</em>
        the new value to the set of values that already exist for the same header
        name. The Response object is immutable. This method returns a
        <em>copy</em> of the Response object that has the appended header value.
    </div>
</div>

### Remove Header

You can remove a header with the Response object's `withoutHeader($name)` method.

<figure>
{% highlight php %}
$newResponse = $oldResponse->withoutHeader('Allow');
{% endhighlight %}
<figcaption>Figure 11: Remove HTTP header</figcaption>
</figure>

<div class="alert alert-info">
    <div><strong>Reminder</strong></div>
    <div>
        The Response object is immutable. This method returns a <em>copy</em>
        of the Response object that has the appended header value.
    </div>
</div>

## The Response Body

The Response object's body is a streamable object that implements the [\Psr\Http\Message\StreamableInterface](https://github.com/php-fig/fig-standards/blob/master/proposed/http-message.md#34-psrhttpmessagestreamableinterface) interface. This makes it possible to deliver content that may not otherwise fit into available system memory. By default, the Response object body opens a readable, writable, and seekable handle to `php://temp`. However, you can point the Response object's body to _any_ valid PHP resource handle. Think about that for a second. You can point the Response object's body to a local filesystem file, to a remote file hosted on Amazon S3, to a remote API, or to the output of a local system process.

### Get Body

You can get the Response object body with the `getBody()` method.

{% highlight php %}
<?php
$body = $response->getBody();
{% endhighlight %}

### Write Body

You can write to the Response object's body with the Response object's `write()` method. This method is a simple proxy to the Body object's `write()` method and is available as a convenience.

{% highlight php %}
<?php
$response->write('New content');
{% endhighlight %}

### Set Body

You can _replace_ the Response object's body with the Response object's `withBody()` method. Remember, the Response object is immutable. This method returns a new _copy_ of the Response object that uses the new Body. This method's argument MUST be an instance of `\Psr\Http\Message\StreamableInterface`.

{% highlight php %}
<?php
$newResponse = $oldResponse->withBody(
    new Body(fopen('s3://bucket/key', 'r'));
);
{% endhighlight %}
