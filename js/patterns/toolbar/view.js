define([
  'underscore',
  'react',
  'scroller',
  'js/patterns/toolbar/burger',
  'js/patterns/toolbar/menu'
], function(_, React, Scroller, ToolbarBurger, ToolbarMenu) {
  "use strict";

  var div = React.DOM.div,
      toolbarWrapperStyles = { position: 'fixed', zIndex: 2000},
      toolbarPositionStyles = {
        left: { height: '100%', left: 0, top: 0 },
        right: {},
        top: {},
        bottom: {}
      };

  var ToolbarView = React.createClass({

    displayName: 'ToolbarView',

    propTypes: {
      burgerSize: React.PropTypes.number,
      isMobile: React.PropTypes.bool,
      position: React.PropTypes.oneOf([ 'left', 'right', 'top', 'bottom' ]),
      size: React.PropTypes.number
    },

    getInitialState: function() {
      return {
        burgerSize: this.props.burgerSize,
        isClosed: true,
        isMobile: this.props.isMobile,
        position: this.props.position,
        scrollPosition: 0,
        size: this.props.size
      };
    },

    componentWillMount: function() {
      console.log('componentWillMount')
      var self = this;
      self.scroller = new Scroller(function(left, top, zoom) {
        console.log('scroller')
        console.log(self.state.size);
        console.log(left + ' : ' + top + ' : ' + zoom);
        debugger;
        if (self.state.size === left) {
          return;
        }
        if (self.state.position.indexOf(['left', 'right'])) {
          self.setState({ scrollPosition: left });
        } else if (self.state.position.indexOf(['top', 'bottom'])) {
          self.setState({ scrollPosition: top });
        }
      }, {
        bouncing: false,
        scrollingX: self.state.position.indexOf(['left', 'right']),
        scrollingY: self.state.position.indexOf(['top', 'bottom']),
        snapping: true
      });
    },

    componentDidMount: function() {
      console.log('componentDidMount')
      this._measure();
    },

    _measure: function() {
      var node = this.getDOMNode().children[1];  // toolbar menu element
      console.log('measure')
      if (this.state.position.indexOf(['left', 'right'])) {
        console.log(node.clientWidth)
        console.log(node.clientHeight)
        console.log(node.clientWidth + this.state.size)
        console.log(node.clientHeight)
        this.scroller.setDimensions(
          node.clientWidth,
          node.clientHeight,
          node.clientWidth + this.state.size,
          node.clientHeight
        );
        this.scroller.setPosition(-1 * node.clientWidth, 0);
        this.scroller.setSnapSize(this.state.size, node.clientHeight);
        this.scroller.scrollTo(this.state.size, 0);
      } else if (this.state.position.indexOf(['top', 'bottom'])) {
        this.scroller.setDimensions(
          node.clientWidth,
          node.clientHeight,
          node.clientWidth,
          node.clientHeight + this.state.size
        );
        this.scroller.setSnapSize(node.clientWidth, this.state.size);
        this.scroller.scrollTo(0, this.state.size);
      }
    },

    componentDidUpdate: function(prevProps) {
      console.log('componentDidUpdate')
      console.log(this.state.size)
      console.log(prevProps.size)
      if (this.state.size !== prevProps.size) {
        this._measure();
      }
    },

    render: function() {
      return (
        div({
          className: ['toolbar-wrapper', 'toolbar-position-' + this.state.position ].join(' '),
          style: _.extend(
            toolbarWrapperStyles,
            toolbarPositionStyles[this.state.position]
            //{ width: this.state.size + 'px' }
          )
        }, [
          ToolbarBurger({
            key: 'burger',
            size: this.state.burgerSize,
            isMobile: this.state.isMobile,
            isClosed: this.state.isClosed,
            position: this.state.position,
            scroller: this.scroller
          }),
          ToolbarMenu({
            key: 'menu',
            size: this.state.size,
            scrollPosition: this.state.scrollPosition
          })
        ])
      );
    }
  });

  return ToolbarView;

});

