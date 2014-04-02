define([
  'react'
], function(React) {
  "use strict";

  var D = React.DOM,
      SearchResults;

  SearchResults = React.createClass({

    displayName: 'SearchResults',

    propTypes: {
      results: React.PropTypes.arrayOf(React.PropTypes.object),
      i18n: React.PropTypes.object
    },

    render: function() {
      var self = this;
      return (
        D.ul({
          className: 'search-results',
        }, this.props.results.map(function(item) {
          return D.li({
            key: self.props.results.indexOf(item),
            className: 'search-result',
            dangerouslySetInnerHTML: { __html: this.props.html }
          });
        }))
      );
    }
  });

  return SearchResults;
});
