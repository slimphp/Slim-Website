---
title: Deployment
---
Congratulation! if you have made it this far, that means you have successfully built something 
awesome using slim . However, the time to party has not come yet . We still have to push our 
application to the production server . 

## Getting started 
The first thing to do is to tweak src/settings.php by turning display error details to false.

{% highlight php %}
  'displayErrorDetails' => false, // set to false in production
{% endhighlight %}


Next create a .htaccess file in your web server root directory (usually named public_html or www)
with the following content .
<IfModule mod_rewrite.c>
   RewriteEngine on
   RewriteRule ^$ public/    [L]
   RewriteRule (.*) public/$1 [L]
</IfModule>

Finally transfer all your slim project files to the web server root directory and you are good to go ! 
You can do that via the FTP client Filezilla . 
