---
title: Middleware
---

Você pode executar o código seu aplicativo Slim _antes_ e _depois_ para manipular os
objetos de solicitação e resposta como você entender. Isso é chamado de _middleware_.
Por que você quer fazer isso? Talvez você queira proteger seu aplicativo
de falsificação de solicitação entre locais. Talvez você queira autenticar pedidos
antes do seu aplicativo funcionar. Middleware é perfeito para esses cenários.

## O que é middleware?

Tecnicamente falando, um middleware é um _callable_ que aceita três argumentos:

1. `\Psr\Http\Message\ServerRequestInterface` - O objeto de solicitação PSR7
2. `\Psr\Http\Message\ResponseInterface` - O objeto de resposta PSR7
3. `callable` - O próximo middleware que pode ser chamado

Ele pode fazer o que for apropriado com esses objetos. O único requisito difícil
é que um middleware **DEVE** retornar uma instância de `\Psr\Http\Message\ResponseInterface`.
Cada middleware **DEVE** invocar o próximo middleware e passá-lo como argumentos 
de Pedido e Objetos de resposta .

## Como o middleware funciona?

Diferentes frameworks usam o middleware de forma diferente. Slim adiciona middleware como camadas 
concêntricas em torno do seu core do applicativo. Cada nova camada de middleware envolve
quaisquer camadas de middleware existentes. A estrutura concêntrica se expande para fora enquanto
as camadas de middleware adicionais são adicionadas.

A última camada de middleware adicionada é a primeira a ser executada.

Quando você executa o aplicativo Slim, os objetos de Solicitação e Resposta atravessam a 
estrutura do middleware de fora. Entraram primeiro no middleware externo, depois no próximo 
middleware externo, (e assim por diante), até chegarem ao Slim aplicação em si. Depois que 
o aplicativo Slim despachar a rota apropriada, o objeto de resposta resultante sai do 
aplicativo Slim e atravessa a estrutura do middleware de dentro para fora. Em última 
análise, um objeto de resposta final sai do middleware externo, é serializado em uma 
resposta HTTP bruta e é retornado para o cliente HTTP. Aqui está um diagrama que ilustra o 
fluxo de processo do middleware:

<div style="padding: 2em 0; text-align: center">
    <img src="/docs/images/middleware.png" alt="Middleware architecture" style="max-width: 80%;"/>
</div>

## Como faço para escrever middleware?

Middleware é um callable que aceita três argumentos: um objeto Request, um objeto Response e o próximo middleware. Cada middleware ** DEVE ** retornar uma instância de `\Psr\Http\Message\ResponseInterface`.

### Exemplo de middleware de encerramento.

Este exemplo de middleware é um encerramento.

```php
<?php
/**
 * Exemplo de middleware de encerramento.
 *
 * @param  \Psr\Http\Message\ServerRequestInterface $request  PSR7 requesto
 * @param  \Psr\Http\Message\ResponseInterface      $response PSR7 resposta
 * @param  callable                                 $next     Proximo middleware
 *
 * @return \Psr\Http\Message\ResponseInterface
 */
function ($request, $response, $next) {
    $response->getBody()->write('BEFORE');
    $response = $next($request, $response);
    $response->getBody()->write('AFTER');

    return $response;
};
```

### Exemplo de middleware de classe invocável

Este exemplo de middleware é uma classe invocável que implementa o método mágico ``__invoke()`.

```php
<?php
class ExampleMiddleware
{
    /**
     * Exemplo de middleware de classe invocável
     *
     * @param  \Psr\Http\Message\ServerRequestInterface $request  PSR7 requesto
     * @param  \Psr\Http\Message\ResponseInterface      $response PSR7 resposta
     * @param  callable                                 $next     Proximo middleware
     *
     * @return \Psr\Http\Message\ResponseInterface
     */
    public function __invoke($request, $response, $next)
    {
        $response->getBody()->write('BEFORE');
        $response = $next($request, $response);
        $response->getBody()->write('AFTER');

        return $response;
    }
}
```

Para usar esta classe como um middleware, você pode usar a cadeia de função `->add( new ExampleMiddleware() );` após o `$ app`,` Route`, ou `group ()`, que no código abaixo, qualquer um desses, poderia representar $subject.

```php
$subject->add( new ExampleMiddleware() );
```

## Como faço para adicionar middleware?

Você pode adicionar middleware a um aplicativo Slim, a uma rota de aplicação Slim individual ou a um grupo de rota. Todos os cenários aceitam o mesmo middleware e implementam a mesma interface de middleware.

### Middleware de aplicativos

O middleware do aplicativo é invocado para cada solicitação HTTP *recebida*. Adicione o middleware do aplicativo com o método `add()` da instância do aplicativo Slim. Este exemplo adiciona o exemplo de middleware de encerramento acima:

```php
<?php
$app = new \Slim\App();

