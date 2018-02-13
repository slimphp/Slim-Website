Use the request object's `getBody()` method to fetch the raw HTTP request body sent by the HTTP client. This is
particularly useful for Slim application's that consume JSON or XML requests.

    <?php
    $app = new \Slim\Slim();
    $body = $app->request->getBody();
