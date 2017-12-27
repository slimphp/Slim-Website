---
title: PSR 7 e Value Objects
---

Slim suporta interfaces [PSR-7] (https://github.com/php-fig/http-message) para 
seus objetos de solicitação e resposta. Isso torna o Slim flexível porque pode 
usar _qualquer_ implementação do PSR-7. Por exemplo, uma rota de aplicativo Slim 
não deve retornar uma instância de `\Slim\Http\Response`. Poderia em vez, por exemplo, 
retornar uma instância de `\GuzzleHttp\Psr7\CachingStream` ou qualquer instância 
retornada pela função `\GuzzleHttp\Psr7\stream_for()`.

O Slim fornece sua própria implementação do PSR-7 para que ele funcione fora da caixa. 
No entanto, você pode substituir os objetos PSR 7 padrão do Slim por uma implementação 
de terceiros. Basta substituir os serviços `request` e` response` do contêiner do 
aplicativo para que eles retornem uma instância de `\Psr\Http\Message\ServerRequestInterface` 
e `\Psr\Http\Message\ResponseInterface`, respectivamente.



## Objetos de valor

Os objetos de pedido e resposta do Slim são [_objetos de valor imutáveis_] (http://en.wikipedia.org/wiki/Value_object). 
Eles podem ser "alterados" apenas solicitando uma versão clonada que tenha 
atualizado valores de propriedade. Os objetos de valor têm uma sobrecarga 
nominal porque devem ser clonados quando suas propriedades são atualizadas. 
Esta sobrecarga não afeta o desempenho de forma significativa.

Você pode solicitar uma cópia de um objeto de valor invocando qualquer um dos 
seus métodos de interface PSR 7 (esses métodos tipicamente têm um prefixo `with`). 
Por exemplo, um objeto de resposta do PSR 7 possui um método `withHeader ($name, $value)` 
que retorna um objeto de valor clonado com o novo cabeçalho HTTP.

```php
<?php
$app = new \Slim\App;
$app->get('/foo', function ($req, $res, $args) {
    return $res->withHeader(
        'Content-Type',
        'application/json'
    );
});
$app->run();
```

A interface PSR 7 fornece esses métodos para transformar objetos de solicitação e resposta:

* `withProtocolVersion($version)`
* `withHeader($name, $value)`
* `withAddedHeader($name, $value)`
* `withoutHeader($name)`
* `withBody(StreamInterface $body)`

A interface PSR 7 fornece esses métodos para transformar objetos de solicitação:

* `withMethod($method)`
* `withUri(UriInterface $uri, $preserveHost = false)`
* `withCookieParams(array $cookies)`
* `withQueryParams(array $query)`
* `withUploadedFiles(array $uploadedFiles)`
* `withParsedBody($data)`
* `withAttribute($name, $value)`
* `withoutAttribute($name)`

A interface PSR 7 fornece esses métodos para transformar objetos de resposta:

* `withStatus($code, $reasonPhrase = '')`

Consulte a [documentação do PSR-7] (http://www.php-fig.org/psr/psr-7/) para obter mais informação sobre esses métodos.