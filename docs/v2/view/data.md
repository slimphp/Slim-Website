---
title: Data
---
<div class="alert alert-info">
    <strong>Heads Up!</strong> Rarely will you set or append data directly on the view object. Usually, you
    pass data to the view with the Slim application's `render()` method.
    See <a href="/pages/view-rendering-templates">Rendering Templates</a>.
</div>

The view object's `setData()` and `appendData()` methods inject data into the view object; the injected data is
available to view templates. View data is stored internally as a key-value array.

### Setting Data

The view object's `setData()` instance method will overwrite existing view data. You may use this method to set a
single variable to a given value:

    <?php
    $app->view->setData('color', 'red');

The view’s data will now contain a key “color” with value “red”. You may also use the view’s `setData()` method
to batch assign an entire array of data:

    <?php
    $app->view->setData(array(
        'color' => 'red',
        'size' => 'medium'
    ));

Remember, the view’s `setData()` method will replace all previous data.

### Appending Data

The view object also has a `appendData()` method that appends data to the view’s existing data. This method accepts
an array as its one and only argument:

    <?php
    $app->view->appendData(array(
        'foo' => 'bar'
    ));
