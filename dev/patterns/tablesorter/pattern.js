/* Tablesorter pattern.
 *
 * Documentation:
 *    # Directions
 *
 *    - If the displayed data doesn't match the sequence (as in days of the
 *      week), provide a sortabledata-XXX class. The column will be sorted on
 *      XXX.
 *    - Note that a secondary sort is always done on the first two columns
 *      (by the second, and then by the first column). This provides a crude
 *      way to sort by surname and name. (Look at sequence of "Bluth" rows
 *      changing when sorting on Last Name.)
 *    - Rows get odd and even classes for CSS styling.
 *    - If something looks more like a date than like a number (specifically
 *      1999-01-01, not e.g. 01-01-1999) it will be sorted textually, not
 *      numerically. Dates aren't validated.
 *    - If something looks like a number, javascript will make some wild
 *      guesses about it. It can turn out weird (try sorting on the "No Date"
 *      column).
 *
 *    # Example
 *
 *    {{ example-1 }}
 *
 * Example: example-1
 *    <table class="pat-tablesorter">
 *      <thead>
 *        <th>First Name</th>
 *        <th>Last Name</th>
 *        <th>Occupation</th>
 *        <th>Age</th>
 *      </thead>
 *      <tr>
 *        <td>Buster</td>
 *        <td>Bluth</td>
 *        <td>Army</td>
 *        <td>35</td>
 *      </tr>
 *      <tr>
 *        <td>Michael</td>
 *        <td>Bluth</td>
 *        <td>Company President</td>
 *        <td>39</td>
 *      </tr>
 *      <tr>
 *        <td>GOB</td>
 *        <td>Bluth</td>
 *        <td>Magician</td>
 *        <td>37</td>
 *      </tr>
 *      <tr>
 *        <td>Lindsay</td>
 *        <td>Fünke</td>
 *        <td>Protester</td>
 *        <td>36</td>
 *      </tr>
 *      <tr>
 *        <td>Tony</td>
 *        <td>Wonder</td>
 *        <td>Magician</td>
 *        <td>35</td>
 *      </tr>
 *      <tr>
 *        <td>Tobias</td>
 *        <td>Fünke</td>
 *        <td>Therapist</td>
 *        <td>40</td>
 *      </tr>
 *    </table>
 *
 */


define([
  'jquery',
  'mockup-patterns-base'
], function($, Base) {
  'use strict';

  var TableSorter = Base.extend({
    name: 'tablesorter',
    trigger: '.pat-tablesorter',
    defaults: {},
    sortabledataclass: function (cell) {
      var re, matches;

      re = new RegExp('sortabledata-([^ ]*)','g');
      matches = re.exec(cell.attr('class'));
      if (matches) {
        return matches[1];
      } else {
        return null;
      }
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
      $($this).children('.sortdirection').html( reverse ? '&#x25bc;': '&#x25b2;' );

      index = $($this).parent().children('th').index($this);
      data = [];
      usenumbers = true;
      tbody.find('tr').each(function() {
        var cells, sortableitem;

        cells = $(this).children('td');
        sortableitem = self.sortable.apply(self, [cells.slice(index,index + 1)]);
        if (isNaN(sortableitem)) { usenumbers = false; }
        data.push([
          sortableitem,
          // crude way to sort by surname and name after first choice
          self.sortable.apply(self, [cells.slice(1,2)]),
          self.sortable.apply(self, [cells.slice(0,1)]),
          this
        ]);
      });

      if (data.length) {
        if (usenumbers) {
          data.sort(function(a,b) { return a[0] - b[0]; });
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
          .on('click', function(e) {
            self.sort.apply(self, [this]);
          });

      self.$el.children('tbody').each(self.setoddeven);

    }
  });

  return TableSorter;

});
