---
title: "Security Advisory: Slow parsing of nested file uploads in Slim-Psr7 and Slim 3"
description: Deeply nested file upload fields take exponential CPU time to parse in Slim-Psr7 1.8.0 and earlier, and in Slim 3.3.0 to 3.13.0. Please update to Slim-Psr7 1.8.1 or Slim 3.13.1 to resolve this issue.
layout: post
---

A security issue has recently been reported in the handling of uploaded files in Slim-Psr7 and Slim 3 that allows a single request to use a large amount of CPU time.

### Impact

Parsing deeply nested file upload fields takes CPU time that grows exponentially with the nesting depth. An unauthenticated client can send one multipart request to any route and tie up a worker for a significant time.

`UploadedFile::parseUploadedFiles()` normalises the multi-file arrays in `$_FILES`. It re-parses each nested level once for every entry at that level, so if every level holds a nested branch and a sibling file, the work doubles with each level of depth. This code runs for every request, before any routing or middleware, so routes that don't accept uploads are affected too. In Slim-Psr7 it is called from `ServerRequestFactory::createFromGlobals()`, and in Slim 3 from `Request::createFromEnvironment()`.

With PHP's default `max_file_uploads` of 20, one request used about 0.6 seconds of CPU on a test case. A higher `max_file_uploads` setting allows deeper nesting and makes each request more expensive. Even a few of these requests per second could keep every worker process busy on Apache prefork or a small PHP-FPM pool. Confidentiality and integrity are not affected.

Slim 3 has its own copy of this code in `Slim\Http\UploadedFile`. Slim 4 has no uploaded-file parsing of its own, so Slim 4 applications are affected only through Slim-Psr7.

Severity: Moderate, CVSS 5.3 (`CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:L`)


## Affected versions

* Slim-Psr7: all versions up to and including 1.8.0.
* Slim 3: all versions from 3.3.0 to 3.13.0 inclusive.

### Patches

The issue is fixed in Slim-Psr7 [1.8.1](https://github.com/slimphp/Slim-Psr7/releases/tag/1.8.1) and Slim [3.13.1](https://github.com/slimphp/Slim/releases/tag/3.13.1).

### Workarounds

If you can't upgrade yet, you can reduce or remove the exposure in these ways, starting with the most effective:

1. If the application never accepts uploads, set `file_uploads = Off`. PHP then leaves `$_FILES` empty and the vulnerable code never runs.
2. Lower `max_file_uploads` to the number of files the application needs. This limits how many files a request can carry, which reduces how deeply an attacker can nest them.
3. Set request timeouts and rate limits at the web server or proxy. These don't remove the bug, but they limit how many workers an attacker can tie up.

### Acknowledgments

We are grateful to and thank Chris Behm for reporting this issue.


## Further information

* [GHSA-v5c2-ff5f-p98x advisory on GitHub](https://github.com/slimphp/Slim-Psr7/security/advisories/GHSA-v5c2-ff5f-p98x)
