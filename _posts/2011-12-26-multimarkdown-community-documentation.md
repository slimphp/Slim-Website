---
title: MultiMarkdown Community Documentation
description: The Slim Framework for PHP 5 documentation has moved into the core Git repository and is written in MultiMarkdown format
layout: post
---

The Slim Framework documentation has moved into the Git repository as of v1.5.2 (currently in the development branch). This change makes it easy for the community to suggest additions or changes to the framework documentation.

The documentation files are located in the `docs/` directory. Each documentation section has its own MultiMarkdown file. The `index.txt` manifest file specifies the order and hierarchy of the documentation files. Use the MultiMarkdown `mmd_merge` utility to consolidate the documentation files into your preferred format (e.g. HTML, LaTeX, PDF, ODT, or OPML); this is how I generate the HTML documentation. Be sure you download and install both MultiMarkdown and the MultiMarkdown Utility packages.

[Get MultiMarkdown](https://github.com/fletcher/peg-multimarkdown/downloads/)
