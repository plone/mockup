define([
  'expect',
  'jquery',
  'mockup-registry',
  'mockup-patterns-upload'
], function(expect, $, registry, Upload) {
  'use strict';

  window.mocha.setup('bdd');
  $.fx.off = true;

/* ==========================
   TEST: Upload
  ========================== */

  describe('Upload', function () {

    describe('Div', function () {
      beforeEach(function() {
        this.$el = $('' +
          '<div>' +
          '  <div class="pat-upload"' +
          '    data-pat-upload="url: /upload">' +
          '  </div>' +
          '</div>');
      });
      afterEach(function() {
        this.$el.remove();
      });

      it('default attributes', function() {
        expect($('.pat-upload', this.$el).hasClass('upload')).to.be.equal(false);
        expect($('.upload-area', this.$el).length).to.equal(0);
        expect($('.dz-message', this.$el).length).to.equal(0);
        // initialize pattern
        registry.scan(this.$el);

        expect($('.pat-upload', this.$el).hasClass('upload')).to.be.equal(true);
        expect($('.upload-area', this.$el).length).to.equal(1);
        expect($('.upload-area', this.$el).hasClass('dz-clickable')).to.be.equal(true);
        expect($('.dz-message', this.$el).length).to.equal(1);
        expect($('.dz-message', this.$el).hasClass('dz-default')).to.be.equal(false);
        expect($('.dz-message p', this.$el).html()).to.equal('Drop files here...');
      });
      it('change className data option', function() {
        var attr = $('.pat-upload', this.$el).attr('data-pat-upload');
        $('.pat-upload', this.$el).attr('data-pat-upload', attr + '; className: drop-zone');
        registry.scan(this.$el);
        expect($('.pat-upload', this.$el).hasClass('drop-zone')).to.be.equal(true);
      });
      it('update clickable data option to false', function() {
        var attr = $('.pat-upload', this.$el).attr('data-pat-upload');
        $('.pat-upload', this.$el).attr('data-pat-upload', attr + '; clickable: false');
        registry.scan(this.$el);
        expect($('.pat-upload', this.$el).hasClass('dz-clickable')).to.be.equal(false);
      });
      it('update clickable data option to false', function() {
        var attr = $('.pat-upload', this.$el).attr('data-pat-upload');
        $('.pat-upload', this.$el).attr('data-pat-upload', attr + '; clickable: false');
        registry.scan(this.$el);
        expect($('.pat-upload', this.$el).hasClass('dz-clickable')).to.be.equal(false);
      });
      it('update wrap data option to true', function() {
        expect($('.pat-upload', this.$el).parent().hasClass('upload-wrapper')).to.be.equal(false);
        var attr = $('.pat-upload', this.$el).attr('data-pat-upload');
        $('.pat-upload', this.$el).attr('data-pat-upload', attr + '; wrap: true');
        registry.scan(this.$el);
        expect($('.pat-upload', this.$el).parent().hasClass('upload-wrapper')).to.be.equal(true);
      });
      it('update autoCleanResults data option to true', function() {
        var attr = $('.pat-upload', this.$el).attr('data-pat-upload');
        $('.pat-upload', this.$el).attr('data-pat-upload', attr + '; autoCleanResults: true');
        registry.scan(this.$el);
        //TODO
      });

    });

  });

/* ==========================
   TEST: Widget
  ========================== */

  describe('Widget', function () {

    describe('NoExisting', function () {
      beforeEach(function() {
        this.$el = $('' +
          '<div>' +
          '  <div class="pat-upload"' +
          '    data-pat-upload="{&quot;url&quot;: &quot;/upload&quot;, &quot;isWidget&quot;: true, &quot;maxFiles&quot;: 3, ' +
          '&quot;showTitle&quot;: false, &quot;paramName&quot;: &quot;dummy&quot;, &quot;autoCleanResults&quot;: false}">' +
          '  </div>' +
          '</div>');
      });
      afterEach(function() {
        this.$el.remove();
      });

      it('new elements', function() {
        // initialize pattern
        registry.scan(this.$el);
        expect(this.$el.find('p.help').is(':visible')).to.equal(false);
        expect(this.$el.find('div.path').is(':visible')).to.equal(false);
        expect(this.$el.find('.upload-all').is(':visible')).to.equal(false);
        var uploaded = this.$el.find('div.uploaded');
        expect(uploaded.length).to.equal(1);
        expect(this.$el.find('input[name="dummyuploaded"]').val()).to.equal('');

      });

    });

    describe('SingleFile', function () {
      beforeEach(function() {
        this.$el = $('' +
          '<div>' +
          '  <div class="pat-upload"' +
          '    data-pat-upload="{&quot;url&quot;: &quot;/upload&quot;, &quot;isWidget&quot;: true, &quot;maxFiles&quot;: 1, ' +
          '&quot;showTitle&quot;: false, &quot;paramName&quot;: &quot;dummy&quot;, &quot;autoCleanResults&quot;: false}">' +
          '  </div>' +
          '</div>');
      });
      afterEach(function() {
        this.$el.remove();
      });

      it('single file', function() {
        // initialize pattern
        registry.scan(this.$el);
        var textmsg = this.$el.find('div.dz-message').find('p');
        expect(textmsg.text()).to.equal('Drop file here...');

      });

    });

    describe('Existing', function () {
      beforeEach(function() {
        this.$el = $('' +
          '<div>' +
          '  <div class="pat-upload"' +
          '    data-pat-upload="{&quot;url&quot;: &quot;/upload&quot;, &quot;isWidget&quot;: true, &quot;maxFiles&quot;: 3, ' +
          '&quot;showTitle&quot;: false, &quot;paramName&quot;: &quot;dummy&quot;, &quot;autoCleanResults&quot;: false,' +
          ' &quot;existing&quot;: [{&quot;url&quot;: &quot;/downloadexisting&quot;,' +
          ' &quot;size&quot;: 2292263,' +
          ' &quot;name&quot;: &quot;testfile.txt&quot;,' +
          ' &quot;title&quot;: &quot;testfile.txt&quot;}]}">' +
          '  </div>' +
          '</div>');
      });
      afterEach(function() {
        this.$el.remove();
      });

      it('new elements', function() {
        // initialize pattern
        registry.scan(this.$el);
        expect(this.$el.find('.uploaded').length).to.not.equal(0);
        var uploaded = this.$el.find('.uploaded');
        // 'Div' element to hold existing file info is added
        var existing = uploaded.children();
        expect(existing.hasClass('existfileupload')).to.equal(true);
        // 'a' element with proper 'href' is added
        expect(existing.find('a').attr('href')).to.equal('/downloadexisting');
        // Filename is added
        expect(existing.find('span.filename').html()).to.equal('testfile.txt');
        var hidden = this.$el.find('input[name="dummyuploaded"]');
        expect(hidden.val()).to.equal('[{"name":"testfile.txt","size":2292263,"url":"/downloadexisting"}]');
//        console.log(hidden);
        // Now delete the file
        existing.find('button.remove-item').trigger('click');
        // Input hidden element is updated
        expect(hidden.val()).to.equal('[]');

      });

    });

  });
});
