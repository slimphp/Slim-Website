---
layout: default
title: Web Servers
---

# Apache configuration

Ensure the `.htaccess` and `index.php` files are in the same public-accessible directory. The `.htaccess` file
should contain this code:

    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.php [QSA,L]

Additionally, make sure your virtual host is configured with the `AllowOverride` option so that the `.htaccess` rewrite rules can be used:

    AllowOverride All

# Nginx configuration

The nginx configuration file should contain this code (along with other settings you may need) in your `location` block:

    try_files $uri $uri/ /index.php?$args;

This assumes that Slim's `index.php` is in the root folder of your project (www root).

# HipHop Virtual Machine

Your HipHop Virtual Machine configuration file should contain this code (along with other settings you may need). Be sure you change the `SourceRoot` setting to point to your Slim app's document root directory.

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

# IIS

Ensure the `Web.config` and `index.php` files are in the same public-accessible directory. The `Web.config` file should contain this code:

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

# lighttpd

Your lighttpd configuration file should contain this code (along with other settings you may need). This code requires lighttpd >= 1.4.24.

    url.rewrite-if-not-file = ("(.*)" => "/index.php/$0")

This assumes that Slim's `index.php` is in the root folder of your project (www root).
