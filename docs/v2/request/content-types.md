
How to Deal with Content-Types

By default Slim does not parse any other content-type other than the standard form data because PHP does not support it. That means if you attempt to post application/json you will not be able to access the data via $app->request->post(); 

To solve this
You must parse the content type yourself. You can either do this on a per-route basis

````
//For application/json
$data = json_decode($app->request->getBody());
````

 or use some pre-built middleware (https://github.com/slimphp/Slim-Middleware)
