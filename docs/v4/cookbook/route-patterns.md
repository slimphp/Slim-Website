---
title: Trailing / in route patterns
---

Slim treats a URL pattern with a trailing slash as different to one without. 
That is, `/user` and `/user/` are different and so can have different callbacks attached.

For GET requests a permanent redirect is fine, but for other request methods like POST or PUT the browser will send the second request with the GET method.
To avoid this you simply need to remove the trailing slash in the `Request` object and pass the manipulated url to the next middleware.

If you want to redirect/rewrite all URLs that end in a `/` to the non-trailing `/` equivalent, consider [middlewares/trailing-slash](//github.com/middlewares/trailing-slash) middleware.
Alternatively, the middlware also allows you to force a trailing slash to be appended to all URLs.

```php
use Middlewares\TrailingSlash;

$app->add(new TrailingSlash(trailingSlash: true)); // true adds the trailing slash (false removes it)
```
