---
title: Action-Domain-Responder com Slim
---

Nesta postagem, vou mostrar como refatorar o aplicativo tutorial Slim para seguir mais de perto o padrão [Action-Domain-Responder] (http://pmjones.io/adr).

Uma coisa agradável sobre o Slim (e a maioria das outras [estruturas de interface do usuário HTTP] (http://paul-m-jones.com/archives/6627)) é que eles já estão orientados a "ação". Ou seja, seus roteadores não presumem uma classe de controlador com muitos métodos de ação. Em vez disso, eles presumem um fechamento de ação ou uma classe invocável de ação única.

Então, a parte Ação do Action-Domain-Responder já existe para o Slim. Tudo o que é necessário é extrair os bits estranhos das Ações, para separar mais claramente os comportamentos de Ação do domínio e os comportamentos do Respondente.

## Extrair o domínio

Comecemos por extrair a lógica do domínio. No tutorial original, as Ações usam dois mapeadores de fonte de dados diretamente e também incorporam alguma lógica de negócios. Podemos criar uma classe Service Layer chamada `TicketService` e mover essas operações das Ações para o domínio. Isso nos dá essa classe:

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

Criamos um objeto contêiner para ele em `index.php` assim:

```php
$container['ticket_service'] = function ($c) {
    return new TicketService(
        new TicketMapper($c['db']),
        new ComponentMapper($c['db'])
    );
};
```

E agora as Ações podem usar o `TicketService` em vez de executar a lógica do domínio diretamente:

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

Um benefício aqui é que agora podemos testar as atividades do domínio separadamente das ações. Podemos começar a fazer algo mais como testes de integração, mesmo teste de unidade, em vez de testes de sistema de ponta a ponta.

## Respondedor Extraído

No caso do aplicativo tutorial, o trabalho de apresentação é tão simples como não exigir um Respondente separado para cada ação. Uma variação relaxada de uma camada de Respondente é perfeitamente adequada neste caso simples, um em que cada ação usa um método diferente em um respondedor comum.

Extraindo o trabalho de apresentação para um Respondente separado, para que a criação de respostas seja completamente removida da Ação, parece assim:

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

Podemos então adicionar o objeto `TicketResponder` ao contêiner em `index.php`:

```php
$container['ticket_responder'] = function ($c) {
    return new TicketResponder($c['view']);
};
```

E, finalmente, podemos nos referir ao Respondente, em vez de apenas o sistema de modelo, nas Ações:

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

Agora, podemos testar o trabalho de construção de respostas separadamente do trabalho de domínio.

Algumas notas:

Colocar todo o processo de resposta em uma única classe com vários métodos, especialmente para casos simples, como esse tutorial, é bom para começar. Para ADR, não é estritamente necessário ter um respondedor para cada ação. O que * é * necessário é extrair as preocupações de construção de resposta fora da Ação.

Mas à medida que a complexidade da lógica de apresentação aumenta (negociação de tipo de conteúdo, cabeçalhos de status, etc.) e, à medida que as dependências se tornam diferentes para cada tipo de resposta a ser construída, você terá um Respondente para cada ação.

Alternativamente, você pode ficar com um único Respondente, mas reduzir sua interface para um único método. Nesse caso, você pode achar que usar um [Payload do domínio] (http://paul-m-jones.com/archives/6043) (em vez de resultados de domínio "nus") tem alguns benefícios significativos.

## Conclusão

Neste ponto, o aplicativo tutorial Slim foi convertido em ADR. Separamos a lógica de domínio para um `TicketService` e a lógica de apresentação para um` TicketResponder`. E é fácil ver como cada ação faz praticamente a mesma coisa:

- Os marechais entram e passam para o Domínio
- Retorna um resultado do Domínio e passa para o Respondedor
- Invoca o Respondente para que ele possa construir e retornar a Resposta

Agora, por um caso simples como este, o uso de ADR (ou mesmo MVC webbishy) pode parecer um exagero. Mas os casos simples tornam-se complexos rapidamente, e esse caso simples mostra como a separação de preocupações de ADR pode ser aplicada à medida que um aplicativo baseado em Slim aumenta de complexidade.