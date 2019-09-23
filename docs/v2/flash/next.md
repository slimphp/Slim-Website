---
title: Next
l10n-link: flash-v2-next
l10n-lang: en
---
The Slim application’s `flash()` method sets a message that will be available in the next request’s view templates.
The message in this example will be available in the template variable `flash['error']`.

    <?php
    $app->flash('error', 'User email is required');
