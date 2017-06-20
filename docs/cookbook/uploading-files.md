---
title: Uploading files using POST forms
---

Files that are uploaded using forms in POST requests can be retrieved with the
[`getUploadedFiles`](/docs/objects/request.html#uploaded-files) method of the
`Request` object.

When uploading files using a POST request, make sure your file upload form has the
attribute `enctype="multipart/form-data"` otherwise `getUploadedFiles()` will return an empty array.

If multiple files are uploaded for the same input name, add brackets after the input name in the HTML, otherwise
only one uploaded file will be returned for the input name by `getUploadedFiles()`.

Below is an example HTML form that contains both single and multiple file uploads.

<figure>
{% highlight php %}
<!-- make sure the attribute enctype is set to multipart/form-data -->
<form method="post" enctype="multipart/form-data">
    <!-- upload of a single file -->
    <p>
        <label>Add file (single): </label><br/>
        <input type="file" name="example1"/>
    </p>

    <!-- multiple input fields for the same input name, use brackets -->
    <p>
        <label>Add files (up to 2): </label><br/>
        <input type="file" name="example2[]"/><br/>
        <input type="file" name="example2[]"/>
    </p>

    <!-- one file input field that allows multiple files to be uploaded, use brackets -->
    <p>
        <label>Add files (multiple): </label><br/>
        <input type="file" name="example3[]" multiple="multiple"/>
    </p>

    <p>
        <input type="submit"/>
    </p>
</form>
{% endhighlight %}
<figcaption>Figure 1: Example HTML form for file uploads</figcaption>
</figure>
