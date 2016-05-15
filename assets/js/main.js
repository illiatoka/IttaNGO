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

  var switchProjects = {
    init: function() {
      switchProjects.config = {
        list: $('.projects-list'),
        content: $('.projects-content'),
        cssClass: 'active'
      };

      switchProjects.switchOnClick();
    },

    switchOnClick: function() {
      var config = switchProjects.config;
      switchProjects.config.list.on('click', 'a', function(event) {
        event.preventDefault();
        switchProjects.config.list.find('li').removeClass(config.cssClass);
        $(this).parent().addClass(config.cssClass);
      });
    }
  };

  smoothScroll.init(300);
  switchProjects.init();
});
