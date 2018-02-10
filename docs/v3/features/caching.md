---
title: HTTP Caching
---

Slim 3 uses the optional standalone [slimphp/Slim-HttpCache](https://github.com/slimphp/Slim-HttpCache) PHP component
for HTTP caching. You can use this component to create and return responses that
contain `Cache`, `Expires`, `ETag`, and `Last-Modified` headers that control
when and how long application output is retained by client-side caches. You may have to set your php.ini setting "session.cache_limiter" to an empty string in order to get this working without interferences.

## Installation

Execute this bash command from your project's root directory:

```bash
composer require slim/http-cache
```

## Usage

The `slimphp/Slim-HttpCache` component contains a service provider and an application
middleware. You should add both to your application like this:

```php
// Register service provider with the container
$container = new \Slim\Container;
$container['cache'] = function () {
    return new \Slim\HttpCache\CacheProvider();
};

// Add middleware to the application
$app = new \Slim\App($container);
$app->add(new \Slim\HttpCache\Cache('public', 86400));

// Create your application routes...

// Run application
$app->run();
```

## ETag

Use the service provider's `withEtag()` method to create a Response object
with the desired `ETag` header. This method accepts a PSR7 response object,
and it returns a cloned PSR7 response with the new HTTP header.

```php
$app->get('/foo', function ($req, $res, $args) {
    $resWithEtag = $this->cache->withEtag($res, 'abc');

    return $resWithEtag;
});
```

## Expires

Use the service provider's `withExpires()` method to create a Response object
with the desired `Expires` header. This method accepts a PSR7 response object,
and it returns a cloned PSR7 response with the new HTTP header.

```php
$app->get('/bar',function ($req, $res, $args) {
    $resWithExpires = $this->cache->withExpires($res, time() + 3600);

    return $resWithExpires;
});
```

## Last-Modified

Use the service provider's `withLastModified()` method to create a Response object
with the desired `Last-Modified` header. This method accepts a PSR7 response object,
and it returns a cloned PSR7 response with the new HTTP header.

```php
//Example route with LastModified
$app->get('/foobar',function ($req, $res, $args) {
    $resWithLastMod = $this->cache->withLastModified($res, time() - 3600);

    return $resWithLastMod;
});
```
