define([
  'react',
  'js/patterns/search/result'
], function(React, SearchResult) {
  "use strict";

  var D = React.DOM,
      SearchResults;

  SearchResults = React.createClass({

    displayName: 'SearchResults',

    propTypes: {
      results: React.PropTypes.arrayOf(React.PropTypes.object)
    },

    getDefaultProps: function() {
      return {
        key: 'results'
      };
    },

    render: function() {
      var self = this;
      return (
        D.div({
          className: 'search-results',
        }, this.props.results.map(function(item) {
          item.key = self.props.results.indexOf(item);
          return SearchResult(item);
        }))
      );
    }
  });

  return SearchResults;
});
