Custom hooks may be created and invoked in a Slim application. When a custom hook is invoked with `applyHook()`, it will
invoke all callables assigned to that hook. This is exactly how the Slim application’s default hooks work. In this
example, I apply a custom hook called “my.hook.name”. All callables previously registered for this hook will be invoked.

    <?php
    $app = new \Slim\Slim();
    $app->applyHook('my.hook.name');

When you run the above code, any callables previously assigned to the hook "my.hook.name" will be invoked in order of
priority (ascending).

You should register callables to a hook before the hook is applied. Think of it this way: when you invoke the Slim
application’s `applyHook()` method, you are asking Slim to invoke all callables already registered for that hook name.
