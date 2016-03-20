---
title: Application
---

The Application, (or `Slim\App`) is what routes requests to your callbacks or controllers.

## The Application Configuration

The Application accepts just one argument. If you pass it a Dependency Container, your app will use that.
If you pass it an array or nothing, a Dependency Container will be created automatically.

To see the available application settings, please refer to the `settings` service in the [Slim Dependency Container Services](/docs/concepts/di.html#required-services).
