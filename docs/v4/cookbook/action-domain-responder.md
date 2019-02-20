---
title: Action-Domain-Responder with Slim
---

In this post, I'll show how to refactor the Slim tutorial application to more closely follow the [Action-Domain-Responder](http://pmjones.io/adr) pattern.

One nice thing about Slim (and most other [HTTP user interface frameworks](http://paul-m-jones.com/archives/6627)) is that they are already "action" oriented. That is, their routers do not presume a controller class with many action methods. Instead, they presume an action closure or a single-action invokable class.

So the Action part of Action-Domain-Responder already exists for Slim. All that is needed is to pull extraneous bits out of the Actions, to more clearly separate the Action behaviors from Domain and the Responder behaviors.

## Extract Domain

Let's begin by extracting the Domain logic. In the original tutorial, the Actions use two data-source mappers directly, and embed some business logic as well. We can create a Service Layer class called `TicketService` and move those operations from the Actions into the Domain. Doing so gives us this class:

```php
class TicketService
{
    protected $ticket_mapper;
    protected $component_mapper;

    public function __construct(
        TicketMapper $ticket_mapper,
        ComponentMapper $component_mapper
    ) {
        $this->ticket_mapper = $ticket_mapper;
        $this->component_mapper = $component_mapper;
    }

    public function getTickets()
    {
        return $this->ticket_mapper->getTickets();
    }

    public function getComponents()
    {
        return $this->component_mapper->getComponents();
    }

    public function getTicketById($ticket_id)
    {
        $ticket_id = (int) $ticket_id;
        return $this->ticket_mapper->getTicketById($ticket_id);
    }

    public function createTicket($data)
    {
        $component_id = (int) $data['component'];
        $component = $this->component_mapper->getComponentById($component_id);

        $ticket_data = [];
        $ticket_data['title'] = filter_var($data['title'], FILTER_SANITIZE_STRING);
        $ticket_data['description'] = filter_var($data['description'], FILTER_SANITIZE_STRING);
        $ticket_data['component'] = $component->getName();

        $ticket = new TicketEntity($ticket_data);
        $this->ticket_mapper->save($ticket);
        return $ticket;
    }
}
```

We create a container object for it in `index.php` like so:

```php
$container['ticket_service'] = function ($c) {
    return new TicketService(
        new TicketMapper($c['db']),
        new ComponentMapper($c['db'])
    );
};
```

And now the Actions can use the `TicketService` instead of performing domain logic directly:

```php
$app->get('/tickets', function (Request $request, Response $response) {
    $this->logger->addInfo("Ticket list");
    $tickets = $this->ticket_service->getTickets();
    $response = $this->view->render(
        $response,
        "tickets.phtml",
        ["tickets" => $tickets, "router" => $this->router]
    );
    return $response;
});

$app->get('/ticket/new', function (Request $request, Response $response) {
    $components = $this->ticket_service->getComponents();
    $response = $this->view->render(
        $response,
        "ticketadd.phtml",
        ["components" => $components]
    );
    return $response;
});

$app->post('/ticket/new', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $this->ticket_service->createTicket($data);
    $response = $response->withRedirect("/tickets");
    return $response;
});

$app->get('/ticket/{id}', function (Request $request, Response $response, $args) {
    $ticket = $this->ticket_service->getTicketById($args['id']);
    $response = $this->view->render(
        $response,
        "ticketdetail.phtml",
        ["ticket" => $ticket]
    );
    return $response;
})->setName('ticket-detail');
```

One benefit here is that we can now test the domain activities separately from the actions. We can begin to do something more like integration testing, even unit testing, instead of end-to-end system testing.

## Extract Responder

In the case of the tutorial application, the presentation work is so straightforward as to not require a separate Responder for each action. A relaxed variation of a Responder layer is perfectly suitable in this simple case, one where each Action uses a different method on a common Responder.

Extracting the presentation work to a separate Responder, so that response-building is completely removed from the Action, looks like this:

```php
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Views\PhpRenderer;

class TicketResponder
{
    protected $view;

    public function __construct(PhpRenderer $view)
    {
        $this->view = $view;
    }

    public function index(Response $response, array $data)
    {
        return $this->view->render(
            $response,
            "tickets.phtml",
            $data
        );
    }

    public function detail(Response $response, array $data)
    {
        return $this->view->render(
            $response,
            "ticketdetail.phtml",
            $data
        );
    }

    public function add(Response $response, array $data)
    {
        return $this->view->render(
            $response,
            "ticketadd.phtml",
            $data
        );
    }

    public function create(Response $response)
    {
        return $response->withRedirect("/tickets");
    }
}
```

We can then add the `TicketResponder` object to the container in `index.php`:

```php
$container['ticket_responder'] = function ($c) {
    return new TicketResponder($c['view']);
};
```

And finally we can refer to the Responder, instead of just the template system, in the Actions:

```php
$app->get('/tickets', function (Request $request, Response $response) {
    $this->logger->addInfo("Ticket list");
    $tickets = $this->ticket_service->getTickets();
    return $this->ticket_responder->index(
        $response,
        ["tickets" => $tickets, "router" => $this->router]
    );
});

$app->get('/ticket/new', function (Request $request, Response $response) {
    $components = $this->ticket_service->getComponents();
    return $this->ticket_responder->add(
        $response,
        ["components" => $components]
    );
});

$app->post('/ticket/new', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $this->ticket_service->createTicket($data);
    return $this->ticket_responder->create($response);
});

$app->get('/ticket/{id}', function (Request $request, Response $response, $args) {
    $ticket = $this->ticket_service->getTicketById($args['id']);
    return $this->ticket_responder->detail(
        $response,
        ["ticket" => $ticket]
    );
})->setName('ticket-detail');
```

Now we can test the response-building work separately from the domain work.

Some notes:

Putting all the response-building in a single class with multiple methods, especially for simple cases like this tutorial, is fine to start with. For ADR, is not strictly necessary to have one Responder for each Action. What *is* necessary is to extract the response-building concerns out of the Action.

But as the presentation logic complexity increases (content-type negotiation? status headers? etc.), and as dependencies become different for each kind of response being built, you will want to have a Responder for each Action.

Alternatively, you might stick with a single Responder, but reduce its interface to a single method. In that case, you may find that using a [Domain Payload](http://paul-m-jones.com/archives/6043) (instead of "naked" domain results) has some significant benefits.

## Conclusion

At this point, the Slim tutorial application has been converted to ADR. We have separated the domain logic to a `TicketService`, and the presentation logic to a `TicketResponder`. And it's easy to see how each Action does pretty much the same thing:

- Marshals input and passes it into the Domain
- Gets back a result from the Domain and passes it to the Responder
- Invokes the Responder so it can build and return the Response

Now, for a simple case like this, using ADR (or even webbishy MVC) might seem like overkill. But simple cases become complex quickly, and this simple case shows how the ADR separation-of-concerns can be applied as a Slim-based application increases in complexity.
