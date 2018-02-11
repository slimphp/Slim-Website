<div class="alert alert-info">
    <strong>Heads Up!</strong> Flash messages require sessions. If you do not use the
    <code>\Slim\Middleware\SessionCookie</code> middleware, you must start a native PHP session yourself.
</div>

Slim supports flash messaging much like Rails and other larger web frameworks. Flash messaging allows you to define
messages that will persist until the next HTTP request but no further. This is helpful to display messages to the user
after a given event or error occurs.

As shown below, the Slim application’s `flash()` and `flashNow()` methods accept two arguments: a key and a message.
The key may be whatever you want and defines how the message will be accessed in the view templates. For example,
if I invoke the Slim application’s `flash('foo', 'The foo message')` method with those arguments, I can access that
message in the next request’s templates with `flash['foo']`.

Flash messages are persisted with sessions; sessions are required for flash messages to work. Flash messages are
stored in `$_SESSION['slim.flash']`.
