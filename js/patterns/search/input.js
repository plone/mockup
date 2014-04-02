define([
  'react',
  'js/patterns/search/filterby',
  'js/patterns/search/sortby'
], function(React, SearchFilterby, SearchSortby) {
  "use strict";

  var D = React.DOM,
      SearchInput;

  SearchInput = React.createClass({

    displayName: 'SearchInput',

    propTypes: {
      isLive: React.PropTypes.bool,
      ajaxSearch: React.PropTypes.any.isRequired,
      labelSearch: React.PropTypes.string,
    },

    getDefaultProps: function() {
      return {
        key: 'input'
      };
    },

    render: function() {
      var self = this,
          children = [
        D.input({type: 'text', ref: 'query'}),
        D.button({
          onClick: function(e){
            self.props.ajaxSearch(self.refs.query.getDOMNode().value.trim());
            e.preventDefault();
          }
        },
        this.props.labelSearch)
      ];

      if (!this.props.isLive) {
        children.push(SearchFilterby({}));
        children.push(SearchSortby({}));
      }

      return (
        D.div({
          className: 'search-input',
        }, children)
      );
    }
  });

  return SearchInput;
});
