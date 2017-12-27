---
title: Manipulador de erros PHP
---

Se o seu aplicativo Slim Framework lança um 
[erro PHP Runtime] (http://php.net/manual/en/class.error.php) (somente PHP 7+), 
o aplicativo invoca seu manipulador de erro PHP e retorna uma resposta `HTTP /1.1 500 
Internal Server Error ' ao cliente HTTP.

## Controlador de erro PHP padrão

Cada aplicativo Slim Framework possui um manipulador de erro PHP padrão. Este 
manipulador define o status da resposta como `500`, ele define o tipo de conteúdo 
para `text/html` e ele escreve uma explicação simples para o órgão de resposta.

## Manipulador de erros PHP personalizado

O manipulador de erro PHP do aplicativo Slim Framework é um serviço de espinha 
dorsal. Você pode substituir o seu próprio manipulador de erros PHP, definindo 
um método de fábrica de espuma personalizado com o recipiente do aplicativo.

```php
// Criar Slim
$app = new \Slim\App();
// get the app's di-container
$c = $app->getContainer();
$c['phpErrorHandler'] = function ($c) {
    return function ($request, $response, $error) use ($c) {
        return $c['response']
            ->withStatus(500)
            ->withHeader('Content-Type', 'text/html')
            ->write('Something went wrong!');
    };
};
```

> ** N.B ** Confira [Not Found] (/docs/handlers/not-found.html) docs para
> método de criação pré-slim usando uma nova instância de `\Slim\Container`

Neste exemplo, definimos uma nova fábrica `phpErrorHandler` que retorna uma
callable. O retornável retornável aceita três argumentos:

1. Uma instância `\Psr\Http\Message\ServerRequestInterface`
2. Uma instância `\Psr\Http\Message\ResponseInterface`
3. Uma instância `Throwable`

O callable ** DEVE ** retorna uma nova instância `\Psr\Http\Message\ResponseInterface`
 como apropriada para o erro fornecido.
