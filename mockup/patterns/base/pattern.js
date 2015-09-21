/* Mockup shim of the Patternslib Base Pattern
 */

define([
  'jquery',
  'pat-base',
], function($, Base) {
  'use strict';

  var MockupBase = function MockupBaseWrapper() {
    return Base.apply(this, arguments);
  };
  for (var key in Base) {
    if (Base.hasOwnProperty(key)) {
      MockupBase[key] = Base[key];
    }
  }
  MockupBase.prototype = Base.prototype;
  MockupBase.prototype.constructor = MockupBase;

  MockupBase.extend = function() {
    console.log(
      "Usage of the mockup-patterns-base pattern is deprecated and it will eventually be removed."+
      "Instead, use pat-base and explicitly set parser to 'mockup' when calling extend.");
    var child = Base.extend.apply(this, arguments);
    child.prototype.parser = 'mockup';
    return child;
  };

  return MockupBase;
});
