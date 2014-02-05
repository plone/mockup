/* Helloworld pattern.
 *
 * Options:
 *      color(string): TODO ('black')
 *      bgcolor(string): TODO ('yellow')
 *
 * Documentation:
 *      # Example
 *
 *      {{ example-1 }}
 *
 * Example: example-1
 *      <p class="pat-helloworld">Hello in default</p>
 *      <p class="pat-helloworld" data-pat-helloworld="bgcolor:Red">Hello in Red</p>
 *
 * License:
 *    Copyright (C) 2010 Plone Foundation
 *
 *    This program is free software; you can redistribute it and/or modify it
 *    under the terms of the GNU General Public License as published by the
 *    Free Software Foundation; either version 2 of the License.
 *
 *    This program is distributed in the hope that it will be useful, but
 *    WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
 *    Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License along
 *    with this program; if not, write to the Free Software Foundation, Inc.,
 *    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */
define([
    'jquery',
    'mockup-patterns-base'
], function ($, Base) {
    "use strict";

    var HelloWorld = Base.extend({
        name: 'helloworld',
        defaults: {
            'color': 'black',
            'bgcolor': 'yellow'
        },
        init: function () {
            this.$el.css({
                'color': this.options.color,
                'background': this.options.bgcolor
            });
        }
    });

    return HelloWorld;
});
