---
title: HTTP Caching
---

In version 3 of Slim the HTTP Caching function has been moved out of core into its own respository here.  ( https://github.com/slimphp/Slim-HttpCache )

You can get it by this composer magic.

`composer require slim/http-cache`


#Usage

{% highlight php %}
$app = new \Slim\App();

// Register middleware
$app->add(new \Slim\HttpCache\Cache('public', 86400));

// Fetch DI Container
$container = $app->getContainer();

// Register service provider
$container->register(new \Slim\HttpCache\CacheProvider);

// Example route with ETag header
$app->get('/foo', function ($req, $res, $args) {
    $resWithEtag = $this['cache']->withEtag($res, 'abc');

    return $resWithEtag;
});

//Example route with ExpiresHeader
$app->get('/bar',function ($req, $res, $args) {
    $resWithExpires = $this['cache']->withExpires($res, time() + 3600); // 1 hr

    return $resWithExpires;
});


//Example route with LastModified
$app->get('/foobar',function ($req, $res, $args) {
    $resWithLastMod = $this['cache']->withLastModified($res, time() - 3600); // 1 hr ago

    return $resWithLastMod;
});

$app->run();

{% endhighlight %}
