jQuery(function($) {
  var smoothScroll = {
    init: function(duration) {
      smoothScroll.config = {
        navigation: $('.header'),
        element: $('.header a'),
        document: $('html, body'),
        documentHash: document.location.hash
      };

      smoothScroll.scroll(duration, smoothScroll.config.documentHash);
    },

    scroll: function(duration, hash) {
      function scrollTo(target) {
        var targetID = target.split("#").pop(),
            element = $("#smooth_" + targetID);
        if( element.length ) {
          event.preventDefault();
          smoothScroll.config.document.animate({
            scrollTop: element.offset().top - smoothScroll.config.navigation.outerHeight()
          }, duration);
        }
      }
      if(hash) {
        history.replaceState('', document.title, window.location.pathname);
        scrollTo(hash);
      }
      smoothScroll.config.element.on('click', function(event) {
        scrollTo($(this).attr('href'));
      });
    }
  };

  smoothScroll.init(300);
});
