jQuery(function($) {
  var slider = {
    init: function() {
      slider.config = {
        container: "js-slider"
      };

      slider.setup();
    },

    setup: function() {
      console.log(slider.config.container);
    }
  };

  slider.init();
});
