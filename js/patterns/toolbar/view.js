define([
  'underscore',
  'react',
  'scroller',
  'js/components/touchable',
  'js/components/plonelogo'
], function(_, React, Scroller, Touchable, PloneLogo, undefined) {
  "use strict";

  var ToolbarView = React.createClass({

    displayName: 'ToolbarView',

    propTypes: {
      position: React.PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
      size: React.PropTypes.number,
      '3DTransform': React.PropTypes.object
    },

    getDefaultProps: function() {
      return {
        position: 'left',
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
        scrollPosition: 0
      };
    },

    _setScrollPosition:function(left, top, zoom) {
      if (['left', 'right'].indexOf(this.props.position) !== -1) {
        this.setState({ scrollPosition: Math.round(this.props.size - left) });
      } else if (['top', 'bottom'].indexOf(this.props.position) !== -1) {
        this.setState({ scrollPosition: Math.round(this.props.size - top) });
      }
    },

    _measure: function() {
      var node = this.getDOMNode().children[1];

      if (this.props.position === 'left') {
        this.scroller.setDimensions(
          node.clientWidth,
          node.clientHeight,
          node.clientWidth + this.props.size,
          node.clientHeight
        );
      } else if (this.props.position === 'top') {
        this.scroller.setDimensions(
          node.clientWidth,
          node.clientHeight,
          node.clientWidth,
          node.clientHeight + this.props.size
        );
      } else if (this.props.position === 'right') {
        this.scroller.setDimensions(
          node.clientWidth,
          node.clientHeight,
          node.clientWidth + this.props.size + ($(window).width() + 0.9),
          node.clientHeight
        );
      } else if (this.props.position === 'bottom') {
        this.scroller.setDimensions(
          node.clientWidth,
          node.clientHeight,
          node.clientWidth,
          node.clientHeight + this.props.size + ($(window).width() * 0.9)
        );
      }

      this.scroller.setSnapSize(node.clientWidth, node.clientHeight);

      if (['left', 'right'].indexOf(this.props.position) !== -1) {
        this.scroller.scrollTo(this.state.scrollPosition, 0);
      } else if (['top', 'bottom'].indexOf(this.props.position) !== -1) {
        this.scroller.scrollTo(0, this.state.scrollPosition);
      }
    },

    componentWillMount: function() {
      this.scroller = new Scroller(this._setScrollPosition, {
        bouncing: false,
        scrollingX: ['left', 'right'].indexOf(this.props.position) !== -1 ? true: false,
        scrollingY: ['top', 'bottom'].indexOf(this.props.position) !== -1 ? true: false,
        snapping: true
      });
    },

    componentDidMount: function() {
      this._measure();
    },

    componentDidUpdate: function(prevProps, prevState) {
    },

    getScrollPositionStyle: function(size, offsetPosition, background) {
      var style = { position: 'fixed', background: 'green' };

      if (background) {
        style.background = background;
      }
      offsetPosition = offsetPosition || 0;

      // width / height
      if (['left', 'right'].indexOf(this.props.position) !== -1) {
        style.width = size;
        style.height = '100%';
      } else if (['top', 'bottom'].indexOf(this.props.position) !== -1) {
        style.width = '100%';
        style.height = size;
      }

      // left / right / top / bottom / translateX / translate3d
      if (this.props.position === 'left') {
        style.top = 0;
        if (this.props['3DTransform'].transform) {
          style.left = offsetPosition;
          style[this.props['3DTransform'].transform] = '';
          if (this.props['3DTransform']['3DTranslate']) {
            style[this.props['3DTransform'].transform] = 'translate3d(' + this.state.scrollPosition + 'px, 0px, 0px)';
          } else {
            style[this.props['3DTransform'].transform] = 'translateX(' + this.state.scrollPosition + 'px)';
          }
        } else {
          style.left = (offsetPosition + this.state.scrollPosition) + 'px';
        }
      } else if (this.props.position === 'top') {
        style.right = 0;
        if (this.props['3DTransform'].transform) {
          style.top = offsetPosition;
          style[this.props['3DTransform'].transform] = '';
          if (this.props['3DTransform']['3DTranslate']) {
            style[this.props['3DTransform'].transform] = 'translate3d(0px, ' + this.state.scrollPosition + 'px, 0px)';
          } else {
            style[this.props['3DTransform'].transform] = 'translateY(' + this.state.scrollPosition + 'px)';
          }
        } else {
          style.top = (offsetPosition + this.state.scrollPosition) + 'px';
        }
      } else if (this.props.position === 'right') {
        style.bottom = 0;
        if (this.props['3DTransform'].transform) {
          style.right = offsetPosition;
          style[this.props['3DTransform'].transform] = '';
          if (this.props['3DTransform']['3DTranslate']) {
            style[this.props['3DTransform'].transform] = 'translate3d(' + this.state.scrollPosition + 'px, 0px, 0px)';
          } else {
            style[this.props['3DTransform'].transform] = 'translateX(' + this.state.scrollPosition + 'px)';
          }
        } else {
          style.right = (offsetPosition + this.state.scrollPosition) + 'px';
        }
      } else if (this.props.position === 'bottom') {
        style.left = 0;
        if (this.props['3DTransform'].transform) {
          style.bottom = offsetPosition;
          style[this.props['3DTransform'].transform] = '';
          if (this.props['3DTransform']['3DTranslate']) {
            style[this.props['3DTransform'].transform] = 'translate3d(0px, ' + this.state.scrollPosition + 'px, 0px)';
          } else {
            style[this.props['3DTransform'].transform] = 'translateY(' + this.state.scrollPosition + 'px)';
          }
        } else {
          style.bottom = (offsetPosition + this.state.scrollPosition) + 'px';
        }
      }

      return style;
    },

    getLogoStyle: function() {
      var style = { position: 'fixed' };

      if (this.props.position === 'left') {
        style.top = 0;
        style.left = 0;
      } else if (this.props.position === 'top') {
        style.top = 0;
        style.right = 0;
      } else if (this.props.position === 'right') {
        style.bottom = 0;
        style.right = 0;
      } else if (this.props.position === 'bottom') {
        style.bottom= 0;
        style.left = 0;
      }

      return style;
    },

    render: function() {
      return (
        React.DOM.div({
          className: 'toolbar-wrapper'
        }, [
          Touchable({
            key: 'logo',
            className: 'toolbar-logo',
            scroller: this.scroller,
            scrollPosition: this.state.scrollPosition,
            style: this.getScrollPositionStyle($(window).width() * 0.1),
          }, PloneLogo({ size: 100, style: this.getLogoStyle() })),
          React.DOM.div({
            key: 'menu',
            className: 'toolbar-menu',
            style: this.getScrollPositionStyle(this.props.size, -1 * this.props.size, 'red')
          })
        ])
      );
    }

  });

  return ToolbarView;

});

