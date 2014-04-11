define([
  'react',
  'scroller',
  'js/components/touchable',
  'js/components/plonelogo',
  'js/patterns/toolbar/menu'
], function(React, Scroller, Touchable, PloneLogo, ToolbarMenu,
            undefined) {
  "use strict";

  var ToolbarView = React.createClass({

    displayName: 'ToolbarView',

    propTypes: {
      backLabel: React.PropTypes.string,
      endOpacity: React.PropTypes.number,
      logoSize: React.PropTypes.number,
      menuItems: React.PropTypes.arrayOf(React.PropTypes.object),
      position: React.PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
      size: React.PropTypes.number,
      startOpacity: React.PropTypes.number,
      touchableSize: React.PropTypes.number,
      '3DTransform': React.PropTypes.object
    },

    getDefaultProps: function() {
      return {
        backLabel: 'Back',
        endOpacity: 0.9,
        logoSize: 50,
        menuItems: [],
        position: 'left',
        size: 100,
        startOpacity: 0.2,
        touchableSize: 10,
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
          node.clientWidth + 2 * this.props.size,
          node.clientHeight
        );
      } else if (this.props.position === 'bottom') {
        this.scroller.setDimensions(
          node.clientWidth,
          node.clientHeight,
          node.clientWidth,
          node.clientHeight + 2 * this.props.size
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

    getScrollPositionStyle: function(size, offsetPosition) {
      var style = { position: 'fixed' };
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

    onTouchTapLogo: function(e) {
      e.preventDefault();
      e.stopPropagation();

      if (this.state.scrollPosition === this.props.size) {
        this.scroller.scrollTo(this.props.size, 0, true);
      } else {
        this.scroller.scrollTo(0, 0, true);
      }
    },

    render: function() {
      var touchableSize = this.props.touchableSize,
          menuStyle = this.getScrollPositionStyle(this.props.size, -1 * this.props.size);

      menuStyle.overflow = 'hidden';
      menuStyle.opacity = (((this.props.endOpacity - this.props.startOpacity) / this.props.size) * this.state.scrollPosition) + this.props.startOpacity;

      if (this.state.scrollPosition === this.props.size) {
        if (['left', 'right'].indexOf(this.props.position) !== -1) {
          touchableSize = $(window).width() - this.props.size;
        } else if (['top', 'bottom'].indexOf(this.props.position) !== -1) {
          touchableSize = $(window).height() - this.props.size;
        }
      }

      return (
        React.DOM.div({
          className: 'toolbar-wrapper toolbar-position-' + this.props.position 
        }, [
          Touchable({
            key: 'logo',
            className: 'toolbar-logo',
            scroller: this.scroller,
            style: this.getScrollPositionStyle(touchableSize),
            onTouchTap:  this.onTouchTapLogo
          }, PloneLogo({ size: this.props.logoSize,
                         style: this.getLogoStyle() })),
          Touchable({
            key: 'menu',
            className: 'toolbar-menu',
            style: menuStyle
          }, ToolbarMenu({
            backLabel: this.props.backLabel,
            items: this.props.menuItems,
            size: this.props.size,
            '3DTransform': this.props['3DTransform']
          }))
        ])
      );
    }

  });

  return ToolbarView;

});
