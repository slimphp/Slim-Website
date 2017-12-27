---
title: 404 Manejador não encontrado
---

Se o seu aplicativo Slim Framework não tiver uma rota que corresponda ao URI da solicitação HTTP atual, o aplicativo invoca o manipulador Not Found e retorna uma resposta `HTTP / 1.1 404 Not Found` para o cliente HTTP.

## Manipulador Padrão Não Encontrado

Cada aplicativo Slim Framework possui um manipulador padrão não encontrado. Este manipulador define o status de Resposta para '404', ele define o tipo de conteúdo para `text / html` e ele escreve uma explicação simples para o órgão de Resposta.

## Manipulador Personalizado Não Encontrado

O manipulador Not Found de um aplicativo Slim Framework é um serviço Pimple. Você pode substituir o seu próprio manipulador não encontrado, definindo um método personalizado da fábrica de espinhas com o recipiente da aplicação.

```php
$c = new \Slim\Container(); //Create Your container

//Substitua o manipulador padrão não encontrado 
$c['notFoundHandler'] = function ($c) {
    return function ($request, $response) use ($c) {
        return $c['response']
            ->withStatus(404)
            ->withHeader('Content-Type', 'text/html')
            ->write('Page not found');
    };
};

//Crear Slim
$app = new \Slim\App($c);

//... Seu codigo
```

Neste exemplo, definimos uma nova fábrica `notFoundHandler` que retorna um callable. O retornável retornável aceita dois argumentos:

1. Uma instância `\Psr\Http\Message\ServerRequestInterface`
2. Uma instância `\Psr\Http\Message\ResponseInterface`

O callable ** DEVE ** retorna uma instância apropriada `\Psr\Http\Message\ResponseInterface`.
