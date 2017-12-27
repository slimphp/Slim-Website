---
title: Servidores Web
---

É típico usar o padrão do controlador frontal para canalizar solicitações HTTP 
apropriadas recebidas pelo seu servidor web para um único arquivo PHP. As 
instruções abaixo explicam como dizer ao seu servidor web que envie solicitações 
HTTP ao seu arquivo do controlador frontal do PHP.

## Servidor embutido PHP

Execute o seguinte comando no terminal para iniciar o servidor web localhost, 
assumindo que `./Public/` seja um diretório acessível ao público com o arquivo 
`index.php`:

```bash
php -S localhost:8888 -t public public/index.php
```

Se você não estiver usando `index.php` como seu ponto de entrada, mude adequadamente.

# Configuração do Apache

Certifique-se de que os arquivos `.htaccess` e `index.php` estejam no mesmo diretório 
acessível ao público. O arquivo `.htaccess` deve conter este código:

```
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.php [QSA,L]
```

Verifique se o seu host virtual Apache está configurado com a opção `AllowOverride` para 
que as regras de reescrita` .htaccess` possam ser usadas:

```
AllowOverride All
```

## Configuração Nginx

Este é um exemplo de configuração do host virtual Nginx para o domínio `example.com`.
Ele escuta as conexões HTTP de entrada na porta 80. Assume que um servidor PHP-FPM está 
sendo executado na porta 9000. Você deve atualizar as diretivas `server_name`,` error_log`, 
`access_log` e `root` com seus próprios valores. A diretiva `root` é o caminho para o 
diretório raiz do documento público do seu aplicativo; O arquivo do controlador frontal 
do `index.php` do seu Slim deve estar neste diretório.

```
server {
    listen 80;
    server_name example.com;
    index index.php;
    error_log /path/to/example.error.log;
    access_log /path/to/example.access.log;
    root /path/to/public;

    location / {
        try_files $uri /index.php$is_args$args;
    }

    location ~ \.php {
        try_files $uri =404;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param SCRIPT_NAME $fastcgi_script_name;
        fastcgi_index index.php;
        fastcgi_pass 127.0.0.1:9000;
    }
}
```

## Máquina Virtual HipHop

Seu arquivo de configuração da máquina virtual HipHop deve conter esse código (juntamente com outras configurações que você pode precisar). Certifique-se de alterar a configuração `SourceRoot` para apontar para o diretório raiz do documento do seu aplicativo Slim.

```
Server {
    SourceRoot = /path/to/public/directory
}

ServerVariables {
    SCRIPT_NAME = /index.php
}

VirtualHost {
    * {
        Pattern = .*
        RewriteRules {
                * {
                        pattern = ^(.*)$
                        to = index.php/$1
                        qsa = true
                }
        }
    }
}
```

## IIS


Certifique-se de que os arquivos `Web.config` e` index.php` estejam no mesmo diretório acessível ao público. O arquivo `Web.config` deve conter este código:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="slim" patternSyntax="Wildcard">
                    <match url="*" />
                    <conditions>
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                    </conditions>
                    <action type="Rewrite" url="index.php" />
                </rule>
            </rules>
        </rewrite>
    </system.webServer>
</configuration>
```

## lighttpd

Seu arquivo de configuração lighttpd deve conter esse código (juntamente com outras configurações que você pode precisar). Este código requer lighttpd> = 1.4.24.

```
url.rewrite-if-not-file = ("(.*)" => "/index.php/$0")
```

Isso pressupõe que o `index.php` do Slim está na pasta raiz do seu projeto (www root).
