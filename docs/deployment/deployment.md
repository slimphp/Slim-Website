---
title: Deployment
---
Congratulations! if you have made it this far, that means you have successfully built something 
awesome using Slim. However, the time to party has not come yet. We still have to push our 
application to the production server.

There are many ways to do this that are beyond the scope of this documentation. In 
this section, we provide some notes for various set-ups.

### Disable error display in production

The first thing to do is to tweak your settings (`src/settings.php` in the 
skeleton application) and ensure that you do not display full error details to the
public.

{% highlight php %}
  'displayErrorDetails' => false, // set to false in production
{% endhighlight %}

You should also ensure that your PHP installation is configured to not display
errors with the `php.ini` setting:

{% highlight ini %}
display_errors = 0
{% endhighlight %}



## Deploying to your own server

If you control your server, then you should set up a deployment process using any 
one of the many deployment system such as:

* Deploybot
* Capistrano
* Script controlled with Phing, Make, Ant, etc.


Review the [Web Servers](/docs/start/web-servers.html) documentation to configure your webserver.


## Deploying to a shared server

If your shared server runs Apache, then you need to create a `.htaccess` file 
in your web server root directory (usually named `htdocs`, `public`, `public_html`
or `www`) with the following content:

{% highlight apache %}
<IfModule mod_rewrite.c>
   RewriteEngine on
   RewriteRule ^$ public/     [L]
   RewriteRule (.*) public/$1 [L]
</IfModule>
{% endhighlight %}

(replace 'public' with the correct name of)

Now upload all the files that make up your Slim project to the webserver. As you
are on shared hosting, this is probably done via FTP and you can use any FTP client, 
such as Filezilla to do this.

