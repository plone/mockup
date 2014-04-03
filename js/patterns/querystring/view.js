define([
  'react',
  'js/components/patterns',
  'mockup-patterns-select2'
], function(React, ReactPatterns) {
  "use strict";

  var D = React.DOM,
      QuerystringView;

  QuerystringView = React.createClass({

    displayName: 'QuerystringView',

    propTypes: {
    },

    getInitialState: function() {
      return {
        criteria: [],
        preview: []
      };
    },

    render: function() {
      var sortable_indexes = this.state.criteria.sortable_indexes || {};
      return (
        D.div({ className: 'querystring-wrapper' }, [

          // criteria
          D.div({ key: 0, className: 'querystring-criteria-wrapper' }, [
            D.span({ key: 0, className: 'querystring-criteria-label' },
              this.props.i18n.criteria),
            D.div({ key: 1, className: 'querystring-criteria' },
              'TODO: criteria'
            )
          ]),

          // sort
          D.div({ key: 1, className: 'querystring-sort-wrapper' }, [
            D.span({ key: 0, className: 'querystring-sort-label'},
              this.props.i18n.sort),
            D.div({ key: 1, className: 'querystring-sort'}, [
              ReactPatterns({},
                D.input({
                  key: 0,
                  className: 'pat-select2',
                  'data-pat-select2': JSON.stringify({
                    width: '10em',
                    data: Object.keys(sortable_indexes).map(function(key) {
                      return {
                        id: key,
                        text: sortable_indexes[key].title 
                      };
                    })
                  })
                })
              ),
              D.div({ key: 1, className: 'querystring-sort-reverse' }, [
                D.input({ key: 0, type: 'checkbox' }),
                D.span({ key: 1 }, this.props.i18n.reverse)
              ])
            ])
          ]),

          // preview
          D.div({ key: 2, className: 'querystring-preview-wrapper' }, [
            D.span({ key: 0, className: 'querystring-preview-label' },
              this.props.i18n.preview),
            D.div({ key: 1, className: 'querystring-preview' },
              D.ul({}, this.state.preview.map(function(item) {
                return D.li({
                  key: self.state.preview.indexOf(item),
                  className: 'search-result',
                  dangerouslySetInnerHTML: { __html: this.props.html }
                });
              }))
            )
          ])
        ])
      );
    }
  });

  return QuerystringView;
});
