A Slim application will automatically parse all HTTP request headers. You can access the request headers using the
request object's public `headers` property. The `headers` property is an instance of `\Slim\Helper\Set`, meaning
it provides a simple, standardized interface to interactive with the HTTP request headers.

    <?php
    $app = new \Slim\Slim();

    // Get request headers as associative array
    $headers = $app->request->headers;

    // Get the ACCEPT_CHARSET header
    $charset = $app->request->headers->get('ACCEPT_CHARSET');

The HTTP specification states that HTTP header names may be uppercase, lowercase, or mixed-case. Slim is smart enough
to parse and return header values whether you request a header value using upper, lower, or mixed case header name,
with either underscores or dashes. So use the naming convention with which you are most comfortable.
