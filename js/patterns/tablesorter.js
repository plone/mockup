// Pattern which provides sorting ability for a table
//
// Author: Franco Pellegrini
// Contact: frapell@gmail.com
// Version: 1.0
//
// Taken from the original table_sorter.js from Plone
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

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  undef:true, strict:true, trailing:true, browser:true, evil:true */
/*global define:false */


define([
  'jquery',
  'js/patterns/base',
], function($, Base, Parser) {
  "use strict";

  var TableSorter = Base.extend({
    name: "tablesorter",
    defaults: {},
    sortabledataclass: function (cell){
      var re, matches;
    
      re = new RegExp("sortabledata-([^ ]*)","g");
      matches = re.exec(cell.attr('class'));
      if (matches) { return matches[1]; }
        else { return null; }
    },
    sortable: function (cell) {
      var self = this;
        // convert a cell into something sortable

      // use sortabledata-xxx cell class if it is defined
      var text = self.sortabledataclass(cell);
      if (text === null) { text = cell.text(); }

      // A number, but not a date?
        if (text.charAt(4) !== '-' && text.charAt(7) !== '-' && !isNaN(parseFloat(text))) {
            return parseFloat(text);
        }
        return text.toLowerCase();
    },
    sort: function ($this) {
      var self = this;
      var th, colnum, table, tbody, reverse, index, data, usenumbers, tsorted;
      th = $($this).closest('th');
      colnum = $('th', $($this).closest('thead')).index(th);
      table = $($this).parents('table:first');
      tbody = table.find('tbody:first');
      tsorted = parseInt(table.attr('sorted') || '-1', 10);
      reverse = tsorted === colnum;

      $($this).parent().find('th .sortdirection')
          .html('&#x2003;');
      $($this).children('.sortdirection').html(
          reverse ? '&#x25bc;': '&#x25b2;' );

      index = $($this).parent().children('th').index($this),
      data = [],
      usenumbers = true;
      tbody.find('tr').each(function() {
          var cells, sortableitem;

          cells = $(this).children('td');
          sortableitem = self.sortable.apply(self, [cells.slice(index,index+1)]);
          if (isNaN(sortableitem)) { usenumbers = false; }
          data.push([
              sortableitem,
              // crude way to sort by surname and name after first choice
              self.sortable.apply(self, [cells.slice(1,2)]), 
              self.sortable.apply(self, [cells.slice(0,1)]),
              this]);
      });

      if (data.length) {
          if (usenumbers) {
              data.sort(function(a,b) {return a[0]-b[0];});
          } else {
              data.sort();
          }
          if (reverse) { data.reverse(); }
          table.attr('sorted', reverse ? '' : colnum);

          // appending the tr nodes in sorted order will remove them from their old ordering
          tbody.append($.map(data, function(a) { return a[3]; }));
          // jquery :odd and :even are 0 based
          tbody.each(self.setoddeven);
      }
    },

    setoddeven: function () {
      var tbody = $(this);
      // jquery :odd and :even are 0 based
      tbody.find('tr').removeClass('odd').removeClass('even')
          .filter(':odd').addClass('even').end()
          .filter(':even').addClass('odd');
    },

    init: function() {
      var self = this;
      // set up blank spaceholder gif
      var blankarrow = $('<span>&#x2003;</span>').addClass('sortdirection');
      // all listing tables not explicitly nosort, all sortable th cells
      // give them a pointer cursor and  blank cell and click event handler
      // the first one of the cells gets a up arrow instead.
      self.$el.find('thead th').append(blankarrow.clone())
          .css('cursor', 'pointer')
          .on("click", function(e) {
            self.sort.apply(self, [this]);
          });
          
      self.$el.children('tbody').each(self.setoddeven);
      
    }
  });

  return TableSorter;

});

