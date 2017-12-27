---
title: Usando Eloquent com Slim
---

Você pode usar um ORM de banco de dados, como [Eloquent] (https://laravel.com/docs/5.1/eloquent) para conectar seu aplicativo SlimPHP a um banco de dados.

## Adicionando Eloquent à sua aplicação

<figure markdown="1">

```bash
composer require illuminate/database "~5.1"
```
<figcaption>Figura 1: Adicione Eloquent ao seu aplicativo.</figcaption>
</figure>

## Configure Eloquent

Adicione as configurações do banco de dados ao array de configurações do Slim.

<figure markdown="1">
```php
<?php
return [
    'settings' => [
        // Configurações de Slim
        'determineRouteBeforeAppMiddleware' => false,
        'displayErrorDetails' => true,
        'db' => [
            'driver' => 'mysql',
            'host' => 'localhost',
            'database' => 'database',
            'username' => 'user',
            'password' => 'password',
            'charset'   => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix'    => '',
        ]
    ],
];
```
<figcaption>Figura 2: Array de Configurações.</figcaption>
</figure>

No seu `dependencies.php` ou onde você adiciona suas Fábricas de Serviço:

<figure markdown="1">
```php
// Service factory for the ORM
$container['db'] = function ($container) {
    $capsule = new \Illuminate\Database\Capsule\Manager;
    $capsule->addConnection($container['settings']['db']);

    $capsule->setAsGlobal();
    $capsule->bootEloquent();

    return $capsule;
};
```
<figcaption>Figura 3: Configure Eloquent.</figcaption>
</figure>

## Passe um controlador a uma instância da sua tabela

<figure markdown="1">
```php
$container[App\WidgetController::class] = function ($c) {
    $view = $c->get('view');
    $logger = $c->get('logger');
    $table = $c->get('db')->table('table_name');
    return new \App\WidgetController($view, $logger, $table);
};
```
<figcaption>Figura 4: Passe o objeto da tabela em um controlador.</figcaption>
</figure>

## Consultar a tabela a partir de um controlador

<figure markdown="1">
```php
<?php

namespace App;

use Slim\Views\Twig;
use Psr\Log\LoggerInterface;
use Illuminate\Database\Query\Builder;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

class WidgetController
{
    private $view;
    private $logger;
    protected $table;

    public function __construct(
        Twig $view,
        LoggerInterface $logger,
        Builder $table
    ) {
        $this->view = $view;
        $this->logger = $logger;
        $this->table = $table;
    }

    public function __invoke(Request $request, Response $response, $args)
    {
        $widgets = $this->table->get();

        $this->view->render($response, 'app/index.twig', [
            'widgets' => $widgets
        ]);

        return $response;
    }
}
```
<figcaption>Figura 5: Controlador de amostras consultando a tabela.</figcaption>
</figure>

### Consulte a tabela com 'where()'

<figure markdown="1">
```php
...
$records = $this->table->where('name', 'like', '%foo%')->get();
...
```
<figcaption>Figura 6: Consulta procurando nomes que correspondam a foo.</figcaption>
</figure>

### Consulta a tabela por id

<figure markdown="1">
```php
...
$record = $this->table->find(1);
...
```
<figcaption>Figura 7: Selecionando uma linha com base no id.</figcaption>
</figure>

## Mais informação

[Eloquent](https://laravel.com/docs/5.1/eloquent) Documentação
