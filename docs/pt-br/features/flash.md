---
title: Mensagens Flash
---

## Instalar

Via Composer

``` bash
$ composer require slim/flash
```

Requer Slim 3.0.0 or mais novo.

## Usagem

```php
// Iniciar sessão do PHP
session_start(); // por padrão requer armazenamento de sessão

$app = new \Slim\App();

// Buscar recipiente DI
$container = $app->getContainer();

// Provedor de registro
$container['flash'] = function () {
    return new \Slim\Flash\Messages();
};

$app->get('/foo', function ($req, $res, $args) {
    // Definir mensagem flash para o próximo pedido
    $this->flash->addMessage('Test', 'This is a message');

    // Redirecionar
    return $res->withStatus(302)->withHeader('Location', '/bar');
});

$app->get('/bar', function ($req, $res, $args) {
    // Obter mensagens instantâneas do pedido anterior
    $messages = $this->flash->getMessages();
    print_r($messages);
});

$app->run();
```

Observe que uma mensagem pode ser uma string, objeto ou array. Verifique o que e quanto o seu armazenamento pode lidar.