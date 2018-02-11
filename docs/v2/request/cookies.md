### Get Cookies

A Slim application will automatically parse cookies sent with the current HTTP request. You can fetch cookie values
with the Slim application’s `getCookie()` helper method like this:

    <?php
    $app = new \Slim\Slim();
    $foo = $app->getCookie('foo');

Only Cookies sent with the current HTTP request are accessible with this method. If you set a cookie during the
current request, it will not be accessible with this method until the subsequent request. Bear in mind the \Slim\Slim
object's `getCookie()` method is a convenience. You may also retrieve the complete set of HTTP request cookies
directly from the \Slim\Http\Request object like this:

    <?php
    $cookies = $app->request->cookies;

This will return an instance of \Slim\Helper\Set so you can use its simple, standardized interface to inspect the
request's cookies.

### Cookie Encryption

You can optionally choose to encrypt all cookies stored on the HTTP client with the Slim app's `cookies.encrypt`
setting. When this setting is `true`, all cookies will be encrypted using your designated secret key and cipher.

It's really that easy. Cookies will be encrypted automatically before they are sent to the client. They will also
be decrypted on-demand when you request them with `\Slim\Slim::getCookie()` during subsequent requests.
