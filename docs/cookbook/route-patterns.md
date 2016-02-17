---
title: Trailing / in route patterns
---

Slim treats a URL pattern with a trailing slash as different to one without. That is, `/user` and `/user/` are different and so can have different callbacks attached.

If you want to redirect all URLs that end in a `/` to the non-trailing `/` equivalent, then you can add this middleware:

{% highlight php %}
use Psr\Http\Message\RequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

$app->add(function (Request $request, Response $response, callable $next) {
    $uri = $request->getUri();
    $path = $uri->getPath();
    if ($path != '/' && substr($path, -1) == '/') {
        // permanently redirect paths with a trailing slash
        // to their non-trailing counterpart
        $uri = $uri->withPath(substr($path, 0, -1));
        return $response->withRedirect((string)$uri, 301);
    }

    return $next($request, $response);
});
{% endhighlight %}

Alternatively, consider [oscarotero/psr7-middlewares' TrailingSlash](//github.com/oscarotero/psr7-middlewares#trailingslash) middleware which also allows you to force a trailing slash to be appended to all URLs:

{% highlight php %}
use Psr7Middlewares\Middleware\TrailingSlash;

$app->add(new TrailingSlash(true)); // true adds the trailing slash (false removes it)
{% endhighlight %}
