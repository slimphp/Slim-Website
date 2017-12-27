---
title: Manipulador de erros do sistema
---

As coisas correm errado. Você não pode prever erros, mas você pode antecipar os mesmos. Cada aplicativo Slim Framework possui um manipulador de erros que recebe todas as exceções PHP não detectadas. Este manipulador de erro também recebe os objetos de solicitação e resposta HTTP atuais também. O manipulador de erros deve preparar e retornar um objeto de resposta apropriado para ser retornado ao cliente HTTP.

## Manipulador de erros padrão

O manipulador de erros padrão é muito básico. Estabelece o código de status de resposta para `500`, ele define o tipo de conteúdo de resposta para` text / html` e anexa uma mensagem de erro genérica ao corpo de resposta.

Isto é _provavelmente_ não apropriado para aplicações de produção. Você é fortemente encorajado a implementar seu próprio manipulador de erro de aplicativo Slim.

O manipulador de erro padrão também pode incluir informações detalhadas de diagnóstico de erro. Para habilitar isso, você precisa definir a configuração `displayErrorDetails` como verdadeira:

```php
$configuration = [
    'settings' => [
        'displayErrorDetails' => true,
    ],
];
$c = new \Slim\Container($configuration);
$app = new \Slim\App($c);
```

## Manipulador de erros personalizado

O manipulador de erros do aplicativo Slim Framework é um serviço Pimple. Você pode substituir o seu próprio manipulador de erros, definindo um método de fábrica de espuma personalizada com o recipiente da aplicação.

Existem duas maneiras de administrar injetores:

### Pré-Aplicação

```php
$c = new \Slim\Container();
$c['errorHandler'] = function ($c) {
    return function ($request, $response, $exception) use ($c) {
        return $c['response']->withStatus(500)
                             ->withHeader('Content-Type', 'text/html')
                             ->write('Something went wrong!');
    };
};
$app = new \Slim\App($c);
```

### Pós-App

```php
$app = new \Slim\App();
$c = $app->getContainer();
$c['errorHandler'] = function ($c) {
    return function ($request, $response, $exception) use ($c) {
        return $c['response']->withStatus(500)
                             ->withHeader('Content-Type', 'text/html')
                             ->write('Something went wrong!');
    };
};
```

Neste exemplo, definimos uma nova fábrica `errorHandler` que retorna um callable. O retornável aceita três argumentos:

1. Uma instância `\Psr\Http\Message\ServerRequestInterface`
2. Uma instância `\Psr\Http\Message\ResponseInterface`
3. Uma instância `\Exception`

O chamado ** DEVE ** retorna uma nova instância `\Psr\Http\Message\ResponseInterface` conforme apropriado para a exceção dada.

### Controlador de erros baseado em classe

Os manipuladores de erros também podem ser definidos como uma classe invocável.

```php
class CustomHandler {
   public function __invoke($request, $response, $exception) {
        return $response
            ->withStatus(500)
            ->withHeader('Content-Type', 'text/html')
            ->write('Something went wrong!');
   }
}
```

e ligados da seguinte forma:

```php
$app = new \Slim\App();
$c = $app->getContainer();
$c['errorHandler'] = function ($c) {
    return new CustomHandler();
};
```

Isso nos permite definir manipuladores mais sofisticados ou ampliar/substituir as classes `Slim\Handlers\*` incorporadas.

### Manipulando outros erros

** Observe **: Os quatro tipos de exceções seguintes não serão tratados por um `errorHandler 'personalizado:

- `Slim\Exception\MethodNotAllowedException`: Isso pode ser tratado através de um [`notAllowedHandler'] personalizado (/docs/handlers/not-allowed.html).
- `Slim\Exception\NotFoundException`: Isso pode ser tratado por meio de um [`notFoundHandler'] personalizado (/docs/handlers/not-found.html).
- Erros de PHP em tempo de execução (apenas no PHP 7+): isso pode ser tratado através de um [`phpErrorHandler`] personalizado (/docs/handlers/php-error.html).
- `Slim\Exception\SlimException`: Este tipo de exceção é interno ao Slim, e seu processamento não pode ser substituído.

### Desabilitando

Para desabilitar completamente o tratamento de erros do Slim, basta remover o manipulador de erros do contêiner:
```php
unset($app->getContainer()['errorHandler']);
unset($app->getContainer()['phpErrorHandler']);
```

Agora você é responsável por lidar com quaisquer exceções que ocorrem em seu aplicativo, pois não serão manipuladas pelo Slim.