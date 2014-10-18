/* globals module:true */

module.exports = function(grunt) {
  'use strict';

  var MockupGrunt = require('./bower_components/mockup-core/js/grunt'),
      requirejsOptions = require('./js/config'),
      mockup = new MockupGrunt(requirejsOptions),
      docsExtraIncludes = [];


  for (var i = 0; i < mockup.patterns.length; i = i + 1) {
    if (mockup.patterns[i].indexOf('-url') === -1) {
      docsExtraIncludes.push(mockup.patterns[i]);
      docsExtraIncludes.push('text!' + requirejsOptions.paths[mockup.patterns[i]] + '.js');
    }
  }

  var copy_tinymce = function (bundleName, path) {
    return [{
      expand: true, cwd: 'bower_components/tinymce/skins/lightgray/fonts/', src: 'tinymce*', dest: path,
      rename: function(dest, src) { return dest + bundleName + '-tinymce-font-' + src; }
    }, {
      expand: true, cwd: 'bower_components/tinymce/skins/lightgray/img/', src: '*', dest: path,
      rename: function(dest, src) { return dest + bundleName + '-tinymce-img-' + src; }
    }, {
      expand: true, cwd: 'bower_components/tinymce/skins/lightgray/', src: 'content.min.css', dest: path,
      rename: function(dest, src) { return dest + bundleName + '-tinymce-' + src; }
    }];
  };

  var copy_select2 = function (bundleName, path) {
    return [{
      expand: true, cwd: 'bower_components/select2/', src: 'select2*.png', dest: path,
      rename: function(dest, src) { return dest + bundleName + '-select2-' + src; }
    }, {
      expand: true, cwd: 'bower_components/select2/', src: 'select2*.gif', dest: path,
      rename: function(dest, src) { return dest + bundleName + '-select2-' + src; }
    }];
  };

  var copy_jqtree = function (bundleName, path) {
    return [{
         expand: true, cwd: 'bower_components/jqtree/', src: 'jqtree-circle.png', dest: path,
          rename: function(dest, src) { return dest + bundleName + '-jqtree-' + src; }
    }];
  };

  var copy_dropzone = function (bundleName, path) {
    return [{
        expand: true, cwd: 'bower_components/dropzone/downloads/images/', src: 'spritemap*', dest: path,
        rename: function(dest, src) { return dest + bundleName + '-dropzone-' + src; }
    }];
  };


  mockup.registerBundle('docs', {
    less: {
      options : {
        paths : ['../../../'],
        modifyVars : {
          bowerPath: '"bower_components/"',
          mockupPath: '"patterns/"',
          mockuplessPath: '"less/"'
        }
      }
    },
    copy: {
      docs: {
        files: [
          { expand: true, src: 'index.html', dest: 'docs/dev/' },
          { expand: true, src: '*.md', dest: 'docs/dev/' },
          { expand: true, src: 'js/**', dest: 'docs/dev/' },
          { expand: true, src: 'tests/**', dest: 'docs/dev/' },
          { expand: true, src: 'lib/**', dest: 'docs/dev/' },
          { expand: true, src: 'bower_components/**', dest: 'docs/dev/' },
          { expand: true, src: 'node_modules/requirejs/require.js', dest: 'docs/dev/' },
          { expand: true, src: 'build/**', dest: 'docs/dev/' },
          { expand: true, src: 'less/**', dest: 'docs/dev/' }
        ].concat(
          copy_tinymce('docs', 'build/'),
          copy_select2('docs', 'build/'),
          copy_jqtree('docs', 'build/'),
          copy_dropzone('docs', 'build/')
        )
      }
    },
    sed: {
      'docs-css': {
        path: 'docs/dev/index.html',
        pattern: 'href="docs/dev/docs.min.css"',
        replacement: 'href="docs.min.css"'
      },
      'docs-js': {
        path: 'docs/dev/index.html',
        pattern: '<script src="node_modules/grunt-contrib-less/node_modules/less/dist/less-1.6.1.js"></script>\n  <script src="node_modules/requirejs/require.js"></script>\n  <script src="js/config.js"></script>\n  <script>require\\(\\[\'mockup-bundles-docs\'\\]\\);</script>',
        replacement: '<script src="docs.min.js"></script>'
      },
      'docs-legacy-js': {
        path: 'docs/dev/index.html',
        pattern: '<script src="bower_components/es5-shim/es5-shim.js"></script>\n    <script src="bower_components/es5-shim/es5-sham.js"></script>\n    <script src="bower_components/console-polyfill/index.js"></script>',
        replacement: '<script src="docs-legacy.js"></script>'
      }
    }
  }, {
    path: 'docs/dev/',
    url: 'docs',
    extraInclude: docsExtraIncludes,
  }, ['requirejs', 'less', 'copy', 'sed']);

  mockup.registerBundle('structure', {
    copy: {
      structure: {
        files: [].concat(
          copy_dropzone('structure', 'build/')
        )
      }
    }
  }, {
    url: '++resource++wildcard.foldercontents-structure'
  });

  mockup.registerBundle('filemanager', {
    copy: {
      filemanager: {
        files: [].concat(
          copy_jqtree('filemanager', 'build/'),
          copy_dropzone('filemanager', 'build/')
        )
      }
    },
  }, {
    url: '++resource++plone.resourceeditor-filemanager'
  });

  mockup.registerBundle('resourceregistry', {
    copy: {
      resourceregistry: {
        files: copy_jqtree('resourceregistry', 'build/')
      }
    },
    sed: {
      'plone-fonts': {
        path: 'build/resourceregistry.min.css',
        pattern: '../bower_components',
        replacement: '../++plone++static/bower'
      }
    }
  }, {});

  mockup.registerBundle('plone', {
    copy: {
      plone: {
        files: [
          { expand: true, cwd: 'less/fonts/', src: 'plone-*', dest: 'build/' }
        ].concat(
          copy_tinymce('plone', 'build/'),
          copy_select2('plone', 'build/'),
          copy_jqtree('plone', 'build/'),
          copy_dropzone('plone', 'build/')
        )
      }
    },
    sed: {
      'plone-fonts': {
        path: 'build/plone.min.css',
        pattern: 'url\\(\'fonts/plone-',
        replacement: 'url(\'++resource++plone-'
      }
    }
  }, {
    url: '++resource++plone'
  });

  mockup.registerBundle('widgets', {
    copy: {
      widgets: {
        files: [].concat(
          copy_tinymce('widgets', 'build/'),
          copy_select2('widgets', 'build/'),
          copy_jqtree('widgets', 'build/'),
          copy_dropzone('widgets', 'build/')
        )
      }
    },
  });

  mockup.initGrunt(grunt, {
    sed: {
      bootstrap: {
        path: 'node_modules/lcov-result-merger/index.js',
        pattern: 'throw new Error\\(\'Unknown Prefix ',
        replacement: '//throw// new Error(\'Unknown Prefix '
      }
    }
  });

};
