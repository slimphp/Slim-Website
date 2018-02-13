A Slim application delegates rendering of templates to its view object. A Slim application view is a subclass
of `\Slim\View` that implements this interface:

    <?php
    public render(string $template);

The view object's `render` method must return the rendered content of the template specified by its
`$template` argument.
