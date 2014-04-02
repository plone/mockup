define([
  'react',
], function(React) {
  "use strict";

  var D = React.DOM,
      SearchResult;

  SearchResult = React.createClass({

    displayName: 'SearchResult',

    propTypes: {
      title: React.PropTypes.string,
      url: React.PropTypes.string,
      html: React.PropTypes.string
    },

    render: function() {
      return (
        D.div({
          className: 'search-result',
        }, D.a({
          alt: this.props.title,
          href: this.props.url,
          dangerouslySetInnerHTML: { __html: this.props.html }
        }))
      );
    }
  });

  return SearchResult;
});
