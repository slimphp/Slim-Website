---
title: Cache HTTP
---

O Slim 3 usa o componente PHP autônomo 
[slimphp / Slim-HttpCache] (https://github.com/slimphp/Slim-HttpCache) para o 
armazenamento em cache HTTP. Você pode usar esse componente para criar e retornar 
respostas que contenham cabeçalhos 'Cache`, `Expiração',` ETag` e `Last-Modified` 
que controlam quando e por quanto tempo a saída do aplicativo é mantida por caches 
do lado do cliente. Talvez você precise configurar sua configuração php.ini 
"session.cache_limiter" para uma string vazia para que isso funcione sem interferências.

## Instalação

Execute este comando bash do diretório raiz do seu projeto:

```bash
composer require slim/http-cache
```

## Usar

O componente `slim php / Slim-Http Cache` contém um provedor de serviços e um middleware 
de aplicativos. Você deve adicionar ambos ao seu aplicativo como este:

```php
// Registre o provedor de serviços com o recipiente
$container = new \Slim\Container;
$container['cache'] = function () {
    return new \Slim\HttpCache\CacheProvider();
};

// Adicionar middleware ao aplicativo
$app = new \Slim\App($container);
$app->add(new \Slim\HttpCache\Cache('public', 86400));

// Crie suas rotas de aplicação ...

// Execute o aplicativo
$app->run();
```

## ETag

Use o método `withEtag ()` do provedor de serviços para criar um objeto de resposta com 
o cabeçalho `ETag` desejado. Este método aceita um objeto de resposta PSR7 e retorna uma 
resposta PSR7 clonada com o novo cabeçalho HTTP.

```php
$app->get('/foo', function ($req, $res, $args) {
    $resWithEtag = $this->cache->withEtag($res, 'abc');

    return $resWithEtag;
});
```

## Expira

Use o método `withExpires ()` do provedor de serviços para criar um objeto de resposta 
com o cabeçalho 'Expirar' desejado. Este método aceita um objeto de resposta PSR7 e retorna 
uma resposta PSR7 clonada com o novo cabeçalho HTTP.

```php
$app->get('/bar',function ($req, $res, $args) {
    $resWithExpires = $this->cache->withExpires($res, time() + 3600);

    return $resWithExpires;
});
```

## Last-Modified

Use o método `withLastModified ()` do provedor de serviços para criar um objeto de 
resposta com o cabeçalho `Last-Modified 'desejado. Este método aceita um objeto de resposta 
PSR7 e retorna uma resposta PSR7 clonada com o novo cabeçalho HTTP.

```php
//Exemplo de rota com LastModified
$app->get('/foobar',function ($req, $res, $args) {
    $resWithLastMod = $this->cache->withLastModified($res, time() - 3600);

    return $resWithLastMod;
});
```
