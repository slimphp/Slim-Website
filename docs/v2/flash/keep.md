---
title: Keep
l10n-link: flash-v2-keep
l10n-lang: en
---
This method tells the Slim application to keep existing flash messages set in the previous request so they will be
available to the next request. This method is helpful for persisting flash messages across HTTP redirects.

    <?php
    $app->flashKeep();
