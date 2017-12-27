---
title: Proteção CSRF
---

O Slim 3 usa o componente opcional opcional 
[slimphp / Slim-Csrf] (https://github.com/slimphp/Slim-Csrf) para proteger seu 
aplicativo do CSRF (falsificação de solicitação entre sites). Esse componente 
gera um token exclusivo por solicitação que valida os pedidos POST subseqüentes 
dos formulários HTML do lado do cliente.

## Instalação

Execute este comando bash do diretório raiz do seu projeto:

```bash
composer require slim/csrf
```

## Usar

O componente `slim php / Slim-Csrf` contém um middleware de aplicativo. 
Adicione-o ao seu aplicativo assim:

```php
// Adiciona middleware ao aplicativo
$app = new \Slim\App;
$app->add(new \Slim\Csrf\Guard);

// Crie suas rotas de aplicação ...

// Execute o aplicativo
$app->run();
```

## Obtenha o nome e o valor do token CSRF

O nome e o valor do token CSRF mais recentes estão disponíveis como atributos 
no objeto de solicitação PSR7. O nome e o valor do token CSRF são únicos para 
cada solicitação. Você pode buscar o nome e o valor do token CSRF atual assim.

```php
$app->get('/foo', function ($req, $res, $args) {
    // Nome e valor do token CSRF
    $nameKey = $this->csrf->getTokenNameKey();
    $valueKey = $this->csrf->getTokenValueKey();
    $name = $req->getAttribute($nameKey);
    $value = $req->getAttribute($valueKey);

    // Render HTML form, que POSTs para /bar com dois campos de entrada 
	// escondidos para o nome e valor:
    // <input type="hidden" name="<?= $nameKey ?>" value="<?= $name ?>">
    // <input type="hidden" name="<?= $valueKey ?>" value="<?= $value ?>">
});

$app->post('/bar', function ($req, $res, $args) {
    // CSRF proteção bem sucedida se você chegou aqui.
});
```
Você deve passar o nome e o valor do token CSRF para o modelo para que eles 
possam ser submetidos com solicitações de formulário HTML POST. Eles geralmente 
são armazenados como um campo oculto com formulários HTML.

Para mais casos de uso e documentação, verifique a página [slimphp / Slim-Csrf] (https://github.com/slimphp/Slim-Csrf).