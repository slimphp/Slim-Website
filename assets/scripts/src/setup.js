(function ($) {
    var origTitle = document.title;
    window.onblur = function(e) {
        document.title = '♬ Baby come back! Any kind of fool could see... ♬';
    };
    window.onfocus = function(e) {
        document.title = origTitle;
    };
})(jQuery);
