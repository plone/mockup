define([
  'react',
  'js/patterns/search/input',
  'js/patterns/search/results'
], function(React, SearchInput, SearchResults) {
  "use strict";

  var D = React.DOM,
      SearchView;

  SearchView = React.createClass({

    displayName: 'SearchView',

    propTypes: {
      isLive: React.PropTypes.bool,
      ajaxSearch: React.PropTypes.any.isRequired,
      labelSearch: React.PropTypes.string
    },

    getInitialState: function() {
      return {
        results: []
      };
    },

    render: function() {
      return (
        D.div({
          className: 'search-wrapper',
        }, [
            SearchInput({
              isLive: this.props.isLive,
              ajaxSearch: this.props.ajaxSearch,
              labelSearch: this.props.labelSearch
            }),
              SearchResults({results: this.state.results})
           ]
         )
      );
    }
  });

  return SearchView;
});
