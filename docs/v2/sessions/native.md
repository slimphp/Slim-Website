A Slim application does not presume anything about sessions. If you prefer to use a PHP session, you must configure
and start a native PHP session with `session_start()` before you instantiate the Slim application.

You should also disable PHP’s session cache limiter so that PHP does not send conflicting cache expiration headers
with the HTTP response. You can disable PHP’s session cache limiter with:

    <?php
    session_cache_limiter(false);
    session_start();
