/* Pattern which provides accessibility support
 *
 * Options:
 *    smallbtn(string):	Selector used to activate small text on click. (null)
 *    normalbtn(string): Selector used to activate normal text on click. (null)
 *    largebtn(string):	Selector used to activate large text on click. (null)
 *
 * Documentation:
 *    # Example
 *
 *    {{ example-1 }}
 *
 * Example: example-1
 *    <ul id="textAdjust"
 *        class="pat-accessibility"
 *        data-pat-accessibility="smallbtn:.decrease-text;
 *                                normalbtn:.normal-text;
 *                                largebtn:.increase-text;">
 *      <li>
 *        <a href="." class="decrease-text">
 *          <i class="icon-minus-sign"></i>
 *          Decrease Text Size
 *        </a>
 *      </li>
 *      <li>
 *        <a href="." class="normal-text">
 *          <i class="icon-circle"></i>
 *          Normal Text Size
 *        </a>
 *      </li>
 *      <li>
 *        <a href="." class="increase-text">
 *          <i class="icon-plus-sign"></i>
 *          Increase Text Size
 *        </a>
 *      </li>
 *    </ul>
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
  'mockup-patterns-base',
  'jquery.cookie'
], function($, Base) {
  "use strict";

  var Accessibility = Base.extend({
    name: "accessibility",
    defaults: {
      'smallbtn': null,
      'normalbtn': null,
      'largebtn': null
    },
    setBaseFontSize: function($fontsize, $reset) {
      if ($reset) {
        this.$el.removeClass('smallText').removeClass('largeText').
            removeClass('mediumText');
        $.cookie('fontsize', $fontsize, { expires: 365, path:"/" });
      }
      this.$el.addClass($fontsize);
    },
    initBtn: function(btn){
      var self = this;
      btn.el.click(function(e){
        e.preventDefault();
        self.setBaseFontSize(btn.name + 'Text', 1);
      });
    },
    init: function() {
      var self = this;
      var $fontsize = $.cookie('fontsize');
      if ($fontsize) {
          self.setBaseFontSize($fontsize, 0);
      }
      var btns = ['smallbtn', 'normalbtn', 'largebtn'];
      $.each(btns, function(idx, btn){
        var btnName = btn.replace('btn', '');
        var btnSelector = self.options[btn];
        if(btnSelector !== null){
          var el = $(btnSelector, self.$el);
          if(el){
            btn = {
              name: btnName,
              el: el
            };
            self[btnName] = btn;
            self.initBtn(btn);
          }
        }
      });
    }
  });

  return Accessibility;

});

