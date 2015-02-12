/* Grunt software build task definitions.
 */

/* global module:true */


module.exports = function(grunt) {
  'use strict';

  var MockupGrunt = require('./bower_components/mockup-core/js/grunt'),
      requirejsOptions = require('./js/config'),
      extend = require('./node_modules/extend/index'),
      mockup = new MockupGrunt(requirejsOptions),
      docsExtraIncludes = [];


  for (var i = 0; i < mockup.patterns.length; i = i + 1) {
    if (mockup.patterns[i].indexOf('-url') === -1) {
      docsExtraIncludes.push(mockup.patterns[i]);
      docsExtraIncludes.push('text!' + requirejsOptions.paths[mockup.patterns[i]] + '.js');
    }
  }

  var copy_tinymce = function (name, path) {
    var ret = {};
    ret[name] = {
      files: [
        {
          expand: true, cwd: 'bower_components/tinymce-builded/js/tinymce/langs', src: '*', dest: path + name + '-tinymce/langs'
        }, {
          expand: true, cwd: 'bower_components/tinymce-builded/js/tinymce/skins/lightgray/fonts/', src: 'tinymce*', dest: path,
          rename: function(dest, src) { return dest + name + '-tinymce-font-' + src; }
        }, {
          expand: true, cwd: 'bower_components/tinymce-builded/js/tinymce/skins/lightgray/img/', src: '*', dest: path,
          rename: function(dest, src) { return dest + name + '-tinymce-img-' + src; }
        }, {
          expand: true, cwd: 'bower_components/tinymce-builded/js/tinymce/skins/lightgray/', src: 'content.min.css', dest: path,
          rename: function(dest, src) { return dest + name + '-tinymce-' + src; }
        }
      ]
    };
    return ret;
  };
  var sed_tinymce = function(name, path, url) {
    var ret = {};

    ret[name + '-tinymce-fonts'] = {
      path: path + name + '.min.css',
      pattern: 'url\\(fonts/tinymce',
      replacement: 'url(' + url + '-tinymce-font-tinymce'
      //pattern: 'url\\(\'?fonts/tinymce(.*)\'?',  // match urls with and without quotes
      //replacement: 'url(\'' + url + '-tinymce-font-tinymce$1\''
    };
    ret[name + '-tinymce-img-loader'] = {
      path: path + name + '.min.css',
      pattern: 'url\\(\'?img/loader.gif\'?',  // match urls with and without quotes
      replacement: 'url(\'' + url + '-tinymce-img-loader.gif\''
    };
    ret[name + '-tinymce-img-anchor'] = {
      path: path + name + '.min.css',
      pattern: 'url\\(\'?img/anchor.gif\'?',
      replacement: 'url(\'' + url + '-tinymce-img-anchor.gif\''
    };
    ret[name + '-tinymce-img-object'] = {
      path: path + name + '.min.css',
      pattern: 'url\\(\'?img/object.gif\'?',
      replacement: 'url(\'' + url + '-tinymce-img-object.gif\''
    };

    ret[name + '-tinymce-fonts2'] = {
      path: path + name + '-tinymce-content.min.css',
      pattern: 'url\\(fonts/tinymce',
      replacement: 'url(' + url + '-tinymce-font-tinymce'
    };
    ret[name + '-tinymce-img-loader2'] = {
      path: path + name + '-tinymce-content.min.css',
      pattern: 'url\\(\'?img/loader.gif\'?',
      replacement: 'url(\'' + url + '-tinymce-img-loader.gif\''
    };
    ret[name + '-tinymce-img-anchor2'] = {
      path: path + name + '-tinymce-content.min.css',
      pattern: 'url\\(\'?img/anchor.gif\'?',
      replacement: 'url(\'' + url + '-tinymce-img-anchor.gif\''
    };
    ret[name + '-tinymce-img-object2'] = {
      path: path + name + '-tinymce-content.min.css',
      pattern: 'url\\(\'?img/object.gif\'?',
      replacement: 'url(\'' + url + '-tinymce-img-object.gif\''
    };
    return ret;
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
      docs: extend(true,
        {
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
          ]
        },
        copy_tinymce('docs', 'docs/dev/')
      )
    },
    sed: extend(true,
      {
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
      },
      sed_tinymce('widgets', 'docs/dev/', '++resource++plone.app.widgets')
    )
  }, {
    path: 'docs/dev/',
    url: 'docs',
    extraInclude: docsExtraIncludes,
  }, ['requirejs', 'uglify', 'less', 'copy', 'sed']);

  mockup.registerBundle('structure', {}, { url: '++resource++wildcard.foldercontents-structure' });
  mockup.registerBundle('filemanager', {}, { url: '++resource++plone.resourceeditor-filemanager' });
  mockup.registerBundle('resourceregistry');
  mockup.registerBundle('plone', {
    copy: copy_tinymce('plone', 'build/'),
    sed: sed_tinymce('plone', 'build/', '++resource++plone')
  }, {path: 'build/', url: '++resource++plone'});
  mockup.registerBundle('widgets', {
    copy: copy_tinymce('widgets', 'build/'),
    sed: sed_tinymce('widgets', 'build/', '++resource++plone.app.widgets')
  }, {path: 'build/', url: '++resource++plone.app.widgets'});
  mockup.registerBundle(
    'thememapperbundle',
    {},
    {path: 'build/', url: '++resource++plone.app.theming'});


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
