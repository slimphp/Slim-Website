Slim lets you group related routes. This is helpful when you find yourself repeating the same URL segments
for multiple routes. This is best explained with an example. Let's pretend we are building an API for
books.

    <?php
    $app = new \Slim\Slim();

    // API group
    $app->group('/api', function () use ($app) {

        // Library group
        $app->group('/library', function () use ($app) {

            // Get book with ID
            $app->get('/books/:id', function ($id) {

            });

            // Update book with ID
            $app->put('/books/:id', function ($id) {

            });

            // Delete book with ID
            $app->delete('/books/:id', function ($id) {

            });

        });

    });

The routes defined above would be accessible at, respectively:

    GET    /api/library/books/:id
    PUT    /api/library/books/:id
    DELETE /api/library/books/:id

Route groups are very useful to group related routes and avoid repeating common URL segments
for each route definition.
