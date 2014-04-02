define([
  'react'
], function(React) {
  "use strict";

  var D = React.DOM,
      SearchInput;

  SearchInput = React.createClass({

    displayName: 'SearchInput',

    propTypes: {
      isLive: React.PropTypes.bool,
      ajaxSearch: React.PropTypes.any.isRequired,
      i18n: React.PropTypes.object
    },

    getInitialState: function() {
      return {
        query: '',
        filters: []
      };
    },

    render: function() {
      var self = this,
          children = [
        D.div({},[
          D.input({type: 'text', ref: 'query'}),
          D.button({
            onClick: function(e){
              self.props.ajaxSearch(self.refs.query.getDOMNode().value.trim());
              e.preventDefault();
            }
          },
          this.props.i18n['search-button'])
        ]),
        D.div({className: 'search-results-query'}, [
          D.span({}, this.props.i18n['results']),
          D.span({className: 'search-query'}, this.state.query)
        ]),
        D.div({className: 'search-advance'}, [
          D.div({className: 'search-filterby'}, [
            D.span({}),
            D.div({}, [
              D.a({}, this.prop.i18n['search-filterby']),
              D.div({}, filters)
            ])
          ]),
          D.div({className: 'search-sortby'}, [
            D.span({}, this.props.i18n['search-sortby']),
            D.ul({}, sorts)
          ])
        ])
      ];

      if (!this.props.isLive) {
        children.push(D.div({
          className: 'search-filterby',
        }, 'filterby'));

        children.push(D.div({
          className: 'search-sortby',
        }, 'sortby'));
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
