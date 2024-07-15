---
title: Templates
---

Slim does not have a view layer like traditional MVC frameworks. 
Instead, Slim's "view" _is the HTTP response_. 
Each Slim application route is responsible for preparing and returning an appropriate PSR-7 response object.

> Slim's "view" is the HTTP response.

That being said, the Slim project provides the [Twig-View](twig-view.html) and [PHP-View](php-view.html) components 
to help you render templates to a PSR-7 Response object.

## Other template systems

You are not limited to the `Twig-View` and `PHP-View` components. 
You can use any PHP template system provided that you ultimately 
write the rendered template output to the PSR-7 Response object's body.


