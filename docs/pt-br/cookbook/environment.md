---
title: Obtendo e zombando do meio ambiente
---

O objeto Ambiente encapsula a matriz superglobal `$ _SERVER` e dissocia a aplicação Slim do ambiente global do PHP. Desacoplar o aplicativo Slim do ambiente global do PHP nos permite criar pedidos HTTP que podem (ou não) se assemelhar ao ambiente global. Isso é particularmente útil para testar unidades e iniciar sub-solicitações. Você pode buscar o objeto Ambiente atual em qualquer lugar em sua aplicação Slim, como este:

```php
$container = $app->getContainer();
$environment = $container['environment'];
```

## Propriedades do ambiente

Cada aplicativo Slim possui um objeto Environment com várias propriedades que determinam o comportamento do aplicativo. Muitas dessas propriedades espelham aquelas encontradas na matriz superglobal `$ _SERVER`. Algumas propriedades são necessárias. Outras propriedades são opcionais.

### Propriedades obrigatórias

REQUEST_METHOD
: O método de solicitação HTTP. Este deve ser um de "GET", "POST", "PUT", "DELETE", "HEAD", "PATCH" ou "OPTIONS".

SCRIPT_NAME
: O nome do caminho absoluto para o script PHP do controlador anterior relativo à sua raiz do documento, desconsiderando qualquer reescrita de URL executada pelo seu servidor web.

REQUEST_URI
: O nome do caminho absoluto da URI de solicitação HTTP, incluindo quaisquer alterações de reescrita de URL realizadas pelo seu servidor web.

QUERY_STRING
: A parte do caminho URI da solicitação HTTP depois, mas não incluindo, o "?". Esta pode ser uma string vazia se a solicitação HTTP atual não especificar uma seqüência de consulta.

NOME DO SERVIDOR
: O nome do host do servidor sob o qual o script atual está sendo executado. Se o script estiver sendo executado em um host virtual, esse será o valor definido para esse host virtual.

PORTA DO SERVIDOR
: A porta na máquina do servidor utilizada pelo servidor web para comunicação. Para configurações padrão, isso será '80'; O uso de SSL, por exemplo, irá mudar isso para qualquer que seja a sua porta HTTP segura definida.

HTTPS
: Definir para um valor não vazio se o script foi consultado através do protocolo HTTPS.

### Propriedades opcionais

TIPO DE CONTEÚDO
: O tipo de conteúdo da solicitação HTTP (por exemplo, `application/json; charset = utf8`)

COMPRIMENTO DO CONTEÚDO
: O comprimento do conteúdo da solicitação HTTP. Este deve ser um número inteiro se presente.

HTTP_*
: Os cabeçalhos de solicitação HTTP enviados pelo cliente. Esses valores são idênticos aos seus equivalentes na matriz superglobal `$ _SERVER`. Se presente, esses valores devem reter o prefixo "HTTP_".

PHP_AUTH_USER
: O nome de usuário decodificado do cabeçalho da autenticação HTTP.

PHP_AUTH_PW
: A senha decodificada do cabeçalho da autenticação HTTP.

PHP_AUTH_DIGEST
: O cabeçalho do HTTP `Authentication 'bruto como enviado pelo cliente HTTP.

AUTH_TYPE
: O tipo de autenticação do cabeçalho do HTTP `Authentication` (por exemplo," Basic "ou" Digest ").

## Ambientes simulados

Cada aplicativo Slim instancia um objeto Environment usando informações do ambiente global atual. No entanto, você também pode criar objetos de simulação de ambiente com informações personalizadas. Os objetos dos ambientes simulados só são úteis quando se escrevem testes unitários.

```php
$env = \Slim\Http\Environment::mock([
    'REQUEST_METHOD' => 'PUT',
    'REQUEST_URI' => '/foo/bar',
    'QUERY_STRING' => 'abc=123&foo=bar',
    'SERVER_NAME' => 'example.com',
    'CONTENT_TYPE' => 'application/json;charset=utf8',
    'CONTENT_LENGTH' => 15
]);
```
