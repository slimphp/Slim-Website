(function ($) {
  $(window).ready(function() {
    $('.docs ul.toc-links li a').each(function() {
      // flag active menu item
      if(this.href === window.location.href) {
        $(this).addClass('active');
      }

      // change active menu item if clicking on a url with a fragment
      if(this.href.indexOf('#') !== -1) {
        $(this).click(function() {
          $('.docs ul.toc-links li a.active').removeClass('active');
          $(this).addClass('active');
        });
      }
    });
  });
})(jQuery);
