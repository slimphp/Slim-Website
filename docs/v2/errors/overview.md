Let’s face it: sometimes things go wrong. It is important to intercept errors and respond to them appropriately. A
Slim application provides helper methods to respond to errors and exceptions.

### Important Notes

* A Slim application respects your existing `error_reporting` setting;
* A Slim application only handles errors and exceptions generated inside the Slim application;
* A Slim application converts errors into `ErrorException` objects and throws them;
* A Slim application uses its built-in error handler if its `debug` setting is true; otherwise, it uses the custom error handler.
