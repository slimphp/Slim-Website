---
title: Modelos
---

O Slim não tem uma camada de exibição como quadros MVC tradicionais. Em vez disso, 
a "view" de Slim é a _resposta HTTP_. Cada trilha de aplicação Slim é responsável 
por preparar e retornar um objeto de resposta PSR 7 apropriado.

> A "view" de Slim é a resposta HTTP.

Dito isto, o projeto Slim fornece os componentes [Twig-View] (# the-slimtwig-view-component) 
e [PHP-View] (# the-slimphp-view-component) para ajudá-lo a renderizar modelos para uma resposta 
de objeto PSR7.

## O componente slim/twig-view

O componente PHP [Twig-View] [twigview] ajuda você a renderizar modelos [Twig] [twig] em seu 
aplicativo. Este componente está disponível no Packagist, e é fácil de instalar com o Composer:

[twigview]: https://github.com/slimphp/Twig-View
[twig]: http://twig.sensiolabs.org/

<figure markdown="1">
```
composer require slim/twig-view
```
<figcaption>Figura 1: Instale o componente slim/twig-view.</figcaption>
</figure>

Em seguida, você precisa registrar o componente como um serviço no contêiner 
do aplicativo Slim, como este:

<figure markdown="1">
```php
<?php
// Crear app
$app = new \Slim\App();

// Obter contêiner
$container = $app->getContainer();

// Componente de registro no contêiner
$container['view'] = function ($container) {
    $view = new \Slim\Views\Twig('path/to/templates', [
        'cache' => 'path/to/cache'
    ]);
    
    // Instanciar e adicionar extensão específica do Slim
    $basePath = rtrim(str_ireplace('index.php', '', $container['request']->getUri()->getBasePath()), '/');
    $view->addExtension(new Slim\Views\TwigExtension($container['router'], $basePath));

    return $view;
};
```
<figcaption>Figura 2: Registre o componente slim / twig-view com o recipiente.</figcaption>
</figure>

Nota: "cache" pode ser configurado como falso para desativá-lo, veja também a opção 'auto_reload', útil no ambiente de desenvolvimento. Para obter mais informações, consulte [Opções do ambiente Twig] (http://twig.sensiolabs.org/doc/2.x/api.html#environment-options)

Agora, você pode usar o serviço de componente `slim / twig-view 'dentro de uma rota de 
aplicativo para renderizar um modelo e gravá-lo em um objeto de resposta do PSR 7:

<figure markdown="1">
```php
// Render Twig template in route
$app->get('/hello/{name}', function ($request, $response, $args) {
    return $this->view->render($response, 'profile.html', [
        'name' => $args['name']
    ]);
})->setName('profile');

// Corra app
$app->run();
```
<figcaption>Figura 3: Modelo de renderização com serviço de contêiner slim / twig-view.</figcaption>
</figure>

Neste exemplo, `$this->view` invocado dentro do retorno de chamada de rota é uma 
referência para a instância` \ Slim\Views\Twig` retornada pelo serviço de contêiner 
`view`. O método `render()` da instância `\Slim\Views\Twig` aceita um objeto de 
resposta PSR 7 como seu primeiro argumento, o caminho do modelo Twig como seu segundo 
argumento e uma matriz de variáveis de modelo como seu argumento final. O método `render()` 
retorna um novo objeto de resposta do PSR 7 cujo corpo é o modelo Twig renderizado.

### O método path_for ()

O componente `slim/twig-view` expõe uma função` path_for() `personalizada para seus 
modelos Twig. Você pode usar esta função para gerar URLs completas para qualquer rota 
nomeada em seu aplicativo Slim. A função `path_for()` aceita dois argumentos:

1. Um nome de rota
2. Um hash de nomes de espaço reservado e valores de substituição

As chaves do segundo argumento devem corresponder aos marcadores de posição de 
padrão da rota selecionada. Este é um exemplo de modelo Twig que desenha um URL 
de link para a rota denominada "perfil" mostrada no exemplo do aplicativo Slim acima.

```html
{% raw %}
{% extends "layout.html" %}

{% block body %}
<h1>Lista de usarios</h1>
<ul>
    <li><a href="{{ path_for('profile', { 'name': 'josh' }) }}">Josh</a></li>
</ul>
{% endblock %}
{% endraw %}
```

## O componente slim / php-view

O [PHP-View] [phpview] componente PHP ajuda você a renderizar modelos PHP. Este 
componente está disponível no Packagist e pode ser instalado usando o Composer:

[phpview]: https://github.com/slimphp/PHP-View

<figure markdown="1">
```
composer require slim/php-view
```
<figcaption>Figura 4: Instalar o componente slim / php-view.</figcaption>
</figure>

Para registrar este componente como um serviço no contêiner da Aplicação Slim, faça isto:

<figure markdown="1">
```php
<?php
// Crear app
$app = new \Slim\App();

// Obter contêiner
$container = $app->getContainer();

// Componente de registro no contêiner
$container['view'] = function ($container) {
    return new \Slim\Views\PhpRenderer('path/to/templates/with/trailing/slash/');
};
```
<figcaption>Figura 5: Registrar o componente slim/php-view com o contêiner.</figcaption>
</figure>


Use o componente de exibição para exibir o PHP:

<figure markdown="1">
```php

// Renderizar modelo PHP na rota
$app->get('/hello/{name}', function ($request, $response, $args) {
    return $this->view->render($response, 'profile.html', [
        'name' => $args['name']
    ]);
})->setName('profile');

// Corra app
$app->run();
```
<figcaption>Figura 6: Modelo de renderização com serviço de contêiner slim/php-view.</figcaption>
</figure>

## Outros sistemas de modelo

Você não está limitado aos componentes `Twig-View` e` PHP-View`. Você pode usar qualquer 
sistema de modelo PHP, desde que você escreva a saída do modelo renderizado para o corpo 
do objeto de resposta do PSR 7.
