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
      i18n: React.PropTypes.object
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
              key: 'input',
              isLive: this.props.isLive,
              ajaxSearch: this.props.ajaxSearch,
              i18n: this.props.i18n
            }),
              SearchResults({
                key: 'results',
                results: this.state.results,
                i18n: this.props.i18n
              })
           ]
         )
      );
    }
  });

  return SearchView;
});
