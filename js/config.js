requirejs.config({
    baseUrl: '../',
    paths: {
        jquery: '../bower_components/jquery/jquery',
        bootstrap: '../bower_components/bootstrap/docs/assets/js/bootstrap',
        'jquery-form': '../bower_components/jquery-form/jquery.form',
        'jquery.cookie': '../bower_components/jquery.cookie/jquery.cookie',
        select2: '../bower_components/select2/select2',
        tinymce: '../lib/tinymce/tinymce.min'
    }
    shim: {
      tinyMCE: {
        exports: 'tinyMCE',
        init: function () {
          this.tinyMCE.DOM.events.domLoaded = true;
          return this.tinyMCE;
        }
      }
    }
});
