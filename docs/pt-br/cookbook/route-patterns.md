---
title: '/' em padrões de rota
---

Slim trata um padrão de URL com uma barra final como diferente de um sem. Ou seja, `/user` e `/user/` são diferentes e, portanto, podem ter diferentes encaminhamentos em anexo.

Para pedidos GET, um redirecionamento permanente está correto, mas para outros métodos de solicitação como POST ou PUT, o navegador enviará o segundo pedido com o método GET. Para evitar isso, você simplesmente precisa remover a barra diagonal e passar o URL manipulado para o próximo middleware.

Se você quiser redirecionar/reescrever todos os URLs que terminam em `/` para o equivalente não-trailing `/`, você pode adicionar este middleware:

```php
use Psr\Http\Message\RequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

$app->add(function (Request $request, Response $response, callable $next) {
    $uri = $request->getUri();
    $path = $uri->getPath();
    if ($path != '/' && substr($path, -1) == '/') {
        // permanently redirect paths with a trailing slash
        // to their non-trailing counterpart
        $uri = $uri->withPath(substr($path, 0, -1));
        
        if($request->getMethod() == 'GET') {
            return $response->withRedirect((string)$uri, 301);
        }
        else {
            return $next($request->withUri($uri), $response);
        }
    }

    return $next($request, $response);
});
```

Em alternativa, considere o middleware [oscarotero/psr7-middlewares' TrailingSlash] (//github.com/oscarotero/psr7-middlewares#trailingslash) que também permite que você force uma barra final para ser anexada a todos os URLs:
```php
use Psr7Middlewares\Middleware\TrailingSlash;

$app->add(new TrailingSlash(true)); // true adiciona a barra diagonal (false remove)
```
