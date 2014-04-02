define([
  'react',
], function(React) {
  "use strict";

  var D = React.DOM,
      searchFilterby;

  searchFilterby = React.createClass({

    displayName: 'searchFilterby',

    propTypes: {
    },

    render: function() {
      return (
        D.div({
          className: 'search-filterby',
        }, 'filterby')
      );
    }
  });

  return searchFilterby;
});
