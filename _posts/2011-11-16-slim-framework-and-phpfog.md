---
title: How to run a Slim app on PHPFog
description: Learn how to run a Slim Framework application on PHP Fog
layout: post
---

Many Slim Framework users are turning to PHPFog — a leader among a growing field of PHP PaaS providers — to host their Slim Framework PHP web applications. By default, a Slim app will not run on PHPFog. Why not? PHPFog’s backend infrastructure relies on the nginx HTTP Proxy Module to communicate between backend tiers; the nginx HTTP Proxy Module speaks HTTP/1.0 while Slim speaks HTTP/1.1. Fear not, there’s an easy workaround. To run a Slim app on PHPFog, you must tell your Slim app to speak HTTP/1.0. You can do this when you instantiate your Slim app, like this:

{% highlight php %}
$app = new Slim(array(
    'http.version' => '1.0'
));
{% endhighlight %}

And that’s it. Slim will now run on PHPFog.
