---
title: Web Servers
---

It is typical to use the front-controller pattern to funnel appropriate HTTP
requests received by your web server to a single PHP file. The instructions
below explain how to tell your web server to send HTTP requests to your PHP
front-controller file.

## PHP built-in server

Run the following command in terminal to start localhost web server,
assuming `./public/` is public-accessible directory with `index.php` file:

```bash
cd public/
php -S localhost:8888
```

If you are not using `index.php` as your entry point then change appropriately.

> **Warning:** The built-in web server was designed to aid application development. 
It may also be useful for testing purposes or for application demonstrations that are run in controlled environments. It is not intended to be a full-featured web server. It should not be used on a public network.

## Apache configuration

Ensure that the Apache `mod_rewrite` module is installed and enabled.
In order to enable `mod_rewrite` you can type the following command in the terminal:

```bash
sudo a2enmod rewrite
sudo a2enmod actions
```

Ensure your `.htaccess` and `index.php` files are in the same
public-accessible directory. The `.htaccess` file should contain this code:

```bash
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.php [QSA,L]
```

To ensure that the `public/` directory does not appear in the
URL, you should add a second `.htaccess` file above the `public/`
directory with the following internal redirect rule:

```bash
RewriteEngine on
RewriteRule ^$ public/ [L]
RewriteRule (.*) public/$1 [L]
```

These `.htaccess` files require URL rewriting.

Make sure to enable Apache's `mod_rewrite` module and your virtual host is configured
with the `AllowOverride` option so that the `.htaccess` rewrite rules can be used:
To do this, the file `/etc/apache2/apache2.conf` must be opened in an editor with root privileges.

Change the `<Directory ...>` directive from `AllowOveride None` to `AllowOveride All`.

**Example**

```bash
<Directory /var/www/>
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

Finally, the configuration of Apache must be reloaded.
To restart Apache web server, enter:

```bash
sudo service apache2 restart
```

This command works on most Debian/Ubuntu variants.
For all other Linux distributions, please consult 
the documentation of your specific Linux distribution 
to find out how to restart Apache.

**Running in a sub-directory**

This example assumes that the front controller is located in `public/index.php`.

To "redirect" the sub-directory to the front-controller create a second
`.htaccess` file above the `public/` directory. 

The second `.htaccess` file should contain this code:

```bash
RewriteEngine on
RewriteRule ^$ public/ [L]
RewriteRule (.*) public/$1 [L]
```

You may also set the base path so that the router can 
match the URL from the browser with the path set in the route registration.
This is done with the `setBasePath()` method.

```php
$app->setBasePath('/myapp');
```

**Read more**

* [Running Slim 4 in a subdirectory](https://akrabat.com/running-slim-4-in-a-subdirectory/)
* [Slim 4 base path middleware](https://github.com/selective-php/basepath)

## Nginx configuration

This is an example Nginx virtual host configuration for the domain `example.com`.
It listens for inbound HTTP connections on port 80. It assumes a PHP-FPM server
is running on port 9123. You should update the `server_name`, `error_log`,
`access_log`, and `root` directives with your own values. The `root` directive
is the path to your application's public document root directory; your Slim app's
`index.php` front-controller file should be in this directory.

```bash
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
        fastcgi_pass 127.0.0.1:9123;
    }
}
```

## Caddy

The Caddy configuration is located in `/etc/caddy/Caddyfile`. Caddy requires `php-fpm` and have the FPM server running.
Assuming the FPM socket is at `/var/run/php/php-fpm.sock`, and your application is located in `/var/www`, the following configuration should work out of the box.

### HTTP configuration listening for any request
```bash
:80 {
        # Set-up the FCGI location
        php_fastcgi unix//var/run/php/php-fpm.sock
        # Set this path to your site's directory.
        root * /var/www/public
}
```

### HTTPS configuration with self-signed certificate
```bash
:443 {
        tls internal
        # Set-up the FCGI location
        php_fastcgi unix//var/run/php/php-fpm.sock
        # Set this path to your site's directory.
        root * /var/www/public
}
```

## IIS

Ensure the `Web.config` and `index.php` files are in the same public-accessible directory. The `Web.config` file should contain this code:

```bash
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

Your lighttpd configuration file should contain this code (along with other settings you may need). This code requires lighttpd >= 1.4.24.

```bash
url.rewrite-if-not-file = ("(.*)" => "/index.php/$0")
```

This assumes that Slim's `index.php` is in the root folder of your project (www root).

## Run From a Sub-Directory

If you want to run your Slim Application from a sub-directory in your Server's Root instead of creating a Virtual Host, 
you can configure `$app->setBasePath('/path-to-your-app')` right after the `AppFactory::create()`.
Assuming that your Server's Root is `/var/www/html/` and path to your Slim Application is `/var/www/html/my-slim-app`
you can set the base path to `$app->setBasePath('/my-slim-app')`.

```php
<?php

use Slim\Factory\AppFactory;
// ...

$app = AppFactory::create();
$app->setBasePath('/my-slim-app');

// ...

$app->run();
```
