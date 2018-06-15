---
title: Getting and Mocking the Environment
---

The Environment object encapsulates the `$_SERVER` superglobal array and decouples the Slim application from the PHP global environment. Decoupling the Slim application from the PHP global environment lets us create HTTP requests that may (or may not) resemble the global environment. This is particuarly useful for unit testing and initiating sub-requests. You can fetch the current Environment object anywhere in your Slim application like this:

```php
$container = $app->getContainer();
$environment = $container['environment'];
```

## Environment Properties

Each Slim application has an Environment object with various properties that determine application behavior. Many of these properties mirror those found in the `$_SERVER` superglobal array. Some properties are required. Other properties are optional.

### Required Properties

REQUEST_METHOD
:   The HTTP request method. This must be one of "GET", "POST", "PUT", "DELETE", "HEAD", "PATCH", or "OPTIONS".

SCRIPT_NAME
:   The absolute path name to the front-controller PHP script relative to your document root, disregarding any URL rewriting performed by your web server.

REQUEST_URI
:   The absolute path name of the HTTP request URI, including any URL rewriting changes performed by your web server.

QUERY_STRING
:   The part of the HTTP request’s URI path after, but not including, the “?”. This may be an empty string if the current HTTP request does not specify a query string.

SERVER_NAME
:   The name of the server host under which the current script is executing. If the script is running on a virtual host, this will be the value defined for that virtual host.

SERVER_PORT
:   The port on the server machine being used by the web server for communication. For default setups, this will be '80'; using SSL, for instance, will change this to whatever your defined secure HTTP port is.

HTTPS
:   Set to a non-empty value if the script was queried through the HTTPS protocol.

### Optional Properties

CONTENT_TYPE
:   The HTTP request content type (e.g., `application/json;charset=utf8`)

CONTENT_LENGTH
:   The HTTP request content length. This must be an integer if present.

HTTP_*
:   The HTTP request headers sent by the client. These values are identical to their counterparts in the `$_SERVER` superglobal array. If present, these values must retain the "HTTP_" prefix.

PHP_AUTH_USER
:   The HTTP `Authentication` header's decoded username.

PHP_AUTH_PW
:   The HTTP `Authentication` header's decoded password.

PHP_AUTH_DIGEST
:   The raw HTTP `Authentication` header as sent by the HTTP client.

AUTH_TYPE
:   The HTTP `Authentication` header's authentication type (e.g., "Basic" or "Digest").

slim.files
:   array of implements `\Psr\Http\Message\UploadedFileInterface` 
    (for example, native Slim Framework `\Slim\Http\UploadedFile`)

## Mock Environments

Each Slim application instantiates an Environment object using information from the current global environment. However, you may also create mock environment objects with custom information. Mock Environment objects are only useful when writing unit tests.

```php
$env = \Slim\Http\Environment::mock([
    'REQUEST_METHOD' => 'POST',
    'REQUEST_URI' => '/foo/bar',
    'QUERY_STRING' => 'abc=123&foo=bar',
    'SERVER_NAME' => 'example.com',
    'CONTENT_TYPE' => 'multipart/form-data',
    'slim.files' => [
        'field1' => new UploadedFile('/path/to/file1', 'filename1.txt', 'text/plain', filesize('/path/to/file1')),
        'field2' => new UploadedFile('/path/to/file2', 'filename2.txt', 'text/plain', filesize('/path/to/file2')),
    ],
]);
```
