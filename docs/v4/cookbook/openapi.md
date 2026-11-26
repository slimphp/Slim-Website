---
title: Documenting routes with OpenAPI
---

This cookbook entry describes how to generate an [OpenAPI](https://www.openapis.org/) document for a Slim 4 application from its routes, using [swagger-php](https://github.com/zircote/swagger-php) with the [openapi-introspector](https://github.com/DerManoMann/openapi-introspector) plugin.

Every route ends up in the document with its path parameters. Where a route points to a controller method, the summary and description come from that method's docblock. swagger-php attributes on the method then add to the inferred operation: query parameters, headers, request bodies and responses.

## Adding the packages

```bash
composer require zircote/swagger-php radebatz/openapi-introspector
```

## A title and a version

The OpenAPI document needs a title and a version. They are not about any route, so they go into a hand-written `openapi-base.yaml` in the project root, which swagger-php uses as the base of the document:

<figure markdown="1">
```yaml
# openapi-base.yaml

openapi: 3.1.0
info:
  title: Tickets
  version: 1.0.0
```
<figcaption>Figure 1: The base of the document.</figcaption>
</figure>

Anything else that applies to the whole API, such as `servers` or the security schemes, can go into the same file.

## Serving the document

A route can build the document and return it. It passes the application's routes to the plugin, leaving itself out, so the document does not describe its own route:

<figure markdown="1">
```php
<?php

// public/index.php

use OpenApi\Builder;
use Radebatz\OpenApi\Introspector\RoutesPlugin;
use Radebatz\OpenApi\Introspector\Routing\Slim\SlimAdapter;
use Slim\Interfaces\RouteInterface;

// ...

$app->get('/openapi.yaml', function ($request, $response) use ($app) {
    $routes = array_filter(
        $app->getRouteCollector()->getRoutes(),
        fn (RouteInterface $route) => $route->getPattern() !== '/openapi.yaml',
    );

    $openapi = (new Builder())
        ->withDocument(__DIR__ . '/../openapi-base.yaml')
        ->addSource(__DIR__ . '/../src')
        ->withPlugins([new RoutesPlugin(new SlimAdapter($routes))])
        ->build();

    $response->getBody()->write($openapi->toYaml());

    return $response->withHeader('Content-Type', 'application/yaml');
});
```
<figcaption>Figure 2: A route serving the document.</figcaption>
</figure>

[Swagger UI](https://swagger.io/tools/swagger-ui/) or [Redoc](https://github.com/Redocly/redoc) can then be pointed at `/openapi.yaml`.

## What it generates

With these routes:

<figure markdown="1">
```php
<?php

// public/index.php

use App\Controller\TicketController;

// ...

$app->get('/tickets', [TicketController::class, 'list']);
$app->get('/tickets/{id:[0-9]+}', [TicketController::class, 'show']);
```
<figcaption>Figure 3: The routes.</figcaption>
</figure>

and this controller:

<figure markdown="1">
```php
<?php

// src/Controller/TicketController.php

namespace App\Controller;

use OpenApi\Spec as OA;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class TicketController
{
    /**
     * List tickets.
     *
     * All open tickets, newest first.
     */
    #[OA\Parameter\Query(
        name: 'status',
        description: 'Only tickets with this status',
        schema: new OA\Schema(type: 'string'),
    )]
    #[OA\Parameter\Header(
        name: 'X-Request-Id',
        description: 'Echoed back for tracing',
        schema: new OA\Schema(type: 'string'),
    )]
    public function list(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        // ...
    }

    /**
     * Show a ticket.
     */
    #[OA\Parameter\Query(
        name: 'expand',
        description: 'Include the comments',
        schema: new OA\Schema(type: 'boolean'),
    )]
    #[OA\Response(response: 200, description: 'The ticket')]
    #[OA\Response(response: 404, description: 'No ticket with this id')]
    public function show(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        // ...
    }
}
```
<figcaption>Figure 4: The controller, with docblocks and attributes.</figcaption>
</figure>

the OpenAPI document is:

<figure markdown="1">
```yaml
openapi: 3.1.0
info:
  title: Tickets
  version: 1.0.0
paths:
  /tickets:
    get:
      summary: 'List tickets.'
      description: 'All open tickets, newest first.'
      operationId: e6ea07526323250e5ce17aa232661ab9
      parameters:
        -
          name: status
          in: query
          description: 'Only tickets with this status'
          schema:
            type: string
        -
          name: X-Request-Id
          in: header
          description: 'Echoed back for tracing'
          schema:
            type: string
  '/tickets/{id}':
    get:
      summary: 'Show a ticket.'
      operationId: 7f3427d5747c221115142fa10c0e26b4
      parameters:
        -
          name: expand
          in: query
          description: 'Include the comments'
          schema:
            type: boolean
        -
          name: id
          in: path
          required: true
          schema:
            type: integer
            pattern: '[0-9]+'
      responses:
        '200':
          description: 'The ticket'
        '404':
          description: 'No ticket with this id'
```
<figcaption>Figure 5: The generated document.</figcaption>
</figure>

The `id` parameter and its type come from the route pattern, and the summaries and the description from the docblocks. The attributes add the query parameters, the header and the responses to what the route gives.

## In production

Building the document on every request is fine while developing. For production it can be built once at deploy time, by a script that sets up the application's routes and calls `->saveAs('public/openapi.yaml')` in place of `->toYaml()`, and then served as a static file.

## Other resources

- The [swagger-php documentation](https://zircote.github.io/swagger-php/), with [base documents](https://zircote.github.io/swagger-php/reference/builder.html#documents) in its `Builder` reference.
- The [openapi-introspector routes documentation](https://github.com/DerManoMann/openapi-introspector/blob/main/docs/routes.md), with what a Slim route contributes.
