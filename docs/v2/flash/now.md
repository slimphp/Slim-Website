The Slim application’s `flashNow()` method sets a message that will be available in the current request’s view
templates. Messages set with the `flashNow()` application instance method will not be available in the next request.
The message in the example below will be available in the template variable `flash['info']`.

    <?php
    $app->flashNow('info', 'Your credit card is expired');
