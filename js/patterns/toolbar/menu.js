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
          className: 'toolbar-menu',
          style: {
            background: 'red',
            position: 'absolute',
            //left: ((-1 * this.props.size) + this.props.scrollPosition) + 'px',
            '-webkit-transform': 'translate3d(' + this.props.scrollPosition + 'px, 0px, 0px)',
            left: (-1 * this.props.size) + 'px',
            top: '0px',
            bottom: '0px',
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