$app->add(function ($request, $response, $next) {
	$response->getBody()->write('ANTES');
	$response = $next($request, $response);
	$response->getBody()->write('DEPOIS');

	return $response;
});

$app->get('/', function ($request, $response, $args) {
	$response->getBody()->write(' Oi ');

	return $response;
});

$app->run();
```

Isso emitiria este corpo de resposta HTTP:

    ANTES Oi DEPOIS

### Middleware de rota

O middleware de rota é invocado apenas se a sua rota corresponder ao método de solicitação HTTP atual e ao URI. O middleware de rota é especificado imediatamente depois de invocar qualquer um dos métodos de roteamento do aplicativo Slim (por exemplo, `get()` ou `post()`). Cada método de roteamento retorna uma instância de `\Slim\Route`, e esta classe fornece a mesma interface de middleware que a instância do aplicativo Slim. Adicione o middleware a uma Route com o método `add()` da instância da Route. Este exemplo adiciona o exemplo de middleware de encerramento acima:

```php
<?php
$app = new \Slim\App();

$mw = function ($request, $response, $next) {
    $response->getBody()->write('ANTES');
    $response = $next($request, $response);
    $response->getBody()->write('DEPOIS');

    return $response;
};

$app->get('/', function ($request, $response, $args) {
	$response->getBody()->write(' Oi ');

	return $response;
})->add($mw);

$app->run();
```

Isso emitiria este corpo de resposta HTTP:

    ANTES Oi DEPOIS

### Middleware de grupo

Além da aplicação geral, e as rotas padrão que podem aceitar o middleware, a funcionalidade de definição de multi-rotas group () `, também permite rotas individuais internamente. O middleware do grupo de rotas é invocado apenas se a sua rota corresponder a um dos métodos de solicitação HTTP definidos e URIs do grupo. Para adicionar middleware dentro do callback, e o middleware de grupo inteiro a ser configurado encadeando `add ()` após o método `group ()`.

Exemplo de Aplicação, fazendo uso do middleware de retorno de chamada em um grupo de manipuladores de url
```php
<?php

require_once __DIR__.'/vendor/autoload.php';

$app = new \Slim\App();

$app->get('/', function ($request, $response) {
    return $response->getBody()->write('Oi Mundo');
});

$app->group('/utils', function () use ($app) {
    $app->get('/date', function ($request, $response) {
        return $response->getBody()->write(date('Y-m-d H:i:s'));
    });
    $app->get('/time', function ($request, $response) {
        return $response->getBody()->write(time());
    });
})->add(function ($request, $response, $next) {
    $response->getBody()->write('São agora ');
    $response = $next($request, $response);
    $response->getBody()->write('. Disfrute!');

    return $response;
});
```

Ao chamar o método `/utils/date`, isso emitiria uma string semelhante à abaixo

    São agora 2015-07-06 03:11:01. Disfrute!

visitando `/utils/time` emitiria uma string semelhante à abaixo

    São agora 1436148762. Disfrute!

mas visitando `/` *(domínio-raiz)*, seria esperado gerar a seguinte saída, pois nenhum middleware foi atribuído

    Oi Mundo

### Passando variáveis do middleware
A maneira mais fácil de passar atributos do middleware é usar os atributos do pedido.

Configurando a variável no middleware:

```php
$request = $request->withAttribute('foo', 'bar');
```

Obtendo a variável no retorno de chamada da rota:

```php
$foo = $request->getAttribute('foo');
```

## Encontrando o middleware disponível

Você pode encontrar uma classe MiddleRock PSR 7 já escrita que irá satisfazer suas necessidades. Aqui estão algumas listas não oficiais para pesquisar.

* [oscarotero/psr7-middlewares](https://github.com/oscarotero/psr7-middlewares)
* [Middleware for Slim Framework v3.x wiki](https://github.com/slimphp/Slim/wiki/Middleware-for-Slim-Framework-v3.x)
* [lalop/awesome-psr7](https://github.com/lalop/awesome-psr7)
