---
title: Version Numbers
description: The Slim Framework for PHP 5 will migrate to a major, minor, revision versioning scheme
layout: post
---

Thus far, the Slim Framework’s version numbers have mostly adhered to the major.minor.revision scheme. However, sometimes the version numbers have strayed from this practice. Slim is my first large open source project, and it is an ongoing learning experience for me as Slim’s user base continues to flourish.

The latest stable Slim Framework release is version 1.5.1.4. The next planned release is tentatively 1.5.2. Because the tentative 1.5.2 release is still in the development branch, I will use this opportunity to return to the major.minor.revision scheme and tag it as version 1.6.0.

With version 1.6.0 and all subsequent releases, the version number will always use the major.minor.revision scheme.

Version 1.6.0 will introduce the `Slim::VERSION` constant. This constant will be a string version number (e.g. “1.6.0”) so you can reference the framework version in your code if necessary.
