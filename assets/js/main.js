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

  var submitForm = {
    init: function(forms) {
      forms.find("button").prop("disabled", false);
      submitForm.handleEvents(forms);
    },

    handleEvents: function(forms) {
      forms.on("submit", function(e) {
        e.preventDefault();
        submitForm.sendData($(this));
      });
      forms.find(".required").on("focus", function(e) {
        submitForm.removeInfoMessage($(this));
      });
    },

    validate: function(form) {
      var isFormValid = true,
          isValidEmail = function(value) {return /^.+@.+\..+$/.test(value);}

      form.find(".required").each(function() {
        if ($.trim($(this).val()).length == 0) {
          isFormValid = false;
          if (!$(this).hasClass("error")) {
            $(this).addClass("error");
            if (this.name == "Name") {
              $(this).parent().prepend('<div><label class="error">Please enter your name</label></div>').find("div").fadeIn("fast");
            } else if (this.name == "Message") {
              $(this).parent().prepend('<div><label class="error">Please enter your message</label></div>').find("div").fadeIn("fast");
            } else if (this.name == "Email") {
              $(this).parent().prepend('<div><label class="error">Please enter your email address</label></div>').find("div").fadeIn("fast");
            }
          }
        } else {
          if (this.name == "Email" && !isValidEmail(this.value)) {
            $(this).addClass("error");
            $(this).parent().prepend('<div><label class="error">Please enter a valid email address</label></div>').find("div").fadeIn("fast");
            isFormValid = false;
          }
        }
      });

      return isFormValid;
    },

    sendData: function(form) {
      var request = false;

      if (submitForm.validate(form)) {
        if (request) {
          request.abort();
        }

        var $inputs = form.find("input, textarea, button"),
            $data = form.serialize(),
            $url = form.attr("action");

        $inputs.prop("disabled", true);

        request = $.ajax({
          type     : 'POST',
          cache    : false,
          url      : $url,
          data     : $data,
          statusCode: {
            0: function(data) {
              $inputs.prop("disabled", false).val("");
              form.find(".required").each(function() {
                submitForm.removeInfoMessage($(this));
              });
              submitForm.successMessage(form);
            },
            200: function(data) {
              $inputs.prop("disabled", false).val("");
              form.find(".required").each(function() {
                submitForm.removeInfoMessage($(this));
              });
              submitForm.successMessage(form);
            }
          }
        });
      }
    },

    successMessage(form) {
      var $target = form.find("input").first();
      $target.addClass("success");
      $target.parent().prepend('<div><label class="success">Form was successfully submitted!</label></div>').find("div").fadeIn("fast");
    },

    removeInfoMessage(input) {
      if (input.hasClass("error") || input.hasClass("success")) {
        input.removeClass("error success");
        input.parent().find('div').fadeOut("fast", function() {
          $(this).remove();
        });
      }
    }
  };

  smoothScroll.init(300);
  submitForm.init($(".js-form-submit"));
});
