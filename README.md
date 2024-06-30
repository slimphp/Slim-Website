# The Slim Framework Website

This is the repository for the Slim website ([slimframework.com][slimframework-url]).

## Want to contribute?

If you spot any errors, typos, or missing information, please submit [a pull request][pr-url].

### The documentation style guide

Unless otherwise stated, the documentation follows [the AP Stylebook][ap-stylebook-url].

### Are you a Microsoft Windows user

You need to make sure you have [Ruby Devkit Installed (MSYS2)](https://rubyinstaller.org/add-ons/devkit.html).

### Building and running the documentation locally

To run this site locally so that you can test your changes:

```bash
$ sudo gem install bundler
$ bundle install
```

Now, run the local [Jekyll][jekyll-url] installation:

```bash
$ bundle exec jekyll serve
```

Then, browse to http://localhost:4000 in your browser of choice.

#### Editing the site's CSS

The CSS uses Less and is managed by `grunt`.

Install the tool chain:

```bash
$ npm install -g grunt-cli
$ npm install
```

To change any CSS, edit the appropriate files in `assets\less` and then run:

```bash
grunt
```

You can also run `grunt watch` to automatically rebuild when you make CSS changes.

### Build instructions for deployment

```bash
bundle exec jekyll build
```

### Update the Algolia search database

Ensure you set the environment variable `ALGOLIA_API_KEY` before running these commands. 
See [algolia docs](https://community.algolia.com/jekyll-algolia/getting-started.html) for more information.

```bash
bundle install
bundle exec jekyll algolia
```

[ap-stylebook-url]: https://www.apstylebook.com
[jekyll-url]: https://jekyllrb.com
[pr-url]: https://github.com/slimphp/Slim-Website/compare
[slimframework-url]: https://slimframework.com