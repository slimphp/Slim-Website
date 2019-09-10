---
title: Instalacja
l10n-link: start-v4-installation
l10n-lang: pl
---

## Wymagania Systemowe

* Web server z przepisywaniem URL
* PHP 7.1 lub nowszy

## Krok 1: Instalacja Composer'a

Nie masz Composer'a? Jest &#322;atwy w instalacji, post&#281;puj&#261;c zgodnie z instrukcjami zawartymi na stronie [download](https://getcomposer.org/download/).

## Step 2: Instalacja Slim'a

Zalecamy zainstalowanie Slim przy u&#378;yciu [Composer](https://getcomposer.org/).
Przejd&#378; do katalogu g&#322;&#243;wnego projektu i uruchom polecenie bash
pokazane poni&#380;ej. To polecenie pobiera Slim Framework i jego zewn&#281;trzne oprogramowanie
zale&#380;no&#347;ci do katalogu `vendor /` twojego projektu.

```bash
composer require slim/slim:4.0.0
```

## Krok 3: Zainstaluj implementacj&#281; PSR-7 Implementation oraz kreatora ServerRequest

Zanim zaczniesz korzysta&#263; ze Slim, musisz wybra&#263; implementacj&#281; PSR-7, kt&#243;ra najlepiej pasuje do Twojej aplikacji.
Aby automatyczne wykrywanie dzia&#322;a&#322;o i umożliwia&#322;o korzystanie z `AppFactory::create()` oraz `App::run()`
bez konieczno&#347;ci r&#281;cznego tworzenia ServerRequest, musisz zainstalowa&#263; jedn&#261; z nast&#281;pujących implementacji:

### [Slim PSR-7](https://github.com/slimphp/Slim-Psr7)
```bash
composer require slim/psr7
```

### [Nyholm PSR-7](https://github.com/Nyholm/psr7) oraz [Nyholm PSR-7 Server](https://github.com/Nyholm/psr7-server)
```bash
composer require nyholm/psr7 nyholm/psr7-server
```

### [Guzzle PSR-7](https://github.com/guzzle/psr7) oraz [Guzzle HTTP Factory](https://github.com/http-interop/http-factory-guzzle)
```bash
composer require guzzlehttp/psr7 http-interop/http-factory-guzzle
```

### [Zend Diactoros](https://github.com/zendframework/zend-diactoros)
```bash
composer require zendframework/zend-diactoros
```

## Krok 4: Hello World
```php
<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$app->get('/', function (Request $request, Response $response, $args) {
    $response->getBody()->write("Hello world!");
    return $response;
});

$app->run();
```
