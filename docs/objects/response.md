---
layout: default
title: Response
---

# The Response Object

The Response object encapsulates the HTTP response returned by the Slim application. You use the Response object to set the HTTP response status, headers, and body that are ultimately returned to the HTTP client.

The Response object is a _value object_, and it is immutable. You can never change a given Response object, but you can create a cloned Response object with new property values using any of the Response object's `with*()` methods.

Whereever you are within a Slim application (e.g. a middleware layer, a route callable, or a Not Found handler), you will be given the latest Request and Response objects.

## Response Status

The Response object has a numeric HTTP status code. The default status code is `200`. You can fetch the status code with the Response object's `getStatusCode()` method.

    <?php
    $status = $response->getStatusCode();

If you need to change a Response object's status code, you must request a new Response object that has the new status code with the Response object's `withStatus($code)` method.

    <?php
    $newResponse = $oldResponse->withStatus(404);

## Response Headers

The Response object manages a collection of headers that will be returned to the HTTP client. Each Response object provides the following methods to curate its collection of HTTP headers. Remember, the Response object is immutable, and you must use the appropriate `with*()` methods to fetch a _new_ Response object with modified headers.

### Get All Headers

You can fetch an associative array of HTTP response headers with the Response object's `getHeaders()` method. This returns an associative array whose keys are header names. The array's values are single dimensional arrays that contain one or more string values associated with each header name. This is an example data structure potentially returned by the Response object's `getHeaders()` method.

    [
        'Allow' => [
            'GET',
            'HEAD',
            'DELETE'
        ]
    ]

This example demonstrates how to fetch and iterate the Response object's headers.

    <?php
    // Iterate response headers
    foreach ($response->getHeaders() as $name => $values) {
        echo $name, PHP_EOL;
        foreach ($values as $value) {
            echo $value, PHP_EOL;
        }
    }

### Detect Header

You can detect the presence of an HTTP header with the Response object's `hasHeader($name)` method. This method returns `true` or `false`.

    <?php
    if ($response->hasHeader('Allow') === true) {
        // Do something
    }

### Get Header

You can fetch a single HTTP response header with the Response object's `getHeader($name)` method.

    <?php
    $headerValue = $response->getHeader('Allow');

This returns a string value. The returned string is a comma-concatenated string containing all values associated with the header name. For example, `$response->getHeader('Allow')` may return this string value:

    "GET,HEAD,DELETE"

Use the Response object's `getHeaderLines($name)` method to return the single-dimensional array associated with a given header name. 

    <?php
    $headerValue = $response->getHeaderLines('Allow');

This code may return this single-dimensional array:

    [
        'GET',
        'HEAD',
        'DELETE'
    ]

### Set Header

You can set a new header value with the Response object's `withHeader($name, $value)` method. Remember, the Response object is immutable. This method returns a new _copy_ of the Response object that has the new header value. **This method is destructive**, and it _replaces_ any existing header values that are associated with the same header name.

    <?php
    $newResponse = $oldResponse->withHeader(
        'Content-type',
        'application/json'
    );

### Add Header

You can add a new header value with the Response object's `withAddedHeader($name, $value)` method. Remember, the Response object is immutable. This method returns a new _copy_ of the Response object that has the added header value. **This method is non-destructive**, and it _appends_ the new header value to any existing header values that are `associated with the same header name.

    <?php
    $newResponse = $oldResponse->withAddedHeader(
        'Content-type',
        'application/json'
    );

### Remove Header

You can remove a header with the Response object's `withoutHeader($name)` method. Remember, the Response object is immutable. This method returns a new _copy_ of the Response object that does not have the specified header.

    <?php
    $newResponse = $oldResponse->withoutHeader('Allow');

## Response Cookies

The Response object manages a collection of cookies that will be serialized into the response header and returned to the HTTP client. Each Response object provides the following methods to curate its collection of HTTP cookies. Remember, the Response object is immutable, and you must use the appropriate `with*()` methods to fetch a _new_ Response object with modified cookies.

