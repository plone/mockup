define([
  'react'
], function(React) {
  "use strict";

  var d = React.DOM,
      ToolbarMenu;

  ToolbarMenu = React.createClass({

    displayName: 'ToolbarMenu',

    propTypes: {
      size: React.PropTypes.number,
      scrollPosition: React.PropTypes.number
    },

    getDefaultProps: function() {
      return {
        key: 'menu'
      }
    },

    render: function() {
      return (
        d.div({
          className: 'toolbar-container',
          style: {
            background: 'red',
            bottom: '0px',
            left: (this.props.size * -1 + this.props.scrollPosition) + 'px',
            position: 'absolute',
            top: '0px',
            width: this.props.size + 'px'
          }
        },
          d.div({ className: 'toolbar-container'}, [
            // TODO: icons and menu comes here
          ])
        )
      );
    }
  });

  return ToolbarMenu;

});
