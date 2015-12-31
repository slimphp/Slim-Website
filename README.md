# Slim-Website

This is the repository for the Slim website at www.slimframework.com.


## Contributing

If you spot any errors, typos or missing information, please submit a pull
request.

### Running locally

To run this site locally so that you can test your changes:

* `$ sudo gem install bundler`
* `$ bundle install`

Now, run the local jekyll:

    $ bundle exec jekyll serve

and browse to http://localhost:4000

#### CSS

The CSS uses Less and is managed by `grunt`.

Install the tool chain:

* `$ npm install -g grunt-cli`
* `$ npm install`


To change any CSS, edit the appropriate files in `assets\less` and then run:

* `$ grunt`

You can also run `grunt watch` to automatically rebuild when you make CSS
changes.
