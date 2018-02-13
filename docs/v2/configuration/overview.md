There are two ways to apply settings to the Slim application. First during Slim application instantiation and second
after instantiation. All settings can be applied at instantiation time by passing Slim’s constructor an associative
array. All settings can be retrieved and modified after instantiation, however some of them can not be done simply by
using the config application instance method but will be demonstrated as necessary below. Before I list the available
settings, I want to quickly explain how you may define and inspect settings with your Slim application.

### During Instantiation

To define settings upon instantiation, pass an associative array into the Slim constructor.

    <?php
    $app = new Slim(array(
        'debug' => true
    ));

### After Instantiation

To define settings after instantiation, the majority can use the config application instance method; the first
argument is the setting name and the second argument is the setting value.

    <?php
    $app->config('debug', false);

You may also define multiple settings at once using an associative array:

    <?php
    $app->config(array(
        'debug' => true,
        'templates.path' => '../templates'
    ));

To retrieve the value of a setting, you also use the config application instance method; however, you only pass one
argument - the name of the setting you wish to inspect. If the setting you request does not exist, `null` is returned.

    <?php
    $settingValue = $app->config('templates.path'); //returns "../templates"

You are not limited to the settings shown below; you may also define your own.
