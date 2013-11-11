define([
    'jquery',
    'mockup-patterns-base'
], function ($, Base) {
    "use strict";

    var HelloWorld = Base.extend({
        name: 'helloworld',
        init: function () {
            var $label = this.$el;
            $label.text("Hello, world!");
        }
    });

    return HelloWorld;
});
