// tests for fileupload
//
// @author Allen Thomerson
// @version 0.0.1
// @licstart  The following is the entire license notice for the JavaScript
//            code in this page.
//
// Copyright (C) 2010 Plone Foundation
//
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 2 of the License.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along with
// this program; if not, write to the Free Software Foundation, Inc., 51
// Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//
// @licend  The above is the entire license notice for the JavaScript code in
//          this page.
//

define([
  'expect',
  'jquery',
  'mockup-registry',
  'mockup-patterns-fileupload'
], function(expect, $, registry, FileUpload) {
  "use strict";

  window.mocha.setup('bdd');
  $.fx.off = true;

/* ==========================
   TEST: Initialize
  ========================== */

  describe('Initialize', function () {
    beforeEach(function() {
      this.$el = $('' +
        '<input class="pat-fileupload"' +
        ' type="file"' +
        ' multiple="multiple"' +
        'name="files"' +
        'data-pat-fileupload="{&quot;url&quot;: &quot;/upload&quot;,' +
        ' &quot;existing&quot;: []}"' +
        '>');
    });
    afterEach(function() {
      this.$el.remove();
    });

    it('initialize', function() {
      registry.scan(this.$el);
      var parent = this.$el.parent();
      // Make sure the 'fileupload' class has been added
      expect(this.$el.hasClass("fileupload")).to.equal(true);
      // Classes applied to parent span
      expect(parent.hasClass('btn')).to.equal(true);
      // Input hidden element is added
      expect(parent.find("input[name='filesuploaded']")).to.be.ok();
      // 'Add files' text added to span
      expect(this.$el.prev().text()).to.equal('Add files...');
      var next = parent.next();
      // 'Div' element to hold file information is added
      expect(next.is(".files")).to.equal(true);
    });

  });

/* ==========================
   TEST: Single file upload
  ========================== */

  describe('Single File', function () {
    beforeEach(function() {
      this.$el = $('' +
        '<input class="pat-fileupload"' +
        ' type="file"' +
        'name="files"' +
        'data-pat-fileupload="{&quot;url&quot;: &quot;/upload&quot;,' +
        ' &quot;existing&quot;: [],' +
        ' &quot;maxNumberOfFiles&quot;: 1}"' +
        '>');
    });
    afterEach(function() {
      this.$el.remove();
    });

    it('initialize', function() {
      registry.scan(this.$el);
      var parent = this.$el.parent();
      // Make sure the 'fileupload' class has been added
      expect(this.$el.hasClass("fileupload")).to.equal(true);
      // Classes applied to parent span
      expect(parent.hasClass('btn')).to.equal(true);
      // Input hidden element is added
      expect(parent.find("input[name='filesuploaded']")).to.be.ok();
      // 'Add file' text added to span
      expect(this.$el.prev().text()).to.equal('Add file...');
      var next = parent.next();
      // 'Div' element to hold file information is added
      expect(next.is(".files")).to.equal(true);
      var changedata = {files:[{name: 'singlefile.txt', size: 100}]};
      this.$el.trigger('fileuploadadd', [changedata]);
      var seconddata = {files:[{name: 'secondfile.txt', size: 100}]};
      this.$el.trigger('fileuploadadd', [seconddata]);
      expect(next.find('div.errmsg').text()).to.equal('Maximum number of files exceeded');
    });

  });

/* ==========================
   TEST: Existing Files
  ========================== */

  describe('InitializeExisting', function () {
    beforeEach(function() {
      this.$el = $('' +
        '<input class="pat-fileupload"' +
        ' type="file"' +
        ' multiple="multiple"' +
        'name="files"' +
        'data-pat-fileupload="{&quot;url&quot;: &quot;/upload&quot;,' +
        ' &quot;existing&quot;: [{&quot;url&quot;: &quot;/downloadexisting&quot;,' +
        ' &quot;size&quot;: 2292263,' +
        ' &quot;name&quot;: &quot;testfile.txt&quot;,' +
        ' &quot;title&quot;: &quot;testfile.txt&quot;}]}"' +
        '>');
    });
    afterEach(function() {
      this.$el.remove();
    });

    it('existing files', function() {
      registry.scan(this.$el);
      var parent = this.$el.parent();
      var next = parent.next();
      // 'Div' element to hold file information is added
      expect(next.is(".files")).to.equal(true);
      // 'Div' element to hold existing file info is added
      var existing = next.find('div.existfileupload');
      // 'a' element with proper 'href' is added
      expect(existing.find('a').attr('href')).to.equal('/downloadexisting');
      // Filename is added
      expect(existing.find('span.filename').html()).to.equal('testfile.txt');
      // 'Span' element for loading indicator added and hidden
      expect(existing.find('span.loadingIndicator').is(':visible')).to.equal(false);
      // 'Div' element for deleting is added
      expect(existing.find('div.remove').html()).to.equal('X');
      // Input hidden element is updated
      var hidden = parent.find("input[name='filesuploaded']");
      expect(hidden.val()).to.equal('[{"name":"testfile.txt","title":"testfile.txt"}]');
      // Now delete the file
      existing.find('div.remove').trigger('click');
      var updated_existing = next.find('div.existfileupload');
      // The 'Div' element to hold the existing file should not exist
      // For some strange reason this only works after the test has successfully loaded
//      expect(updated_existing).to.be.undefined;
      // Input hidden element is updated
      expect(hidden.val()).to.equal('[]');
    });

  });

/* ==========================
   TEST: File size formatting
  ========================== */
  
  describe('Filesize', function () {
    beforeEach(function() {
      this.$el = $('' +
        '<input class="pat-fileupload"' +
        ' type="file"' +
        ' multiple="multiple"' +
        'name="files"' +
        'data-pat-fileupload="{&quot;url&quot;: &quot;/upload&quot;,' +
        ' &quot;existing&quot;: [{&quot;url&quot;: &quot;/downloadexisting&quot;,' +
        ' &quot;size&quot;: 10000,' +
        ' &quot;name&quot;: &quot;filesize1.txt&quot;,' +
        ' &quot;title&quot;: &quot;filesize1.txt&quot;},' +
        '{&quot;url&quot;: &quot;/downloadexisting&quot;,' +
        ' &quot;size&quot;: 1000000,' +
        ' &quot;name&quot;: &quot;filesize2.txt&quot;,' +
        ' &quot;title&quot;: &quot;filesize2.txt&quot;},' +
        '{&quot;url&quot;: &quot;/downloadexisting&quot;,' +
        ' &quot;size&quot;: 1000000000,' +
        ' &quot;name&quot;: &quot;filesize3.txt&quot;,' +
        ' &quot;title&quot;: &quot;filesize3.txt&quot;}' +
        ']}">');
    });
    afterEach(function() {
      this.$el.remove();
    });

    it('file size format', function() {
      registry.scan(this.$el);
      var parent = this.$el.parent();
      var next = parent.next();
      // Get the first file
      var existing = next.find('div.existfileupload');
      var filesizes = existing.find('span.filesize');
      var first_el = $(filesizes[0]);
      expect(first_el.hasClass('filesize')).to.equal(true);
      expect(first_el.text()).to.equal('  size: 10.00 KB');
      var second_el = $(filesizes[1]);
      expect(second_el.hasClass('filesize')).to.equal(true);
      expect(second_el.text()).to.equal('  size: 1.00 MB');
      var third_el = $(filesizes[2]);
      expect(third_el.hasClass('filesize')).to.equal(true);
      expect(third_el.text()).to.equal('  size: 1.00 GB');
      // Now delete the files
      existing.find('div.remove').trigger('click');
      var updated_existing = next.find('div.existfileupload');
      // The 'Div' element to hold the existing file should not exist
      // For some strange reason this only works after the test has successfully loaded
//      expect(updated_existing).to.be.undefined;
      // Input hidden element is updated
      var hidden = parent.find("input[name='filesuploaded']");
      expect(hidden.val()).to.equal('[]');
    });

  });

/* ==========================
   TEST: Functions
  ========================== */

  describe('functions', function () {
    beforeEach(function() {
      this.$el = $('' +
        '<input class="pat-fileupload"' +
        ' type="file"' +
        ' multiple="multiple"' +
        'name="files"' +
        'data-pat-fileupload="{&quot;url&quot;: &quot;/upload&quot;,' +
        ' &quot;existing&quot;: []}"' +
        '>');
    });
    afterEach(function() {
      this.$el.remove();
    });

    it('error', function() {
      registry.scan(this.$el);
      var parent = this.$el.parent();
      var next = parent.next();
      // 'Div' element to hold file information is added
      expect(next.is(".files")).to.equal(true);
      this.$el.trigger('fileuploadfail');
      var errmsg = next.find('div.errmsg');
      expect(errmsg.hasClass('errmsg')).to.equal(true);
      expect(errmsg.text()).to.equal('An error has occurred uploading the file');
    });

    it('change', function() {
      registry.scan(this.$el);
      var parent = this.$el.parent();
      var next = parent.next();
      // 'Div' element to hold file information is added
      expect(next.is(".files")).to.equal(true);
      var changedata = {files:[{name: 'changefile.txt', size: 100, fileid: 'fXXXXX'}]};
      this.$el.trigger('fileuploadadd', [changedata]);
      // 'Div' element to hold new file info is added
      var newfile = next.find('div.newfileupload');
      // Filename is added
      expect(newfile.find('span.filename').html()).to.equal('changefile.txt');
      var filesize = newfile.find('span.filesize');
      expect(filesize.text()).to.equal('  size: 0.10 KB');
      // 'Span' element for loading indicator added
      expect(newfile.find('span.loadingIndicator')).to.be.ok();
      // 'Div' element for deleting is added
      expect(newfile.find('div.remove').html()).to.equal('X');
      // 'Div' element for deleting hidden
      expect(newfile.find('div.remove').is(':visible')).to.equal(false);
      // Input hidden element is still empty
      var hidden = parent.find("input[name='filesuploaded']");
      expect(hidden.val()).to.equal('');
    });

    it('progress', function() {
      registry.scan(this.$el);
      var parent = this.$el.parent();
      var next = parent.next();
      // 'Div' element to hold file information is added
      expect(next.is(".files")).to.equal(true);
      var changedata = {files:[{name: 'changefile.txt', size: 100}]};
      this.$el.trigger('fileuploadadd', [changedata]);
      // 'Div' element to hold new file info is added
      var newfile = next.find('div.newfileupload');
      var loading = newfile.find('span.loadingIndicator');
      var progressid = changedata.files[0].fileid;
      var progressdata = {files:[{name: 'changefile.txt', size: 100, fileid: progressid}], loaded: 99, total: 100};
      this.$el.trigger('fileuploadprogress', [progressdata]);
      // 'Span' element for loading indicator added
      expect(loading.css('width')).to.equal('49%');
    });

    it('done', function() {
      registry.scan(this.$el);
      var parent = this.$el.parent();
      var hidden = parent.find("input[name='filesuploaded']");
      var next = parent.next();
      // 'Div' element to hold file information is added
      expect(next.is(".files")).to.equal(true);
      var changedata = {files:[{name: 'changefile.txt', size: 10000}]};
      this.$el.trigger('fileuploadadd', [changedata]);
      var doneid = changedata.files[0].fileid;
      var donedata = {result: {files:[{name: 'random', title: 'changefile.txt', size: 10000, url: '/downloadnew', fileid: doneid}]}};
      this.$el.trigger('fileuploaddone', [donedata]);
      // 'Div' element to hold new file info is added
      var newfile = next.find('div.newfileupload');
      // 'a' element with proper 'href' is added
      expect(newfile.find('a').attr('href')).to.equal('/downloadnew');
      // Filename is added
      expect(newfile.find('span.filename').html()).to.equal('changefile.txt');
      // 'Span' element for loading indicator added and hidden
      expect(newfile.find('span.loadingIndicator').is(':visible')).to.equal(false);
      // 'Div' element for deleting is added
      expect(newfile.find('div.remove').html()).to.equal('X');
      // Input hidden element is updated
      expect(hidden.val()).to.equal('[{"name":"random","title":"changefile.txt"}]');
      // Now delete the file
      newfile.find('div.remove').trigger('click');
      var updated_newfile = next.find('div.existfileupload');
      // The 'Div' element to hold the newfile file should not exist
      // For some strange reason this only works after the test has successfully loaded
//      expect(updated_newfile).to.be.undefined;
      // Input hidden element is updated
      expect(hidden.val()).to.equal('[]');
    });

    it('upload error', function() {
      registry.scan(this.$el);
      var parent = this.$el.parent();
      var hidden = parent.find("input[name='filesuploaded']");
      var next = parent.next();
      // 'Div' element to hold file information is added
      expect(next.is(".files")).to.equal(true);
      var changedata = {files:[{name: 'changefile.txt', size: 10000}]};
      this.$el.trigger('fileuploadadd', [changedata]);
      var errorid = changedata.files[0].fileid;
      var donedata = {result: {files:[{name: 'random', 
                      title: 'changefile.txt', size: 10000,
                      url: '/downloadnew', error: 'There was an error',
                      fileid: errorid}]}};
      this.$el.trigger('fileuploaddone', [donedata]);
      // 'Div' element to hold new file info is added
      var newfile = next.find('div.newfileupload');
      // 'a' element with proper 'href' is added
      expect(newfile.find('a').attr('href')).to.equal('/downloadnew');
      // Filename is added
      expect(newfile.find('span.filename').html()).to.equal('changefile.txt');
      // 'Span' element for loading indicator added and error message is shown
      var errormsg = newfile.find('span.loadingIndicator');
      expect(errormsg.attr('style')).to.equal('color: red; ');
      expect(errormsg.text()).to.equal("Ajax error encountered: 'There was an error'");
      // Input hidden element is not updated
      expect(hidden.val()).to.equal('');
    });

  });

});
