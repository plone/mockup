define([
  'underscore',
  'react',
  'scroller',
  'js/components/plonelogo'
], function(_, React, Scroller, PloneLogo) {
  "use strict";

  var d = React.DOM,
      ToolbarBurger;

  ToolbarBurger = React.createClass({

    displayName: 'ToolbarBurger',

    propTypes: {
      isMobile: React.PropTypes.bool,
      isClosed: React.PropTypes.bool,
      position: React.PropTypes.oneOf([ 'left', 'right', 'top', 'bottom' ]),
      scroller: React.PropTypes.instanceOf(Scroller)
    },

    getDefaultProps: function() {
      return {
        key: 'burger'
      }
    },

    handleTouchStart: function(e) {
      console.log('handleTouchStart')
      if (!this.props.scroller) {
        return;
      }
      this.props.scroller.doTouchStart(e.touches, e.timeStamp);
      e.preventDefault();
    },

    handleTouchMove: function(e) {
      console.log('handleTouchMove')
      if (!this.props.scroller) {
        return;
      }
      this.props.scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
      e.preventDefault();
    },

    handleTouchEnd: function(e) {
      console.log('handleTouchEnd')
      if (!this.props.scroller) {
        return;
      }
      this.props.scroller.doTouchEnd(e.timeStamp);
      e.preventDefault();
    },

    render: function() {
      var burgerStyles = {
            position: 'fixed',
          };

      if (this.props.isMobile) {
        if (this.props.isClosed) {
          switch (this.props.position) {
            case 'left':
              _.extend(burgerStyles, {
                width: this.props.size + 'px',
                height: this.props.size + 'px',
                left: 0,
                top: 0
             });
             break;
          }
        } else {
          console.warn('To be implemented!');
        }
      } else {
        if (this.props.isClosed) {
          console.warn('To be implemented!');
        } else {
          console.warn('To be implemented!');
        }
      }

      return (
        d.div({
          onTouchStart: this.handleTouchStart,
          onTouchMove: this.handleTouchMove,
          onTouchEnd: this.handleTouchEnd,
          onTouchCancel: this.handleTouchEnd,
          className: 'toolbar-burger',
          style: burgerStyles
        }, PloneLogo({ size: this.props.size * 0.8,
                       margin: this.props.size * 0.1 }))
      );

    }
  });

  return ToolbarBurger;

});
