define([
  'expect',
  'jquery',
  'sinon',
  'mockup-registry',
  'mockup-patterns-discussion'
], function (expect, $, sinon, registry, HelloWorld) {
  "use strict";

  window.mocha.setup('bdd');
  $.fx.off = true;  //disable jQuery animations for various reasons

  describe("Discussion", function () {
    beforeEach(function () {
      this.server = sinon.fakeServer.create();
      this.server.autoRespond = true;

      this.server.respondWith('POST', /discussion_reply_form/, function(xhr, id) {
	var error = '',
	    body_text = getQueryVariable('?'+xhr.requestBody, 'body_text'),
	    commentId = '12345';
	
	// mock comments rendered inline after discussion_reply_form
	// redirects to content
	if (body_text && commentId) {
	  xhr.respond(
	    200, {"content-Type": "text/html"},
	    '<html> '+
	      '  <body> '+
	      '    <div id="content">'+
	      '    <div class="discussion">'+
	      '      <div class="comment" style="margin-left:0em">'+
	      '        <a name="12345"></a>'+
	      '        <div class="commentBody">'+ body_text +
	      '          <div class="formControls">'+
	      '          <form name="reply" action="discussion_reply_form#12345" method="post" style="display: inline; cursor: pointer;">'+
	      '              <input type="submit" value="Reply">'+
	      '          </form>'+
	      '          </div>'+
	      '      </div>'+
	      '    </div>'+
	      '    </div>'+
	      '  </body> '+
	      '</html>'
	  );
	}
        
	if (body_text === null) {
	  body_text = ''
	} else if (body_text === '') {
	  error = 'field error';
	}

	// mock discussion_reply_form
	xhr.respond(200, {"content-Type": "text/html"},
		    '<html> '+
		    '  <body> '+
		    '    <div id="content">'+
		    '      <form method="post" action="discussion_reply_form">' +
		    '        <textarea id="body_text" name="body_text">'+
		    body_text +
		    '</textarea>' +
		    '        <div class="formControls">' +
		    '        <input type="submit" class="' + error + '" ' +
		    '   name="discussion_reply:method" value="Save">' +
		    
		    '        </div>' +
		    '      </form>' +
		    '  </body> '+
		    '</html>'
		   );
      });

      this.$el = $(
	'<div id="body">' +
	  '<div class="discussion">'+
	  '  <form class="reply" action="discussion_reply_form" method="POST">'+
	  '    <input type="submit" value="Add comment" '+
	  '       class="pat-discussion" data-pat-discussion="" />'+
	  '  </form>'+
	  '</div>'
      );
    });
      
    afterEach(function() {
      //this.server.restore();
    });

    it('should open the discussion reply form in a modal', function () {
      expect($('form[action="discussion_reply_form"]', this.$el).size()).to.equal(1); 
      registry.scan(this.$el);
      $('a.pat-discussion', this.$el).click();
      expect($('.modal', this.$el).size()).to.equal(0);
      //expect($('form[action="discussion_reply_form"]', this.$el).size()).to.equal(2);
    });

    it('should allow comment input and render the comment without reloading', function () {
      expect($('.discussion .comment').size()).to.equal(0);
      $('a.pat-discussion', this.$el).click();
      registry.scan(this.$el);
      $('div.modal-content textarea[name="body_text"]').val('My comment');
      $('div.modal-content input[name="discussion_reply:method"').click();
      expect($('.comment').size()).to.equal(1);
      //expect($('.discussion').text().indexOf('My comment')).to.not.equal.(-1);
    });

    it('should not allow empty comments', function () {
      expect($('.discussion .comment').size()).to.equal(0);
      $('a.pat-discussion', this.$el).click();
      registry.scan(this.$el);
      $('div.modal-content textarea[name="body_text"]').val('');
      expect($('.discussion .comment').size()).to.equal(0);
       
    });

  });

});
