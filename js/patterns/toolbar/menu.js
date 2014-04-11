define([
  'react',
  'scroller',
  'js/patterns/toolbar/menuitems'
], function(React, Scroller, toolbarMenuItems, undefined) {
  'use strict';

  var ToolbarMenu = React.createClass({

    displayName: 'ToolbarMenu',

    propTypes: {
      backLabel: React.PropTypes.string,
      items: React.PropTypes.arrayOf(React.PropTypes.object),
      size: React.PropTypes.number,
      '3DTransform': React.PropTypes.object
    },

    getDefaultProps: function() {
      return {
        backLabel: 'Back',
        items: [],
        size: 100,
        '3DTransform': {
          'transform': false,
          '3DTranslate': false,
          '3DRotate': false
        }
      };
    },

    getInitialState: function() {
      return {
        selected: [0],
        scrollPosition: 0
      };
    },

    _setScrollPosition: function(left, top, zoom) {
      this.setState({ scrollPosition: left });
    },

    _measure: function() {
      this.scroller.setDimensions(
        this.props.size, 100,
        this.props.size * this.state.selected.length, 100
      );
      this.scroller.setSnapSize(this.props.size, 100);
    },

    componentWillMount: function() {
      this.scroller = new Scroller(this._setScrollPosition, {
        bouncing: false,
        scrollingX: true,
        scrollingY: false,
        snapping: true
      });
      this._measure();
    },

    componentDidUpdate: function(prevProps, prevState) {
      if (this.state.selected !== prevState.selected) {
        this._measure();
        this.scroller.scrollTo(this.props.size * (this.state.selected.length - 1), 0, true);
      }
    },

    render: function() {
      var menuStyle = {};

      if (this.state.scrollPosition !== 0) {
        if (this.props['3DTransform'].transform) {
          if (this.props['3DTransform']['3DTranslate']) {
            menuStyle[this.props['3DTransform'].transform] = 'translate3d(-' + this.state.scrollPosition + 'px, 0px, 0px)';
          } else {
            menuStyle[this.props['3DTransform'].transform] = 'translateX(-' + this.props.scrollPosition + 'px)';
          }
        } else {
          menuStyle.left = '-' + this.props.scrollPosition + 'px';
        }
      }

      return (
        toolbarMenuItems({
          backLabel: this.props.backLabel,
          items: this.props.items,
          menu: this,
          menuStyle: menuStyle,
          selected: this.state.selected,
          size: this.props.size
        })
      );
    }

  });

  return ToolbarMenu;

});
