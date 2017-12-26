---
title: Implante
---
Parabéns! Se você chegou até aqui, isso significa que você criou com sucesso 
algo incrível usando o Slim. No entanto, o tempo de festa ainda não chegou. Ainda 
temos que empurrar nossa aplicação para o servidor de produção.

Há muitas maneiras de fazer isso que estão além do escopo desta documentação. Nesta seção, 
fornecemos algumas notas para várias configurações.

### Desativar exibição de erro em produção

A primeira coisa a fazer é ajustar suas configurações (`src/settings.php` no aplicativo de 
esqueleto) e garantir que você não exiba detalhes de erro completo para o público.

```php
  'displayErrorDetails' => false, // configurado como falso em produção
```

Você também deve garantir que sua instalação PHP esteja configurada para não 
exibir erros com a configuração `php.ini`:

```ini
display_errors = 0
```



## Implantando em seu próprio servidor

Se você controla seu servidor, então você deve configurar um processo de implantação 
usando qualquer um dos muitos sistemas de implantação, como:

* Deploybot
* Capistrano
* Script controlado com Phing, Make, Ant, etc.


Revise a documentação [Web Servers] (/docs/start/web-servers.html) para configurar o seu webserver.


## Implantando para um servidor compartilhado

Se o seu servidor compartilhado executar o Apache, então você precisa criar um arquivo 
`.htaccess` no diretório raiz do seu servidor web (normalmente chamado` htdocs`, `public`,
`public_html`or `www`) com o seguinte conteúdo:

```apache
<IfModule mod_rewrite.c>
   RewriteEngine on
   RewriteRule ^$ public/     [L]
   RewriteRule (.*) public/$1 [L]
</IfModule>
```

(substituia 'public' pelo nome correto)

Agora, carregue todos os arquivos que compõem seu projeto Slim para o servidor web. 
Como você está em hospedagem compartilhada, isso provavelmente é feito via FTP e você 
pode usar qualquer cliente de FTP, como o Filezilla para fazer isso.