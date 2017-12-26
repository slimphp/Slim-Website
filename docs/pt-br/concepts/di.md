---
title: Contêiner de Dependência
---

Slim usa um contêiner de dependência para preparar, gerenciar e injetar dependências 
de aplicativos. Slim suporta recipientes que implementam [PSR-11](http://www.php-fig.org/psr/psr-11/) ou o interface [Container-Interop](https://github.com/container-interop/container-interop). Você pode usar o recipiente embutido do Slim (baseado em [Pimple](http://pimple.sensiolabs.org/))
ou contêineres de terceiros como [Acclimate](https://github.com/jeremeamia/acclimate-container)
ou [PHP-DI](http://php-di.org/doc/frameworks/slim.html).

## Como usar o contêiner

Você não _tem_ que fornecer um contêiner de dependência. Se você o fizer no entanto, você deve
injetar a instância do recipiente no construtor do aplicativo Slim.

```php
$container = new \Slim\Container;
$app = new \Slim\App($container);
```

Adicione um serviço ao contentor Slim:

```php
$container = $app->getContainer();
$container['myService'] = function ($container) {
    $myService = new MyService();
    return $myService;
};
```

Você pode buscar serviços do seu contêiner de forma explícita ou implícita.
Você pode buscar uma referência explícita para a instância do contêiner dentro de uma
rota de aplicação do Slim como esta:

```php
/**
 * Example GET route
 *
 * @param  \Psr\Http\Message\ServerRequestInterface $req  PSR7 request
 * @param  \Psr\Http\Message\ResponseInterface      $res  PSR7 response
 * @param  array                                    $args Route parameters
 *
 * @return \Psr\Http\Message\ResponseInterface
 */
$app->get('/foo', function ($req, $res, $args) {
    $myService = $this->get('myService');

    return $res;
});
```

Você pode implicitamente buscar serviços do contêiner como este:

```php
/**
 * Example GET route
 *
 * @param  \Psr\Http\Message\ServerRequestInterface $req  PSR7 request
 * @param  \Psr\Http\Message\ResponseInterface      $res  PSR7 response
 * @param  array                                    $args Route parameters
 *
 * @return \Psr\Http\Message\ResponseInterface
 */
$app->get('/foo', function ($req, $res, $args) {
    $myService = $this->myService;

    return $res;
});
```

Para testar se um serviço existe no recipiente antes de usá-lo, use o método `had ()`, como este:

```php
/**
 * Example GET route
 *
 * @param  \Psr\Http\Message\ServerRequestInterface $req  PSR7 request
 * @param  \Psr\Http\Message\ResponseInterface      $res  PSR7 response
 * @param  array                                    $args Route parameters
 *
 * @return \Psr\Http\Message\ResponseInterface
 */
$app->get('/foo', function ($req, $res, $args) {
    if($this->has('myService')) {
        $myService = $this->myService;
    }

    return $res;
});
```


Slim usa métodos de mágica `__get ()` e `__isset ()` que se adiam ao recipiente do 
aplicativo para todas as propriedades que ainda não existem na instância do aplicativo.

## Serviços obrigatórios

Seu recipiente DEVE implementar esses serviços necessários. Se você usa o recipiente embutido do Slim, estes são fornecidos para você. Se você escolher um contêiner de terceiros, você deve definir esses serviços necessários por conta própria.

settings
:   Conjunto associativo de configurações de aplicativos, incluindo chaves:
    
    * `httpVersion`
    * `responseChunkSize`
    * `outputBuffering`
    * `determineRouteBeforeAppMiddleware`.
    * `displayErrorDetails`.
    * `addContentLengthHeader`.
    * `routerCacheFile`.

environment
:   Instancia de `\Slim\Interfaces\Http\EnvironmentInterface`.

request
:   Instancia de `\Psr\Http\Message\ServerRequestInterface`.

response
:   Instancia de `\Psr\Http\Message\ResponseInterface`.

router
:   Instancia de `\Slim\Interfaces\RouterInterface`.

foundHandler
:   Instancia de `\Slim\Interfaces\InvocationStrategyInterface`.

phpErrorHandler
:   Chamada invocada se um erro PHP 7 for acionado. O chamado ** TEM ** que retorna uma instância de `\Psr\Http\Message\ResponseInterface` e aceita três argumentos:

1. `\Psr\Http\Message\ServerRequestInterface`
2. `\Psr\Http\Message\ResponseInterface`
3. `\Error`

errorHandler
:   Chamada invocada se uma Exceção for acionada. O chamado ** TEM ** que retorna uma instância de `\Psr\Http\Message\ResponseInterface` e aceita três argumentos:

1. `\Psr\Http\Message\ServerRequestInterface`
2. `\Psr\Http\Message\ResponseInterface`
3. `\Exception`

notFoundHandler
:   Callable invoked if the current HTTP request URI does not match an application route. The callable **MUST** return an instance of `\Psr\Http\Message\ResponseInterface` and accept two arguments:

1. `\Psr\Http\Message\ServerRequestInterface`
2. `\Psr\Http\Message\ResponseInterface`

notAllowedHandler
:   Chamada invocada se uma rota de aplicação corresponder ao caminho de solicitação HTTP atual, mas não ao método. A chamada ** TEM ** que retorna uma instância de `\Psr\Http\Message\ResponseInterface` e aceita três argumentos:

1. `\Psr\Http\Message\ServerRequestInterface`
2. `\Psr\Http\Message\ResponseInterface`
3. Array de métodos HTTP permitidos

callableResolver
:   Instancia de `\Slim\Interfaces\CallableResolverInterface`.
