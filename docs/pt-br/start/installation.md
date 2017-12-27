---
title: Instalação
---

## Requisitos de sistema

* Servidor web com reescrita de URL
* PHP 5.5 ou mais recente

## Como instalar Slim

Recomendamos que você instale o Slim com [Composer] (https://getcomposer.org/). Navegue 
no diretório raiz do seu projeto e execute o comando bash mostrado abaixo. Este comando 
baixa o Slim Framework e suas dependências de terceiros no diretório `vendor/` do seu 
projeto.

```bash
composer require slim/slim "^3.0"
```

Exigir o autoloader Composer no seu script PHP, e você está pronto para começar a usar o Slim.

```php
<?php
require 'vendor/autoload.php';
```

## Como instalar o compositor

Não tem compositor? É fácil de instalar seguindo as instruções na página [download] (https://getcomposer.org/download/).