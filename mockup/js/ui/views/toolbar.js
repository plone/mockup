define([
  'mockup-ui-url/views/container'
], function(ContainerView) {
  'use strict';

  var Toolbar = ContainerView.extend({
    tagName: 'div',
    className: 'navbar',
    idPrefix: 'toolbar-'
  });

  return Toolbar;
});
