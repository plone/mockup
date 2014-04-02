define([
  'react',
], function(React) {
  "use strict";

  var D = React.DOM,
      SearchSortby;

  SearchSortby = React.createClass({

    displayName: 'SearchSortby',

    propTypes: {
    },

    render: function() {
      return (
        D.div({
          className: 'search-sortby',
        }, 'sortby')
      );
    }
  });

  return SearchSortby;
});
