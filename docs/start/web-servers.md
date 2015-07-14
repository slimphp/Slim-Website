---
title: Web Servers
---

## Apache configuration

Ensure the `.htaccess` and `index.php` files are in the same public-accessible directory. The `.htaccess` file
should contain this code:

{% highlight text %}
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.php [QSA,L]
{% endhighlight %}

Additionally, make sure your virtual host is configured with the `AllowOverride` option so that the `.htaccess` rewrite rules can be used:

{% highlight text %}
AllowOverride All
{% endhighlight %}

## Nginx configuration

The nginx configuration file should contain this code (along with other settings you may need) in your `location` block:

{% highlight text %}
try_files $uri $uri/ /index.php?$query_string;
{% endhighlight %}

This assumes that Slim's `index.php` is in the root folder of your project (www root).

## HipHop Virtual Machine

Your HipHop Virtual Machine configuration file should contain this code (along with other settings you may need). Be sure you change the `SourceRoot` setting to point to your Slim app's document root directory.

{% highlight text %}
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
{% endhighlight %}

## IIS

Ensure the `Web.config` and `index.php` files are in the same public-accessible directory. The `Web.config` file should contain this code:

{% highlight xml %}
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
{% endhighlight %}

## lighttpd

Your lighttpd configuration file should contain this code (along with other settings you may need). This code requires lighttpd >= 1.4.24.

{% highlight text %}
url.rewrite-if-not-file = ("(.*)" => "/index.php/$0")
{% endhighlight %}

This assumes that Slim's `index.php` is in the root folder of your project (www root).
