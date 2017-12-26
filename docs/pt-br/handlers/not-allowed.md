---
title: 405 Handheld Não Permitido
---

Se o seu aplicativo Slim Framework tiver uma rota que corresponda ao URI da solicitação HTTP atual **, mas NÃO o método de solicitação HTTP **, o aplicativo invoca o manipulador Não Permitido e retorna uma resposta `HTTP / 1.1 405 Não Permitida 'ao cliente HTTP.

## Padrão manipulador não permitido

Cada aplicativo Slim Framework possui um manipulador padrão não permitido. Este manipulador define o status da resposta para `405`, ele define o tipo de conteúdo como` text / html`, ele adiciona um cabeçalho HTTP `Permitido:` com uma lista delimitada por vírgulas dos métodos HTTP permitidos e ele escreve uma explicação simples para o órgão de resposta.

## Manipulador personalizado não permitido

O manipulador não permitido do aplicativo Slim Framework é um serviço de espinha dorsal. Você pode substituir o seu próprio manipulador Não Permitido, definindo um método de fábrica de espuma personalizado com o recipiente do aplicativo.

`` `php
// Criar Slim
$app = new \Slim\App();
// get the app's di-container
$c = $app->getContainer();
$c['notAllowedHandler'] = function ($c) {
    return function ($request, $response, $methods) use ($c) {
        return $c['response']
            ->withStatus(405)
            ->withHeader('Allow', implode(', ', $methods))
            ->withHeader('Content-type', 'text/html')
            ->write('Method must be one of: ' . implode(', ', $methods));
    };
};
```

> ** N.B ** Confira [Não Encontrado] (/docs/handlers/not-found.html) docs para método de criação pré-slim usando uma nova instância de `\Slim\Container`

Neste exemplo, definimos uma nova fábrica `notAllowedHandler` que retorna um callable. O retornável retornável aceita três argumentos:

1. Uma instância `\Psr\Http\Message\ServerRequestInterface`
2. Uma instância `\Psr\Http\Message\ResponseInterface`
3. Um array numérico de nomes de métodos HTTP permitidos

O chamado ** TEM ** que retorna uma instância `\Psr\Http\Message\ResponseInterface`.