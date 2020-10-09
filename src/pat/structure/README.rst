How to customize the Structure Updater pattern
==============================================

The ``mockup-pattern-structureupdater`` updates the title and description on the page - if available - when a folder is changed in the structure pattern. It's triggered by the class ``template-folder_contents``, which is available on the body tag when the folder contents page is opened. The pattern listens on the ``context-info-loaded`` event, which is triggered by the structure pattern.

Often you will have customized layouts, where you need to update also other parts of the site when the user changes to another folder.


Pattern configuration
---------------------

For simple cases, you can customize the CSS selector for the title and description via the options ``titleSelector`` and ``descriptionSelector`` for the pattern.
This can be done by adding options for that pattern via the resource registry control panel under the "Pattern options" tab or via the ``registry.xml`` profile like so::

  <record name="plone.patternoptions">
    <value purge="False">
      <element key="structureupdater">{"titleSelector": "h1.documentFirstHeading", "descriptionSelector": "footer"}</element>
    </value>
  </record>

.. note::
    For the ``titleSelector`` and ``descriptionSelector`` you have to provide valid JQuery selectors.
    Like with any CSS selector you can also specify mutliple selectors by seperating them via a comma sign.


Pattern overloading
-------------------

If you need some more control, you can overload the pattern and provide your own.

The pattern is registered in the RequireJS configuration in ``mockup/js/config.js`` under the name ``mockup-patterns-structureupdater`` and under the path ``patterns/structure/pattern-structureupdater``.

If you provide another path you can point it to your own implementation.

This can be easily done in Plone, where the RequireJS configuration are ``plone.app.registry`` entries.

For example, in your project's ``registry.xml`` profile, add this::

    <?xml version="1.0"?>
    <registry i18n:domain="plone" xmlns:i18n="http://xml.zope.org/namespaces/i18n">

      <records
          prefix="plone.resources/mockup-patterns-structureupdater"
          interface='Products.CMFPlone.interfaces.IResourceRegistry'>
        <value key="js">++plone++my.project.resources/mockup-patterns-structureupdater.js</value>
      </records>

    </registry>


In that example the custom implementation of the structure updater pattern lives in a ``plone.resource`` directory named ``my.project.resources``.
This is configured in the project's ``configure.zcml``::

    <?xml version="1.0"?>
    <configure
        xmlns="http://namespaces.zope.org/zope"
        xmlns:plone="http://namespaces.plone.org/plone">
      <plone:static
          directory="resources"
          name="my.project.resources"
          type="plone"
      />
    </configure>

The custom implementation ``mockup-patterns-structureupdater.js`` looks like so::

    define([
        'pat-base',
    ], function(Base) {
        'use strict';
        var Pattern = Base.extend({
          name: 'structureupdater2',
          trigger: '.template-folder_contents',
          parser: 'mockup',
          init: function() {
            $('body').on('context-info-loaded', function (e, data) {
              // Do something
              $('.breadcrumb').html(data.object && '<li>' + data.object.Title + '</li>');
            }.bind(this));
          }
        });
        return Pattern;
    });


You probably want to include the original behavior.
If you have given the pattern another name than the original pattern, you can just let RequireJS depend on the original pattern and it will be registered and triggered as normal.
We can include the original pattern via the ``mockup-patterns-structure-url`` path and incldue then the filename.
The code looks then like so::

    define([
        'pat-base',
        'mockup-patterns-structure-url/pattern-structureupdater',
    ], function(Base) {
        'use strict';
        var Pattern = Base.extend({
          name: 'structureupdater2',  // Give it another name than the original pattern
          trigger: '.template-folder_contents',
          parser: 'mockup',
          init: function() {
            $('body').on('context-info-loaded', function (e, data) {
              // Do something
              $('.breadcrumb').html(data.object && '<li>' + data.object.Title + '</li>');
            }.bind(this));
          }
        });
        return Pattern;
    });
