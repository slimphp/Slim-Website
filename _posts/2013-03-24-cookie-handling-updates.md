---
title: Cookie handling updates
description: Learn about updates to cookie handling in Slim Framework applications.
layout: post
---

The next major point release to the Slim Framework will simplify how you get and set encrypted cookies. Previously, you would use the Slim application’s `getEncryptedCookie()` and `setEncryptedCookie()` methods to get or set an encrypted cookie.

In the next major point release, you will instead set the new `cookies.encrypt` application setting to true and use the Slim application’s existing `getCookie()` and `setCookie()` methods; all application cookies will be encrypted automatically.

And with the addition of the new \Slim\Helper\Set interface described in my previous post, you can easily change an encrypted cookie’s settings (name, value, expiration, path, domain, etc.) any time, either in the Slim app or its surrounding middleware; encryption is not applied until the cookies are serialized into raw HTTP headers after the last middleware is run, just before the HTTP response is returned to the client.

This change is available now in the develop branch for you to test and update your applications. The to-be-deprecated `getEncryptedCookie()` and `setEncryptedCookie()` methods will continue to work until the next major point release.
