define([
  'react'
], function(React, undefined) {
  "use strict";

  var Touchable = React.createClass({

    displayName: 'Touchable',

    propTypes: {
      className: React.PropTypes.string,
      component: React.PropTypes.component,
      scrollPosition: React.PropTypes.number,
      scroller: React.PropTypes.object,
      style: React.PropTypes.object
    },

    getDefaultProps: function() {
      return {
        className: '',
        component: React.DOM.div,
        scrollPosition: 0,
        scroller: undefined,
        style: {}
      };
    },

    handleTouchStart: function(e) {
      if (this.props.scroller) {
        this.props.scroller.doTouchStart(e.touches, e.timeStamp);
      }
      e.preventDefault();
    },

    handleTouchMove: function(e) {
      if (this.props.scroller) {
        this.props.scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
      }
      e.preventDefault();
    },

    handleTouchEnd: function(e) {
      if (this.props.scroller) {
        this.props.scroller.doTouchEnd(e.timeStamp);
      }
      e.preventDefault();
    },

    render: function() {
      return (
        this.props.component({
          onTouchStart: this.handleTouchStart,
          onTouchMove: this.handleTouchMove,
          onTouchEnd: this.handleTouchEnd,
          onTouchCancel: this.handleTouchEnd,
          className: this.props.className,
          style: this.props.style
        }, this.props.children)
      );
    }

  });

  return Touchable;

});