Unlike Response headers, Response cookies have a name that is associated with a fixed set of properties. Specifically, each Response cookie always has these exact properties:

value
:   A string.

expires
:   An integer unix timestamp, or a string to be converted with `strtotime()`.

path
:   Absolute URI path string beneath which the cookie is valid.

domain
:   Domain name string beneath which the cookie is valid.

secure
:   Is this cookie transmitted over HTTPS only?

httponly
:   Is this cookie transmitted via HTTP protocol only?

Fortunately, you don't have to define these settings every time you set a new cookie. Instead, you define the default cookie settings when you instantiate a Slim application. Then you simply pass the desired cookie value when you set a new Response cookie. Look for examples below.

### Get All Cookies

You can fetch an associative array of HTTP response cookies with the Response object's `getCookies()` method. This returns an associative array whose keys are cookie names. The array's values are single dimensional arrays that contain the properties listed above. This is an example data structure potentially returned by the Response object's `getCookies()` method.

    [
        'user' => [
            'value' => 'Bob',
            'expires' => '2 days',
            'path' => '/',
            'domain' => 'example.com',
            'secure' => true,
            'httponly' => true
        ]
    ]

### Detect Cookie

You can detect the presence of an HTTP cookie with the Response object's `hasCookie($name)` method. This method returns `true` or `false`.

    <?php
    if ($response->hasCookie('user') === true) {
        // Do something
    }

### Set Cookie

You can set a new cookie with the Response object's `withCookie($name, $value)` method. Remember, the Response object is immutable. This method returns a new _copy_ of the Response object that has the new cookie.

    <?php
    $newResponse = $oldResponse->withCookie('user', 'Bob');

This example creates a new cookie whose name is "user". The cookie's _value_ property is "Bob". Its other properties assume the default values provided during application instantiation. However, you _can_ override the default cookie properties by passing an associative array as the second argument to the `withCookie()` method. This array should contain only the properties different from the default cookie properties.

    <?php
    $newResponse = $oldResponse->withCookie('user', [
        'value' => 'Bob',
        'expires' => '7 days'
    ]);

### Remove Cookie

You can remove a cookie with the Response object's `withoutCookie($name)` method. Remember, the Response object is immutable. This method returns a new _copy_ of the Response object that does not have the specified cookie.

    <?php
    $newResponse = $oldResponse->withoutCookie('user');

Technically, this method _sets_ a new cookie whose value is empty and whose expiration date is in the past. This prompts the HTTP client to invalidate and destroy its local copy of the cookie.

## Response Body

The Response object's body is a streamable object that implements the [\Psr\Http\Message\StreamableInterface](https://github.com/php-fig/fig-standards/blob/master/proposed/http-message.md#34-psrhttpmessagestreamableinterface) interface. This makes it possible to deliver content that may not otherwise fit into available system memory. By default, the Response object body opens a readable, writable, and seekable handle to `php://temp`. However, you can point the Response object's body to _any_ valid PHP resource handle. Think about that for a second. You can point the Response object's body to a local filesystem file, to a remote file hosted on Amazon S3, to a remote API, or to the output of a local system process.

### Get Body

You can get the Response object body with the `getBody()` method.

    <?php
    $body = $response->getBody();

### Write Body

You can write to the Response object's body with the Response object's `write()` method. This method is a simple proxy to the Body object's `write()` method and is available as a convenience.

    <?php
    $response->write('New content');

### Set Body

You can _replace_ the Response object's body with the Response object's `withBody()` method. Remember, the Response object is immutable. This method returns a new _copy_ of the Response object that uses the new Body. This method's argument MUST be an instance of `\Psr\Http\Message\StreamableInterface`.

    <?php
    $newResponse = $oldResponse->withBody(
        new Body(fopen('s3://bucket/key', 'r'));
    );
