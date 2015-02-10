---
title: Automatically parse an HTTP request by content type
description: Learn how to automatically parse an HTTP request body using Slim Framework middleware
layout: post
---

The Slim Framework for PHP 5 version 1.6.0 (currently in the develop branch) introduces new middleware that will automatically parse the HTTP request body based on its content type. This middleware will parse HTTP requests with a JSON, XML, or CSV content type. To enable this middleware, do this:

{% highlight php %}
$app = new Slim();
$app->add(new Slim_Middleware_ContentTypes());
{% endhighlight %}

After you add the Slim_Middleware_ContentTypes middleware to your Slim application, the Request object’s body property will be parsed appropriately. However, you may always fetch the raw, unparsed request body in the Slim application’s environment array with key `slim.input_original`.

## JSON Requests

This middleware will parse a JSON request’s body into an associative array. Imagine you send an HTTP request to the POST route below. The request body is `{"name":"John","email":"john.doe@gmail.com"}`.

{% highlight php %}
$app->post('/book', function () use ($app) {
    $body = $app->request()->getBody();
}
{% endhighlight %}

In this example, the $body variable will equal `array('name' => 'John', 'email' => 'john.doe@gmail.com')`.

## XML Requests

This middleware will parse a XML request’s body into a SimpleXMLElement instance if the SimpleXML extension is available; otherwise the body will remain a string. Imagine you send an HTTP request to the POST route above. The HTTP request body is:

{% highlight xml %}
<book>
    <id>1</id>
    <title>Sahara</title>
    <author>Clive Cussler</author>
</book>
{% endhighlight %}

The `$body` variable will be an instance of SimpleXMLElement; you can fetch the POSTed book properties with `$body->id`, `$body->title`, or `$body->author`.

## CSV Requests

This middleware will parse a CSV request’s body into an array or arrays. Imagine you send an HTTP request to the POST route above. The HTTP request body is:

{% highlight text %}
Doe,John,john.doe@gmail.com
Doe,Jane,jane.doe@gmail.com
{% endhighlight %}

The `$body` variable will be this array:

{% highlight php %}
array(
    array('Doe','John','john.doe@gmail.com'),
    array('Doe','Jane','jane.doe@gmail.com')
);
{% endhighlight %}

## Custom Content Types

If you want to parse an HTTP request body that is not JSON, XML, or CSV you can provide your own parsing functions to this middleware using its optional second argument. You’ll need to know the content type of the incoming HTTP request, and you’ll need to prepare a callable item to parse the request body. The callable item that will parse the HTTP request body should accept a string argument and return the appropriate PHP data structure.

Imagine we want the POST route above to accept an HTTP request with an HTML body. We tell our Slim_Middleware_ContentTypes middleware to parse these requests like this:

{% highlight php %}
function parseHtml( $rawBody ) {
    $dom = new DOMDocument();
    $dom->loadHTML($rawBody);
    return $dom;
};
$app = new Slim();
$app->add(new Slim_Middleware_ContentTypes(array(
    'text/html' => 'parseHtml'
)));
{% endhighlight %}

Assuming we continue using the POST route defined above, the `$body` variable will become a DOMDocument instance representative of the HTML provided in the HTTP request body. The custom parsing function you define will be merged with the default parsing functions (keyed by content-type). In this example, the Slim_Middleware_ContentTypes middleware will now parse HTTP requests that have a JSON, XML, CSV, or HTML content type.

If you want to override the default parsing function for JSON requests, define a new parser for content type `application/json`; your own parser will then be used instead of the default parser.
