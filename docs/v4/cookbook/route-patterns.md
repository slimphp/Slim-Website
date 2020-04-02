---
title: Trailing / in route patterns
---

Slim treats a URL pattern with a trailing slash as different to one without. That is, `/user` and `/user/` are different and so can have different callbacks attached.

For GET requests a permanent redirect is fine, but for other request methods like POST or PUT the browser will send the second request with the GET method. To avoid this you simply need to remove the trailing slash and pass the manipulated url to the next middleware.

If you want to redirect/rewrite all URLs that end in a `/` to the non-trailing `/` equivalent, then you can add this middleware:

```php
<?php
use Psr\Http\Message\RequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface RequestHandler;
use Slim\Factory\AppFactory;
use Slim\Psr7\Response;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$app->add(function (Request $request, RequestHandler $handler) {
    $uri = $request->getUri();
    $path = $uri->getPath();
    
    if ($path != '/' && substr($path, -1) == '/') {
        // recursively remove slashes when its more than 1 slash
        $path = rtrim($path, '/');

        // permanently redirect paths with a trailing slash
        // to their non-trailing counterpart
        $uri = $uri->withPath($path);
        
        if ($request->getMethod() == 'GET') {
            $response = new Response();
            return $response
                ->withHeader('Location', (string) $uri)
                ->withStatus(301);
        } else {
            $request = $request->withUri($uri);
        }
    }

    return $handler->handle($request);
});
```

Alternatively, consider [middlewares/trailing-slash](//github.com/middlewares/trailing-slash) middleware which also allows you to force a trailing slash to be appended to all URLs:

```php
use Middlewares\TrailingSlash;

$app->add(new TrailingSlash(true)); // true adds the trailing slash (false removes it)
```
