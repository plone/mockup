define([
  'jquery',
  'js/patterns/backdrop',
  'js/patterns/modal'
], function($, Backdrop) {

  // modal template for plone
  function createTemplate($modal, options) {
    var $content = $modal.html();

    options = $.extend({
      title: 'h1.documentFirstHeading',
      buttons: '.formControls > input[type="submit"]',
      content: '#content'
    }, options || {});

    $modal
      .html('<div class="modal-header">' +
            '  <a class="close">&times;</a>' +
            '  <h3></h3>' +
            '</div>' +
            '<div class="modal-body"></div>' +
            '<div class="modal-footer"></div>');


    $('.modal-header > h3', $modal).html($(options.title, $content).html());
    $('.modal-body', $modal).html($(options.content, $content).html());
    $(options.title, $modal).remove();
    $('.modal-header > a.close', $modal)
      .off('click')
      .on('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        $(e.target).trigger('destroy.modal.patterns');
      });

    // cleanup html
    $('.row', $modal).removeClass('row');

    $(options.buttons, $modal).each(function() {
      var $button = $(this);
      $button
        .on('click', function(e) {
          e.stopPropagation();
          e.preventDefault();
        })
        .clone()
        .appendTo($('.modal-footer', $modal))
        .off('click').on('click', function(e) {
          e.stopPropagation();
          e.preventDefault();
          $button.trigger('click');
        });
      $button.hide();
    });

  }

  function createAjaxForm(modal, modalInit, modalOptions, options) {
    options = $.extend({
      buttons: {},
      timeout: 5000,
      formError: '.portalMessage.error'
    }, options);

    $.each(options.buttons, function(buttons, buttonsOptions) {
      buttonsOptions = $.extend({}, options, buttonsOptions);
      $(buttons, modal.$modal).each(function(button) {
        var $button = $(this);

        // pass button that was clicked when submiting form
        var extraData = {};
        extraData[$button.attr('name')] = $button.attr('value');

        $button.on('click', function(e) {
          e.stopPropagation();
          e.preventDefault();

          // loading "spinner"
          var backdrop = modal.$modal.data('patterns-backdrop');
          if (!backdrop) {
            backdrop = new Backdrop(modal.$modal, {
              closeOnEsc: false,
              closeOnClick: false
            });
            backdrop.$backdrop
              .html('')
              .append($('' +
                  '<div class="progress progress-striped active">' +
                  '  <div class="bar" style="width: 100%;"></div>' +
                  '</div>')
                .css({
                  position: 'absolute',
                  left: modal.$modal.width() * 0.1,
                  top: modal.$modal.height()/2 + 10,
                  width: modal.$modal.width() * 0.8
                }));
            modal.$modal.data('patterns-backdrop', backdrop);
          } else {
            modal.$modal.append(backdrop.$backdrop);
          }
          backdrop.show();

          if ($.nodeName($button[0], 'input')) {
            $button.parents('form').ajaxSubmit({
              timeout: buttonsOptions.timeout,
              dataType: 'html',
              data: extraData,
              url: $button.parents('form').attr('action'),
              error: function(xhr, textStatus, errorStatus) {
                if (textStatus === 'timeout' && buttonsOptions.onTimeout) {
                  buttonsOptions.onTimeout(modal, xhr, errorStatus);

                // on "error", "abort", and "parsererror"
                } else if (buttonsOptions.onError) {
                  buttonsOptions.onError(xhr, textStatus, errorStatus);
                } else {
                  console.log('error happened do something');
                }
              },
              success: function(response, state, xhr, form) {
                var responseBody = $((/<body[^>]*>((.|[\n\r])*)<\/body>/im).exec(response)[0]
                        .replace('<body', '<div').replace('</body>', '</div>'));

                // if error is found
                if ($(buttonsOptions.formError, responseBody).size() !== 0) {
                  if (buttonsOptions.onFormError) {
                    buttonsOptions.onFormError(modal, responseBody, state, xhr, form);
                  } else {
                    modal.$modal.html(responseBody.html());
                    modalInit(modal, modalInit, modalOptions);
                    modal.positionModal();
                    registry.scan(modal.$modal);
                  }

                // custom success function
                } else if (buttonsOptions.onSuccess) {
                  buttonsOptions.onSuccess(modal, responseBody, state, xhr, form);

                } else {
                  $button.trigger('destroy.modal.patterns');
                }
              }
            });
          } else if ($.nodeName($button[0], 'a')) {
            $.ajax({
              url: $button.attr('href'),
              error: function(xhr, textStatus, errorStatus) {
                if (textStatus === 'timeout' && buttonsOptions.onTimeout) {
                  buttonsOptions.onTimeout(modal, xhr, errorStatus);

                // on "error", "abort", and "parsererror"
                } else if (buttonsOptions.onError) {
                  buttonsOptions.onError(xhr, textStatus, errorStatus);
                } else {
                  console.log('error happened do something');
                }
              },
              success: function(response, state, xhr) {
                var responseBody = $((/<body[^>]*>((.|[\n\r])*)<\/body>/im).exec(response)[0]
                        .replace('<body', '<div').replace('</body>', '</div>'));

                // if error is found
                if ($(buttonsOptions.formError, responseBody).size() !== 0) {
                  if (buttonsOptions.onFormError) {
                    buttonsOptions.onFormError(modal, responseBody, state, xhr);
                  } else {
                    modal.$modal.html(responseBody.html());
                    modalInit(modal, modalInit, modalOptions);
                    modal.positionModal();
                    registry.scan(modal.$modal);
                  }

                // custom success function
                } else if (buttonsOptions.onSuccess) {
                  buttonsOptions.onSuccess(modal, responseBody, state, xhr);

                } else {
                  $button.trigger('destroy.modal.patterns');
                }
              }
            });
          }

        });
      });
    });
  }

  function init(selector, callback, modalOptions) {
    $(selector).addClass('modal-trigger').modal(modalOptions);
    $(document).on('show.modal.patterns', selector + '.modal-trigger', function(e, modal) {
      callback(modal, callback);
    });
  }

  return {
    template: createTemplate,
    form: createAjaxForm,
    init: init
  };

});
