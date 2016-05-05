jQuery(function($) {
  var smoothScroll = {
    init: function(duration) {
      smoothScroll.config = {
        element: $('a[href^="#"]'),
        document: $('html, body'),
        navigation: $('.header')
      };

      smoothScroll.scroll(duration);
    },

    scroll: function(duration) {
      smoothScroll.config.element.on('click', function(event) {
        var target = $( $(this).attr('href') );

        if( target.length ) {
          event.preventDefault();
          smoothScroll.config.document.animate({
            scrollTop: target.offset().top - smoothScroll.config.navigation.outerHeight()
          }, duration);
        }
      });
    }
  };

  smoothScroll.init(300);
});
