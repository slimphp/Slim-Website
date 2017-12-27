---
title: Primeiro passo a passo da aplicação
---

Se você está procurando um passeio através de todos os ingredientes para configurar um aplicativo Slim muito simples (este não usa Twig, mas usa Monolog e uma conexão de banco de dados PDO), então você está no lugar certo. Ou passeie pelo tutorial para criar o exemplo de aplicação, ou adapte cada passo para suas próprias necessidades.

Antes de começar: Há também um [projeto de esqueleto] (https://github.com/slimphp/Slim-Skeleton) que lhe dará um início rápido para um aplicativo de exemplo, então use isso se preferir apenas algo funcionando em vez de explorar como funcionam todas as partes móveis.

> Este tutorial atravessa a construção de um exemplo de aplicação. O [código para o aplicativo está disponível] (https://github.com/slimphp/Tutorial-First-Application) se você quiser se referir a ele.

## Como configurar

Comece fazendo uma pasta para o seu projeto (o meu é chamado de `projeto ', porque nomear coisas é difícil). Eu gosto de reservar o nível superior para coisas-que-são-não-código e, em seguida, tenho uma pasta para código-fonte e uma pasta dentro daquilo que é o meu webroot, então minha estrutura inicial parece assim:
```
.
├── project
│   └── src
│       └── public
```

### Instalando o Slim Framework

[Composer] (https://getcomposer.org) é a melhor maneira de instalar o Slim Framework. Se você não tiver já, você pode seguir as [instruções de instalação] (https://getcomposer.org/download/), no meu projeto acabei de baixar o `composer.phar` no meu `src/` diretório e eu vou usá-lo localmente. Então, meu primeiro comando parece assim (estou no diretório `src/`):
    php composer.phar require slim/slim

Isso faz duas coisas:

* Adicione a dependência do Slim Framework ao `composer.json` (no meu caso, ele cria o arquivo para mim, já que eu não tenho um, é seguro executar isso se você já possui um arquivo` composer.json`)
* Execute o `composer install` para que essas dependências estejam realmente disponíveis para usar em seu aplicativo

Se você olha dentro do diretório do projeto agora, verá que você possui uma pasta `vendor/` com todo o código da biblioteca nele. Existem também dois novos arquivos: `composer.json` e` composer.lock`. Este seria um ótimo momento para configurar nossa configuração de controle de origem também: ao trabalhar com o compositor, sempre excluímos o diretório `vendor/`, mas ambos `composer.json` e` composer.lock` devem ser incluídos no controle de origem . Uma vez que estou usando `composer.phar` neste diretório, vou incluí-lo no meu retomado também; Você poderia igualmente instalar o comando `composer` em todos os sistemas que precisam dele.

Para configurar o git ignorar corretamente, crie um arquivo chamado `src/.gitignore` e adicione a seguinte linha única ao arquivo:
    vendor/*


Agora, o git não solicitará que você adicione os arquivos em `vendor /` ao repositório - não queremos fazer isso porque estamos deixando o compositor gerenciar essas dependências em vez de incluí-las em nosso repositório de controle de origem.

### Criar a aplicação

Existe um exemplo realmente excelente e mínimo de um `index.php` para o Slim Framework na [homepage do projeto] (http://www.slimframework.com) para que usemos isso como nosso ponto de partida. Coloque o seguinte código em `src / public / index.php`:
```php
<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require '../vendor/autoload.php';

$app = new \Slim\App;
$app->get('/hello/{name}', function (Request $request, Response $response) {
    $name = $request->getAttribute('name');
    $response->getBody()->write("Hello, $name");

    return $response;
});
$app->run();

```

Nós apenas colamos um monte de código ... vamos dar uma olhada no que faz.

As instruções `use` na parte superior do script estão apenas trazendo as classes` Request` e `Response` para o nosso script, então não temos que nos referir a eles por seus nomes longos. Slim framework suporta o PSR-7, que é o padrão PHP para mensagens HTTP, então você notará como você constrói seu aplicativo que os objetos `Request` e` Response` são algo que você vê com freqüência. Esta é uma abordagem moderna e excelente para escrever aplicativos da web.

Em seguida, incluímos o arquivo `vendor/autoload.php` - isso é criado pelo Composer e nos permite consultar o Slim e outras dependências relacionadas que instalamos anteriormente. Tenha em atenção que, se você estiver usando a mesma estrutura de arquivos que eu, o diretório `vendor/` é um nível acima do seu `index.php` e talvez seja necessário ajustar o caminho como fiz acima.

Finalmente, criamos o objeto `$app` que é o início do Slim. A chamada `$app->get()` é nossa primeira "rota" - quando fazemos uma solicitação GET para `/hello/someone`, então esse é o código que irá responder a ela. ** Não esqueça ** você precisa da linha final `$app->run()` para dizer ao Slim que acabamos de configurar e é hora de continuar com o evento principal.

Agora temos um aplicativo, nós precisaremos executá-lo. Eu abordarei duas opções: o servidor web PHP integrado e uma configuração de host virtual do Apache.

### Execute sua aplicação com o servidor Web do PHP

Esta é a minha opção preferida de "início rápido" porque não confia em mais nada! No diretório `src / public`, execute o comando:
    php -S localhost:8080

Isso fará com que seu aplicativo esteja disponível em http: //localhost:8080 (se você já estiver usando a porta 8080 em sua máquina, você receberá um aviso. Apenas escolha um número de porta diferente, o PHP não se importa com o que você liga para).

** Nota ** você receberá uma mensagem de erro sobre "Página não encontrada" neste URL - mas é uma mensagem de erro ** de ** Slim, então isso é esperado. Tente http: //localhost:8080/hello/joebloggs em vez disso :)

### Execute sua aplicação com o Apache ou o nginx

Para obter esta configuração em uma pilha LAMP padrão, precisaremos de alguns ingredientes extras: alguma configuração de host virtual e uma regra de reescrita.

A configuração mais rápida deve ser bastante direta; não precisamos de nada especial aqui. Copie sua configuração de vhost padrão existente e configure o `ServerName` para ser como você deseja se referir ao seu projeto. Por exemplo, você pode definir:
    ServerName slimproject.dev

    or for nginx:

    server_name slimproject.dev;

Então você também deseja configurar o `DocumentRoot` para apontar para o diretório` public/ `do seu projeto, algo assim (edite a linha existente):
    DocumentRoot    /home/lorna/projects/slim/project/src/public/

    ou para nginx:

    root    /home/lorna/projects/slim/project/src/public/


** Não esqueça ** para reiniciar seu processo de servidor agora você mudou a configuração!

Eu também tenho um arquivo `.htaccess` no meu diretório` src/public`; Isso depende do módulo de reescrita do Apache sendo habilitado e simplesmente faz todos os pedidos da web ir para index.php para que Slim possa lidar com todo o roteamento para nós. Aqui está o arquivo `.htaccess`:
```
RewriteEngine on
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule . index.php [L]
```

O nginx não usa os arquivos `.htaccess`, então você precisará adicionar o seguinte à configuração do servidor no bloco` location`:
```
if (!-e $request_filename){
    rewrite ^(.*)$ /index.php break;
}
```

* NOTA: * Se você deseja que seu ponto de entrada seja algo diferente de index.php, você também precisará sua configuração para mudar. `api.php` também é comumente usado como um ponto de entrada, então sua configuração deve corresponder de acordo. Este exemplo assume que você está usando index.php.

Com esta configuração, lembre-se de usar http://slimproject.dev em vez de http: // localhost: 8080 nos outros exemplos neste tutorial. O mesmo aviso de saúde acima é aplicável: você verá uma página de erro em http://slimproject.dev, mas crucial é a página de erro * Slim *. Se você for http://slimproject.dev/hello/joebloggs, então algo melhor deve acontecer.

## Configuração e Autoloaders

Agora nós configuramos a plataforma, podemos começar a obter tudo o que precisamos no lugar na própria aplicação.

### Adicionar configurações de configuração à sua aplicação

O exemplo inicial usa todos os padrões Slim, mas podemos adicionar facilmente configuração ao nosso aplicativo quando o criamos. Existem algumas opções, mas aqui eu acabei de criar uma série de opções de configuração e depois disse a Slim para tomar suas configurações a partir daqui quando eu criá-la.

Primeiro, a própria configuração:

```php
$config['displayErrorDetails'] = true;
$config['addContentLengthHeader'] = false;

$config['db']['host']   = 'localhost';
$config['db']['user']   = 'user';
$config['db']['pass']   = 'password';
$config['db']['dbname'] = 'exampleapp';
```

A primeira linha é a mais importante! Vire isso no modo de desenvolvimento para obter informações sobre erros (sem ele, o Slim irá, pelo menos, registrar erros, então, se você estiver usando o servidor web incorporado no PHP, você os verá na saída do console, que é útil). A segunda linha permite que o servidor da Web configure o cabeçalho Content-Length que faz com que Slim se comporte mais previsivelmente.

As outras configurações aqui não são chaves/valores específicos, são apenas alguns dados que eu quero poder acessar mais tarde.

Agora, para alimentar isso em Slim, precisamos * mudar * onde criamos o objeto `Slim/App` para que ele agora se pareça com isto:
```php
$app = new \Slim\App(['settings' => $config]);
```

Poderemos acessar todas as configurações que colocamos na matriz `$ config` do nosso aplicativo mais tarde.

## Configurar autoloading para suas próprias classes

O compositor pode lidar com o carregamento automático de suas próprias classes, assim como os vendidos. Para obter um guia detalhado, veja [usando o Composer para gerenciar as regras de autoloading] (https://getcomposer.org/doc/04-schema.md#autoload).

Minha configuração é bastante simples, já que eu só tenho algumas classes extras, elas estão apenas no espaço para nome global e os arquivos estão no diretório `src/classes/`. Então, para autoload, eu adiciono esta seção 'autoload` ao meu arquivo `composer.json`:

```javascript
{
    "require": {
        "slim/slim": "^3.1",
        "slim/php-view": "^2.0",
        "monolog/monolog": "^1.17",
        "robmorgan/phinx": "^0.5.1"
    },
    "autoload": {
        "psr-4": {
            "": "classes/"
        }
    }
}
```

## Adicionar Dependências

A maioria dos aplicativos terá algumas dependências, e Slim os controla bem usando um DIC (Dependency Injection Container) criado em [Pimple] (http://pimple.sensiolabs.org/). Este exemplo usará a conexão [Monolog] (https://github.com/Seldaek/monolog) e [PDO] (http://php.net/manual/en/book.pdo.php) para o MySQL.

A idéia do recipiente de injeção de dependência é que você configura o recipiente para poder carregar as dependências que seu aplicativo precisa, quando ele precisar deles. Uma vez que a DIC criou/montou as dependências, as armazena e pode fornecê-las novamente mais tarde, se necessário.

Para obter o contêiner, podemos adicionar o seguinte após a linha onde criamos `$app` e antes de começar a registrar as rotas em nosso aplicativo:

```php
$container = $app->getContainer();
```

Agora temos o objeto `Slim\Container`, podemos adicionar nossos serviços a ele.

### Use Monolog em sua aplicação

Se você ainda não está familiarizado com o Monolog, é uma excelente estrutura de log para aplicativos PHP, e é por isso que vou usá-lo aqui. Antes de tudo, obtenha a biblioteca Monolog instalada via compositor:
    
	php composer.phar require monolog/monolog

A dependência é denominada `logger` e o código para adicionar isso parece assim:

```php
$container['logger'] = function($c) {
    $logger = new \Monolog\Logger('my_logger');
    $file_handler = new \Monolog\Handler\StreamHandler('../logs/app.log');
    $logger->pushHandler($file_handler);
    return $logger;
};
```

Estamos adicionando um elemento ao contêiner, que é em si uma função anônima (o `$c` que é aprovado é o próprio contêiner para que você possa acessar outras dependências se precisar). Isso será chamado quando tentarmos acessar essa dependência pela primeira vez; O código aqui faz a configuração da dependência. Na próxima vez que tentarmos acessar a mesma dependência, o mesmo objeto que foi criado a primeira vez será usado na próxima vez.

Meu Monolog config aqui é bastante leve; basta configurar o aplicativo para registrar todos os erros em um arquivo chamado `logs/app.log` (lembre-se que este caminho é do ponto de vista de onde o script está sendo executado, ou seja,` index.php`).

Com o registrador no lugar, eu posso usá-lo dentro do meu código de rota com uma linha como esta:

```php
    $this->logger->addInfo('Algo interessante aconteceu');
```

Having good application logging is a really important foundation for any application so I'd always recommend putting something like this in place.  This allows you to add as much or as little debugging as you want, and by using the appropriate log levels with each message, you can have as much or as little detail as is appropriate for what you're doing in any one moment.

### Add A Database Connection

There are many database libraries available for PHP, but this example uses PDO - this is available in PHP as standard so it's probably useful in every project, or you can use your own libraries by adapting the examples below.

Exactly as we did for adding Monolog to the DIC, we'll add an anonymous function that sets up the dependency, in this case called `db`:

```php
$container['db'] = function ($c) {
    $db = $c['settings']['db'];
    $pdo = new PDO('mysql:host=' . $db['host'] . ';dbname=' . $db['dbname'],
        $db['user'], $db['pass']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    return $pdo;
};
```

Lembre-se da configuração que adicionamos ao nosso aplicativo anteriormente? Bem, é aqui que o usamos - o contêiner sabe como acessar nossas configurações, e assim podemos agarra nossa configuração com facilidade a partir daqui. Com a configuração, criamos o objeto `PDO` (lembre-se que isso irá lançar um` PDOException` se ele falhar e você pode gostar de lidar com isso aqui) para que possamos nos conectar ao banco de dados. Eu incluí duas chamadas `setAttribute ()` que realmente não são necessárias, mas acho que essas duas configurações tornam a própria PDO muito mais útil como uma biblioteca, então eu deixei as configurações neste exemplo para que você possa usá-las também! Finalmente, devolvemos nosso objeto de conexão.

Mais uma vez, podemos acessar nossas dependências com apenas `$ this->` e, em seguida, o nome da dependência que queremos, que neste caso é `$ this-> db`, então há código na minha aplicação que se parece com:

```php
    $mapper = new TicketMapper($this->db);
```

Isso irá buscar a dependência `db` do DIC, criando-o, se necessário, e neste exemplo apenas me permite passar o objeto` PDO` diretamente na minha classe de mapeador.

## Criar rotas

"Rotas" são os padrões de URL aos quais descreveremos e atribuir funcionalidades. Slim não usa qualquer mapeamento automático ou fórmulas de URL para que você possa fazer qualquer padrão de rota que você gosta de mapa em qualquer função que você gosta, é muito flexível. As rotas podem ser vinculadas a um verbo HTTP particular (como GET ou POST), ou mais de um verbo.

Como primeiro exemplo, aqui está o código para fazer uma solicitação GET para `/ tickets` que lista os ingressos no meu aplicativo de exemplo do rastreador de bugs. Ele apenas escreve as variáveis, já que ainda não adicionamos nenhuma visão para nossa aplicação:
```php
$app->get('/tickets', function (Request $request, Response $response) {
    $this->logger->addInfo("Ticket list");
    $mapper = new TicketMapper($this->db);
    $tickets = $mapper->getTickets();

    $response->getBody()->write(var_export($tickets, true));
    return $response;
});
```

O uso de `$app->get()` aqui significa que esta rota está disponível apenas para pedidos GET; existe uma chamada equivalente de "$app->post()` que também leva o padrão de rota e um retorno de chamada para pedidos POST. Há também [métodos para outros verbos] (http://www.slimframework.com/docs/objects/router.html) - e também a função `map()` para situações em que mais de um verbo deve usar o mesmo código para uma rota particular.

As rotas Slim correspondem na ordem em que são declaradas, então, se você tiver uma rota que possa sobrepor uma outra rota, é necessário colocar primeiro o mais específico. Slim lançará uma exceção se houver um problema, por exemplo, neste aplicativo eu tenho `/ticket/new` e`/ticket/{id} `e eles precisam ser declarados nessa ordem, caso contrário, o roteamento irá pensar que" novo " "é um ID!

Neste aplicativo de exemplo, todas as rotas estão em `index.php`, mas na prática isso pode fazer um arquivo bastante longo e pesado. É bom refinar sua aplicação para colocar rotas em um arquivo ou arquivos diferentes, ou apenas registrar um conjunto de rotas com retorno de chamada que são realmente declarados em outro lugar.

Todos os retornos de rotas aceitam três parâmetros (o terceiro é opcional):

 * Solicitação: contém todas as informações sobre o pedido recebido, cabeçalhos, variáveis, etc.
 * Resposta: podemos adicionar saída e cabeçalhos para isso e, uma vez concluída, será transformada na resposta HTTP que o cliente recebe
 * Argumentos: os marcadores de lugar nomeados da URL (mais sobre aqueles em apenas um momento), isso é opcional e geralmente é omitido se não houver

Essa ênfase em Solicitação e Resposta ilustra o Slim 3 baseado no padrão PSR-7 para mensagens HTTP. O uso do objeto Solicitação e Resposta também torna o aplicativo mais testável, pois não precisamos fazer ** solicitações e respostas ** reais, podemos configurar os objetos conforme desejado.

### Rotas com espaços reservados nomeados

Às vezes, nossos URLs têm variáveis ​​neles que queremos usar em nosso aplicativo. No meu exemplo de rastreamento de bugs, eu quero que os URLs como `/ticket/42` se referem ao ticket - e o Slim possui uma maneira fácil de analisar o bit" 42 "e torná-lo disponível para fácil uso no código. Aqui está a rota que faz exatamente isso:
```php
$app->get('/ticket/{id}', function (Request $request, Response $response, $args) {
    $ticket_id = (int)$args['id'];
    $mapper = new TicketMapper($this->db);
    $ticket = $mapper->getTicketById($ticket_id);

    $response->getBody()->write(var_export($ticket, true));
    return $response;
});
```

Observe onde a própria rota está definida: nós a escrevemos como `/ticket/{id}`. Quando fizermos isso, a rota irá levar a parte do URL de onde o `{id}` é declarado e fica disponível como '$ args [' id '] `dentro do retorno de chamada.

### Usando parâmetros GET

Uma vez que GET e POST enviam dados de maneiras tão diferentes, a maneira como obtemos esses dados do objeto Request difere enormemente em Slim.

É possível obter todos os parâmetros de consulta de uma solicitação fazendo '$request->getQueryParams () `que retornará uma matriz associativa. Então, para a URL `/ tickets? Sort = date & order = desc`, obteríamos um array associativo:

    ['sort' => 'date', 'order' => 'desc']

Estes podem então ser usados (depois de validar, é claro) dentro de seu retorno de chamada.


### Trabalhando com dados POST

Ao trabalhar com dados recebidos, podemos encontrar isso no corpo. Já vimos como podemos analisar dados do URL e como obter as variáveis GET fazendo '$request->getQueryParams() `, mas o que é sobre os dados POST? Os dados do pedido POST podem ser encontrados no corpo da solicitação, e o Slim possui alguns bons criados em ajudantes para facilitar a obtenção das informações em um formato útil.

Para os dados que vêm de um formulário da Web, o Slim irá transformá-lo em uma matriz. O aplicativo de exemplo de meus ingressos tem um formulário para criar novos tickets que apenas envia dois campos: "título" e "descrição". Aqui está a primeira parte da rota que recebe esses dados, observe que para uma rota POST use `$app->post()` em vez de `$app->get()`:

```php
$app->post('/ticket/new', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $ticket_data = [];
    $ticket_data['title'] = filter_var($data['title'], FILTER_SANITIZE_STRING);
    $ticket_data['description'] = filter_var($data['description'], FILTER_SANITIZE_STRING);
    // ...
```

A chamada para `$request->getParsedBody()` pede a Slim para ver os encaminhamentos do pedido e do tipo Content-Type desse pedido, então faça algo inteligente e útil com o corpo. Neste exemplo, é apenas uma publicação de formulário e, portanto, a matriz resultante de "dados" parece muito semelhante à que esperamos de `$ _POST` - e podemos seguir em frente e usar o [filtro] (https://php.net/manual/en/book.filter.php) para verificar se o valor é aceitável antes de usá-lo. Uma grande vantagem de usar os métodos incorporados em Slim é que podemos testar as coisas injetando objetos de solicitação diferentes - se usássemos `$_POST` diretamente, não podemos fazer isso.

O que realmente é bom aqui é que, se você estiver construindo uma API ou escrevendo pontos de extremidade AJAX, por exemplo, é super fácil trabalhar com formatos de dados que chegam no POST, mas que não são um formulário da Web. Enquanto o cabeçalho `Content-Type` estiver configurado corretamente, o Slim irá analisar uma carga útil JSON em uma matriz e você pode acessá-la exatamente da mesma maneira: usando` $ request-> getParsedBody () `.

## Exibições e modelos

Slim não tem uma opinião sobre as visualizações que você deve usar, embora existam algumas opções que estão prontas para se conectar. Suas melhores escolhas são o Twig ou o antigo PHP antigo. Ambas as opções têm prós e contras: se você já está familiarizado com o Twig, ele oferece muitos recursos e funcionalidades excelentes, tais como layouts - mas, se você ainda não estiver usando o Twig, pode ser uma grande curva de aprendizado sobrecarga para adicionar a um projeto de microframework. Se você está procurando por algo simples, então as visualizações do PHP podem ser para você! Escolhi o PHP para este projeto de exemplo, mas se você estiver familiarizado com Twig, então sinta-se livre para usar isso; O básico é principalmente o mesmo.

Como estaremos usando as visualizações do PHP, precisaremos adicionar essa dependência ao nosso projeto via Composer. O comando parece assim (semelhante ao que você já viu):
    php composer.phar require slim/php-view

Para poder renderizar a vista, primeiro precisamos criar uma visualização e disponibilizá-la à nossa aplicação; Nós fazemos isso adicionando-o ao DIC. O código que precisamos vai com as outras adições DIC perto do topo do `src/public/index.php` e parece assim:

```php
$container['view'] = new \Slim\Views\PhpRenderer('../templates/');
```

Agora, temos um elemento `view` no DIC e, por padrão, procurará seus modelos no diretório` src / templates / `. Podemos usá-lo para renderizar modelos em nossas ações - aqui está a rota da lista de ingresso novamente, desta vez incluindo a chamada para passar dados para o modelo e processá-lo:

```php
$app->get('/tickets', function (Request $request, Response $response) {
    $this->logger->addInfo('Ticket list');
    $mapper = new TicketMapper($this->db);
    $tickets = $mapper->getTickets();

    $response = $this->view->render($response, 'tickets.phtml', ['tickets' => $tickets]);
    return $response;
});
```

A única parte nova aqui é a penúltima linha onde definimos a variável `$ response`. Agora que o `view` está no DIC, podemos nos referir a isso como '$this->view`. Chamar `render()` precisa de nós para fornecer três argumentos: a `$response` para usar, o arquivo de modelo (dentro do diretório de templates padrão) e qualquer dado que desejemos passar. Os objetos de resposta são * imutáveis ​​* o que significa que a chamada para `render()` não atualizará o objeto de resposta; em vez disso, nos devolverá um novo objeto, pelo que ele precisa ser capturado assim. Isso sempre é verdade quando você opera no objeto de resposta.

Ao passar os dados aos modelos, você pode adicionar tantos elementos à matriz quanto desejar disponibilizar no modelo. As chaves da matriz são as variáveis ​​que os dados existirão uma vez que chegarmos ao próprio modelo.

Como exemplo, aqui está um trecho do modelo que exibe a lista de passagens (ou seja, o código de `src/templates/tickets.phtml` - que usa [Pure.css] (http://purecss.io/) para ajudar a cobrir minha falta de habilidades frontend):
```php
<h1>Todos os Tickets</h1>

<p><a href="/ticket/new">Adicionar ticket</a></p>

<table class="pure-table">
    <tr>
        <th>Titulo</th>
        <th>Componente</th>
        <th>Descrição</th>
        <th>Ações</th>
    </tr>

<?php foreach ($tickets as $ticket): ?>

    <tr>
        <td><?=$ticket->getTitle() ?></td>
        <td><?=$ticket->getComponent() ?></td>
        <td><?=$ticket->getShortDescription() ?> ...</td>
        <td>
            <a href="<?=$router->pathFor('ticket-detail', ['id' => $ticket->getId()])?>">view</a>
        </td>
    </tr>

<?php endforeach; ?>
</table>
```

Neste caso, `$ tickets` é na verdade uma classe` TicketEntity` com getters e setters, mas se você passou em uma matriz, você poderá acessá-lo usando a matriz em vez da notação de objeto aqui.

Você notou algo divertido acontecendo com `$router->pathFor()` no final do exemplo? Vamos falar sobre rotas nomeadas em seguida :)

### Easy URL Building with Named Routes

Quando criamos uma rota, podemos dar um nome chamando `->setName()` no objeto de rota. Neste caso, eu estou adicionando o nome à rota que me permite visualizar um ticket individual para que eu possa rapidamente criar o URL certo para um ingresso apenas dando o nome da rota, então meu código agora parece algo assim (apenas Os bits alterados são mostrados aqui):
```php
$app->get('/ticket/{id}', function (Request $request, Response $response, $args) {
    // ...
})->setName('ticket-detail');
```

Para usar isso no meu modelo, preciso disponibilizar o roteador no modelo que vai querer criar esse URL, então alterei a rota `tickets/` para passar um roteador para o modelo alterando a linha de renderização para se parecer com isto:

```php
    $response = $this->view->render($response, 'tickets.phtml', ['tickets' => $tickets, 'router' => $this->router]);
```

Com a rota `/tickets/{id}` com um nome amigável e o roteador agora disponível no nosso modelo, isso é o que faz com que a chamada `pathFor ()` no nosso modelo funcione. Ao fornecer o `id`, isso é usado como um marcador de posição nomeado no padrão de URL, e o URL correto para ligação a essa rota com esses valores é criado. Este recurso é brilhante para URLs de modelo legíveis e é ainda melhor se você precisar alterar um formato de URL por qualquer motivo - não é necessário criar modelos grep para ver onde ele é usado. Esta abordagem é definitivamente recomendada, especialmente para links que você usará muito.

## Onde Próximo?

Este artigo deu um passo a passo sobre como configurar um aplicativo simples, o que espero que você comece rapidamente, veja alguns exemplos de trabalho e crie algo incrível.

A partir daqui, eu recomendo que você dê uma olhada nas outras partes da documentação do projeto para qualquer coisa que você precisa, que já não estava coberta ou que você quer ver um exemplo alternativo de. Um ótimo próximo passo seria dar uma olhada na seção [Middleware] (https://www.slimframework.com/docs/concepts/middleware.html) - esta técnica é a forma como formamos o nosso aplicativo e adicionamos funcionalidades como autenticação que pode ser aplicada em rotas múltiplas.