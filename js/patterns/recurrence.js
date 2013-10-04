// Pattern which provides a recurrence widget.
//
// Authors: Peter Lamut<peter.lamut@niteoweb.com>
//          Johannes Raggam<raggam-nl@adm.at>
// Version: 1.0
//
// License:
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

define([
    'jquery',
    'mockup-patterns-base',
    'jquery.tmpl',
    'jquery.recurrenceinput',
    'jquery.tools.dateinput',
    'jquery.tools.overlay'
], function ($, Base) {
    "use strict";

    var Recurrence = Base.extend({
        name: "recurrence",

        defaults: {
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
        },

        init: function () {
            var self = this;
            self.$el.recurrenceinput(this.options);
        }
    });

    return Recurrence;
});
