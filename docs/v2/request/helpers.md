The Slim application's request object provides several helper methods to fetch common HTTP request information:

### Content Type

Fetch the request's content type (e.g. "application/json;charset=utf-8"):

    <?php
    $req = $app->request;
    $req->getContentType();

### Media Type

Fetch the request's media type (e.g. "application/json"):

    <?php
    $req = $app->request;
    $req->getMediaType();

### Media Type Params

Fetch the request's media type parameters (e.g. [charset => "utf-8"]):

    <?php
    $req = $app->request;
    $req->getMediaTypeParams();

### Content Charset

Fetch the request's content character set (e.g. "utf-8"):

    <?php
    $req = $app->request;
    $req->getContentCharset();

### Content Length

Fetch the request's content length:

    <?php
    $req = $app->request;
    $req->getContentLength();

### Host

Fetch the request's host (e.g. "slimframework.com"):

    <?php
    $req = $app->request;
    $req->getHost();

### Host with Port

Fetch the request's host with port (e.g. "slimframework.com:80"):

    <?php
    $req = $app->request;
    $req->getHostWithPort();

### Port

Fetch the request's port (e.g. 80):

    <?php
    $req = $app->request;
    $req->getPort();

### Scheme

Fetch the request's scheme (e.g. "http" or "https"):

    <?php
    $req = $app->request;
    $req->getScheme();

### Path

Fetch the request's path (root URI + resource URI):

    <?php
    $req = $app->request;
    $req->getPath();

### URL

Fetch the request's URL (scheme + host [ + port if non-standard ]):

    <?php
    $req = $app->request;
    $req->getUrl();

### IP Address

Fetch the request's IP address:

    <?php
    $req = $app->request;
    $req->getIp();

### Referer

Fetch the request's referrer:

    <?php
    $req = $app->request;
    $req->getReferrer();

### User Agent

Fetch the request's user agent string:

    <?php
    $req = $app->request;
    $req->getUserAgent();
