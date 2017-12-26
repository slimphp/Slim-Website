---
title: Recuperando o endereço IP
---

A melhor maneira de recuperar o endereço IP atual do cliente é via middleware usando um componente como [rka-ip-address-middleware] (https://github.com/akrabat/rka-ip-address-middleware).

Este componente pode ser instalado via composer:

```bash
composer require akrabat/rka-ip-address-middleware
```


Para usá-lo, registre o middleware com a aplicação <code> </ code>, fornecendo uma 
lista de proxies confiáveis (por exemplo, servidores de vernizes) se você estiver usando-os .:

```php
$checkProxyHeaders = true;
$trustedProxies = ['10.0.0.1', '10.0.0.2'];
$app->add(new RKA\Middleware\IpAddress($checkProxyHeaders, $trustedProxies));

$app->get('/', function ($request, $response, $args) {
    $ipAddress = $request->getAttribute('ip_address');

    return $response;
});
```

O middleware armazena o endereço IP do cliente em um atributo de solicitação, então o 
acesso é via <code>$request->getAttribute('ip_address')</code>.