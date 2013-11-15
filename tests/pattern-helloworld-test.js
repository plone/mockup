define([
    'chai',
    'jquery',
    'mockup-registry',
    'mockup-patterns-helloworld'
], function (chai, $, registry, HelloWorld) {
    "use strict";

    var expect = chai.expect,
        mocha = window.mocha;

    mocha.setup('bdd');

    $.fx.off = true;  //disable jQuery animations for various reasons

    describe("HelloWorld", function () {
        beforeEach(function () {
            this.$el = $(
                '<label class="pat-helloworld">(no greeting yet)</label>'
            );
        });

        it('should change label text to "Hello, world!"', function () {
            expect(this.$el.text()).to.not.be.equal("Hello, world!");
            registry.scan(this.$el);
            expect(this.$el.text()).to.be.equal("Hello, world!");
        });
    });

});
