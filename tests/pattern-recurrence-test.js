// tests for Base
//
// @author Peter Lamut
// @version 1.0
// @licstart  The following is the entire license notice for the JavaScript
//            code in this page.
//
// Copyright (C) 2010 Plone Foundation
//
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 2 of the License.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along with
// this program; if not, write to the Free Software Foundation, Inc., 51
// Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//
// @licend  The above is the entire license notice for the JavaScript code in
//          this page.
//

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  regexp:true, undef:true, strict:true, trailing:true, browser:true */
/*global buster:false, define:false, describe:false, it:false, expect:false,
  beforeEach:false, afterEach:false */

define([
    'chai',
    'sinon',
    'jquery',
    'mockup-registry',
    'mockup-patterns-recurrence'
], function (chai, sinon, $, registry, Recurrence) {
    'use strict';

    var expect = chai.expect,
        mocha = window.mocha;

    mocha.setup('bdd');
    $.fx.off = true;

    /* ==========================
    TEST: Recurrence
    ========================== */

    describe('Recurrence', function () {

        var defaultOpts,  // pattern's default options
            recMethod;    // a spy on the jQuery's recurrenceinput method

        beforeEach(function () {
            this.$el = $([
                '<div>',
                '  <textarea class="pat-recurrence"',
                '      data-pat-recurrence=""></textarea>',
                '</div>'
            ].join(''));

            defaultOpts = {
                lang: 'en',
                readOnly: false,
                firstDay: 0,
                startField: null,
                startFieldYear: null,
                startFieldMonth: null,
                startFieldDay: null,
                ajaxURL: null,
                ajaxContentType: 'application/json; charset=utf8',
                ributtonExtraClass: ''
            };

            sinon.spy($.fn, 'recurrenceinput');
            recMethod = $.fn.recurrenceinput;
        });

        afterEach(function () {
            recMethod.restore();  // stop spying on the method
        });

        it('init with default options', function () {
            expect(recMethod.called).to.equal(false);
            registry.scan(this.$el);
            expect(recMethod.calledOnce).to.equal(true);
            expect(recMethod.calledWith(defaultOpts)).to.equal(true);
        });

        it('init with some user-provided options', function () {
            var $txt = $('.pat-recurrence', this.$el);
            $txt.attr('data-pat-recurrence',
                'firstDay: 4; startField: #fieldId; ributtonExtraClass: red');

            // NOTE: integers in data-pat-* are passed as strings
            defaultOpts.firstDay = '4';
            defaultOpts.startField = '#fieldId';
            defaultOpts.ributtonExtraClass = 'red';

            expect(recMethod.called).to.equal(false);
            registry.scan(this.$el);
            expect(recMethod.calledOnce).to.equal(true);
            expect(recMethod.calledWith(defaultOpts)).to.equal(true);
        });

    });

});
