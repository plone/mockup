require([
  'jquery',
  'sinon',
  'jam/Patterns/src/registry',
  'js/bundles/toolbar'
], function($, sinon, registry) {

  var server = sinon.fakeServer.create();
  server.autoRespond = true;
  server.autoRespondAfter = 2000;

  function deserialize(text) {
    response = {};
    if (text) {
      $.each(text.split('&'), function(i, item) {
        item = item.split('=');
        response[item[0]] = item[1];
      });
    }
    return response;
  }
  $('script[type="text/x-ajax-respond"]', window.parent.document).each(function() {
    var $el = $(this);
    server.respondWith($el.data('url'), function(xhr) {
      var $body = $('<div/>').append($($el.html()).filter('#portal-columns')),
          request = deserialize(xhr.requestBody);
      if ($el.data('url') === 'sharing.html') {
        if (request['form.button.Search']) {
          $('#user-group-sharing-settings', $body).append($('' +
            '<tr class="odd">' +
            ' <td>' +
            '   <img src="img/group.png" alt="" title="" height="16"width="16" />' +
            '   Administrators' +
            '   <input type="hidden" name="entries.id:records" value="Administrators" />' +
            '   <input type="hidden" name="entries.type:records" value="group" />' +
            ' </td>' +
            ' <td class="listingCheckbox">' +
            '   <input class="noborder" type="checkbox" value="True" name="entries.role_Contributor:records" />' +
            ' </td>' +
            ' <td class="listingCheckbox">' +
            '   <input class="noborder" type="checkbox" value="True" name="entries.role_Editor:records" />' +
            ' </td>' +
            ' <td class="listingCheckbox">' +
            '   <input class="noborder" type="checkbox" value="True" name="entries.role_Reviewer:records" />' +
            ' </td>' +
            ' <td class="listingCheckbox">' +
            '   <input class="noborder" type="checkbox" value="True" name="entries.role_Reader:records" />' +
            ' </td>' +
            '</tr>'));
        }
      }
      xhr.respond(200, { "Content-Type": "html/html" }, '' +
          '<html><body>' + $body.html() + '</body></html>');
    });
    server.respond();
  });

  $(document).ready(function() {
    registry.scan($('body'));
  });

});
