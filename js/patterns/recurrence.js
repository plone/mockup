// Pattern which provides accessibility support
//
// Author: Peter Lamut<peter.lamut@niteoweb.com>
// Version: 0.1
//
// Taken from the original accessibility.js from Plone
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
    'jquery.tmpl',
    'jquery.recurrenceinput',
    'jquery.tools.dateinput',
    'jquery.tools.overlay',
    'mockup-patterns-base'
], function($, template, recinput, dateinput, overlay, Base) {
    "use strict";

    var Recurrence = Base.extend({
        name: "recurrence",

        defaults: {},

        init: function() {
           alert('recurrence init!');
        }
    });

    return Recurrence;
});
