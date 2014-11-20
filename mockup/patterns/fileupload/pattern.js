
define([
  'jquery',
  'mockup-patterns-base',
  'jquery.fileupload',
  'jquery.fileupload-process',
  'jquery.fileupload-validate',
  'jquery.fileupload-image',
  'jquery.fileupload-audio',
  'jquery.fileupload-video',
  'jquery.iframe-transport'
], function($, Base) {
  'use strict';

  var files = [];

  var fileupload = Base.extend({
    // The name for this pattern
    name: 'fileupload',

    defaults: {
      // Default values for attributes
      dataType: 'json',
      url: '',
      maxFileSize: 500000000,
      resizeMaxWidth: 1920,
      disableValidation: false,
      resizeMaxHeight: 1200
    },
    getNumberOfFiles: function (elem) {
        var numFiles = elem.find('div.remove').css(
                                  "visibility", "visible").length;
        return numFiles;
    },
    generateRandomId: function() {
        var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charSetSize = charSet.length;
        var randPos = 0;
        var id = 'f';
        var i = 2;
        for (i = 2; i <= 6; i += 1) {
            randPos = Math.floor(Math.random() * charSetSize);
            id += charSet[randPos];
        }
        return id;
    },
    formatFileSize: function (bytes) {
       if (typeof bytes !== 'number') {
           return '';
       }
       if (bytes >= 1000000000) {
           return (bytes / 1000000000).toFixed(2) + ' GB';
       }
       if (bytes >= 1000000) {
           return (bytes / 1000000).toFixed(2) + ' MB';
       }
       return (bytes / 1000).toFixed(2) + ' KB';
    },
    uploadExisting: function () {
      // Load existing files:
      var self = this;
      var existing = self.options.existing;
      var $parent = this.$el.parent();
      var $files = $parent.next();
      var widgetname = 'widget';
      if (typeof self.$el.attr('name') !== 'undefined') {
          widgetname = self.$el.attr('name');
      }
      var $hidden = $parent.find('input[name="'+widgetname+'uploaded"]');
      existing.forEach( function (file) {
        var $fpdiv1 = $('<div>');
        $fpdiv1.addClass('existfileupload');
        var fileid = self.generateRandomId();
        $fpdiv1.attr('id', fileid);
        var $fpa1 = $('<a>');
        $fpa1.attr('href', file.url);
        $fpdiv1.append($fpa1);
        var $fpspan1 = $('<span>');
        $fpspan1.addClass('filename');
        $fpspan1.text(file.title);
        $fpa1.append($fpspan1);
        var $fpspan2 = $('<span>');
        $fpspan2.append('  size: '+ self.formatFileSize(file.size) );
        $fpspan2.addClass('filesize');
        $fpa1.after($fpspan2);
        var $fpspan3 = $('<span>');
        $fpspan3.addClass('loadingIndicator');
        $fpspan3.hide();
        $fpspan2.after($fpspan3);
        var $fpdiv2 = $('<div class="remove" role="button">');
        $fpdiv2.text("X");
        var newfile = {'name':file.name, 'title':file.title};
        $fpdiv2.on( "click", function() {
                   files = $.grep(files, function(value) {
                                 return value !== newfile;
                    });
                    $hidden.val(JSON.stringify(files));
                    $fpdiv1.remove();
                    });
        $fpspan3.after($fpdiv2);
        files.push(newfile);
        $hidden.val(JSON.stringify(files));
        $files.append($fpdiv1);
      });
    },
    init: function() {
      // The init code for your pattern goes here
      var self = this;
      // self.$el contains the html element
      self.$el.addClass('fileupload');
      var widgetname = 'widget';
      if (typeof self.$el.attr('name') !== 'undefined') {
          widgetname = self.$el.attr('name');
      }
//      console.log(widgetname);
      var $hid1 = $('<input type="hidden" value="">');
      $hid1.attr('name', widgetname + 'uploaded');
      var $hid2 = $('<input type="hidden" value="">');
      $hid2.attr('name', widgetname + 'fileids');
      var $d1 = $('<div class="files"></div>');
      var $s1 = $('<span class="btn btn-success fileinput-button"></span>');
      var $s2 = $('<span></span');
      if (self.options.maxNumberOfFiles === 1) {
          $s2.text("Add file...");
      } else {
          $s2.text("Add files...");
      }
      self.$el.wrap($s1);
      self.$el.before($s2);
      self.$el.parent().after($d1);
      $d1.append($hid2);
      self.$el.after($hid1);
      var $parent = self.$el.parent();
      var maxFiles = self.options.maxNumberOfFiles;
      self.$el.fileupload(self.options)
      .on('fileuploadfail', function (e, data) {
          var $errmsg =$('<div>');
          $errmsg.addClass('errmsg');
          $errmsg.text('An error has occurred uploading the file');
          $d1.append($errmsg);})
      .on('fileuploadsubmit', function (e, data) {
          var submitdata = data.files[0];
//          console.log(submitdata);
          if (submitdata.notSubmit) {
              return false;
          } else {
              var $files = $parent.next();
              var $fileids = $files.find('input[name="'+widgetname+'fileids"]');
              $fileids.val(submitdata.fileid);
          }
          })
      .on('fileuploadadd', function (e, data) {
          $.each(data.files, function (index, file) {
            var currNumFiles = self.getNumberOfFiles($d1);
            if (currNumFiles >= maxFiles) {
                var submitObj = {'notSubmit': true};
                $.extend(file, submitObj);
                var $errmsg =$('<div>');
                $errmsg.addClass('errmsg');
                $errmsg.css('color', 'red').text(
                            'Maximum number of files exceeded');
                $d1.append($errmsg);
                $errmsg.fadeIn('slow');
                $errmsg.delay(5000).fadeOut();
            } else {
                var $fpdiv1 = $('<div>');
                var randID = self.generateRandomId();
                var newobj = {'fileid': randID};
                $.extend(file, newobj);
                $fpdiv1.addClass('newfileupload');
                var newid = file.fileid;
                $fpdiv1.attr('id', newid);
                var $fpa1 = $('<a>');
                $fpdiv1.append($fpa1);
                var $fpspan1 = $('<span>');
                $fpspan1.addClass('filename');
                $fpspan1.text(file.name);
                $fpa1.append($fpspan1);
                var $fpspan2 = $('<span>');
                $fpspan2.append('  size: '+ self.formatFileSize(file.size) );
                $fpspan2.addClass('filesize');
                $fpa1.after($fpspan2);
                var $fpspan3 = $('<span>');
                $fpspan3.addClass('loadingIndicator');
                $fpspan2.after($fpspan3);
                var $fpdiv2 = $('<div class="remove" role="button">');
                $fpdiv2.text("X");
                $fpdiv2.css('visibility', 'hidden');
                $fpspan3.after($fpdiv2);
                $d1.append($fpdiv1);
                }
            });
          })
      .on('fileuploadprogress', function (e, data) {
          var filedata = data.files[0];
          var $files = $parent.next();
          var $fileids = $files.find('input[name="'+widgetname+'fileids"]');
          var fileid = filedata.fileid;
          var $div = $d1.find('div[id="'+fileid+'"]');
          var $loader = $div.find('span.loadingIndicator');
          var progress = parseInt(data.loaded / data.total * 50, 10);
          $loader.css('width', progress + "%");
          })
      .on('fileuploaddone', function (e, data) {
          var $files = $parent.next();
          var currNumFiles = self.getNumberOfFiles($files);
//          console.log(maxFiles);
//          console.log(currNumFiles);
          var $hidden = $parent.find('input[name="'+widgetname+'uploaded"]');
          var results = data.result;
          var fileInfo = results.files[0];
          var $div = $files.find('div[id="'+ fileInfo.fileid +'"]');
          var $a = $div.find('a');
          $a.attr('href', fileInfo.url);
          var $UploadMessage = $div.find('span.loadingIndicator');
          var $DeleteFile = $div.find('div');
          if (fileInfo.error) {
                $UploadMessage.css('color', 'red').text(
                                   "Ajax error encountered: '" +
                                   fileInfo.error + "'");
          } else {
                var newfile = {'name':fileInfo.name,
                               'title':fileInfo.title};
                files.push(newfile);
                $hidden.val(JSON.stringify(files));
                $DeleteFile.on( "click", function() {
                               files = $.grep(files, function(value) {
                                       return value !== newfile;
                                       });
                               $hidden.val(JSON.stringify(files));
                               $div.remove();
                               });
                $UploadMessage.hide();
                $DeleteFile.css("visibility", "visible");
                }
          });
     self.uploadExisting();
    }
  });

  return fileupload;

});
