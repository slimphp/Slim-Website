You can use the Slim application’s `render()` method to ask the current view object to render a template with a
given set of variables. The Slim application's `render()` method will `echo()` the output returned from the view
object to be captured by an output buffer and appended automatically to the response object’s body. This assumes
nothing about how the template is rendered; that is delegated to the view object.

    <?php
    $app = new \Slim\Slim();
    $app->get('/books/:id', function ($id) use ($app) {
        $app->render('myTemplate.php', array('id' => $id));
    });

If you need to pass data from the route callback into the view object, you must explicitly do so by passing an
array as the second argument of the Slim application’s `render()` method like this:

    <?php
    $app->render(
        'myTemplate.php',
        array( 'name' => 'Josh' )
    );

You can also set the HTTP response status when you render a template:

    <?php
    $app->render(
        'myTemplate.php',
        array( 'name' => 'Josh' ),
        404
    );
