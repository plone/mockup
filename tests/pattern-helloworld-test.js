define([
    'expect',
    'jquery',
    'mockup-registry',
    'mockup-patterns-helloworld'
], function (expect, $, registry, HelloWorld) {
    "use strict";

    window.mocha.setup('bdd');
    $.fx.off = true;  //disable jQuery animations for various reasons

    describe("HelloWorld", function () {
        beforeEach(function () {
            this.$el = $(
                '<label class="pat-helloworld">(no greeting yet)</label>'
            );
        });

        it('default color is black', function () {
            expect(this.$el[0].style.color).to.not.be.equal('black');
            registry.scan(this.$el);
            expect(this.$el[0].style.color).to.be.equal('black');
        });

        it('should change color to red', function () {
            this.$el.attr('data-pat-helloworld', 'color:red');
            expect(this.$el[0].style.color).to.not.be.equal('red');
            registry.scan(this.$el);
            expect(this.$el[0].style.color).to.be.equal('red');
        });
    });

});
