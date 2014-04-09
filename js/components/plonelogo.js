/*
 *
 *
 */

define([
  'underscore',
  'react',
  'js/components/styles'
], function(_, React, styles, undefined) {

  var d = React.DOM,
      ratio = 0.797,
      PloneLogo;

  PloneLogo = React.createClass({

    propTypes: {
      style: React.PropTypes.object,
      size: React.PropTypes.number,
      svg: React.PropTypes.object,
      svgpath: React.PropTypes.string
    },

    getDefaultProps: function() {
      return {
        style: {},
        size: 100,
        svg: {
          'xmlns': 'http://www.w3.org/2000/svg',
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          'xml:space': 'preserve',
          'version': '1.0',
          'enable-background': 'new 0 0 56 56',
          x: '0px',
          y: '0px',
          width: '215px',
          height: '26px',
          viewBox: '0 0 56 56',
          className: 'sr-plone-logo',
          id: 'sr-plone-logo'
        },
        svgpath: 'M28 0C12.537 0 0 12.5 0 28c0.001 15.5 12.5 28 28 28c15.464-0.003 27.998-12.536 28-28 C55.998 12.5 43.5 0 28 0z M43.759 43.759c-4.042 4.038-9.597 6.527-15.76 6.528c-6.164-0.001-11.717-2.492-15.759-6.528 C8.202 39.7 5.7 34.2 5.7 28c0.001-6.163 2.49-11.717 6.528-15.76C16.283 8.2 21.8 5.7 28 5.7 c6.164 0 11.7 2.5 15.8 6.528c4.039 4 6.5 9.6 6.5 15.76C50.286 34.2 47.8 39.7 43.8 43.759z M24.385 9.854c3.346 0 6.1 2.7 6.1 6.059c0 3.347-2.714 6.06-6.06 6.06s-6.059-2.712-6.059-6.06 C18.327 12.6 21 9.9 24.4 9.854z M42.764 28.017c0 3.349-2.711 6.059-6.061 6.059c-3.341 0-6.058-2.711-6.058-6.059 c0-3.348 2.719-6.058 6.058-6.058C40.054 22 42.8 24.7 42.8 28.017z M24.365 34.098c3.347 0 6.1 2.7 6.1 6.1 c0 3.347-2.712 6.06-6.059 6.06c-3.346 0-6.06-2.712-6.06-6.06C18.306 36.8 21 34.1 24.4 34.098z'
      }
    },

    getDotStyles: function(x, y) {
      return {
        display: 'block',
        position: 'absolute',
        width: this.props.size * (1 - ratio),
        height: this.props.size * (1 - ratio),
        borderRadius: this.props.size * (1 - ratio) / 2,
        top: y,
        left: x
      };
    },

    render: function() {
      var logoStyles = {
            wrapper: _.extend({
              background: this.props.backgroundColor,
              position: 'relative',
              fontSize: ratio * this.props.size,
              lineHeight: this.props.size,
            }, this.props.style),
            circle: {
              margin: this.props.size * 0.02,
              float: 'left',
              display: 'block',
              position: 'relative',
              width: this.props.size,
              height: this.props.size,
              backgroundColor: this.props.backgroundColor,
              borderRadius: this.props.size / 2
            },
            innerCircle: {
              display: 'block',
              position: 'absolute',
              width: this.props.size * ratio,
              height: this.props.size * ratio,
              borderRadius: this.props.size * ratio / 2,
              top: this.props.size * (1 - ratio) / 2,
              left: this.props.size * (1 - ratio) / 2
            },
            dot1: this.getDotStyles(
              (0.328 - (1 - ratio) / 2) * this.props.size,
              (0.180 - (1 - ratio) / 2) * this.props.size),
            dot2: this.getDotStyles(
              (0.547 - (1 - ratio) / 2) * this.props.size,
              (0.391 - (1 - ratio) / 2) * this.props.size),
            dot3: this.getDotStyles(
              (0.328 - (1 - ratio) / 2) * this.props.size,
              (0.609 - (1 - ratio) / 2) * this.props.size)
          };

      return (
        d.div({ className: 'plone-logo', type: 'button' }, [
          d.span({ key: '0', className: "plone-logo-screen-reader",
                   style: styles['screen-reader-only'] },
            d.svg(this.props.svg, d.path({d: this.props.svgpath}))
          ),
          d.span({ key: '1', className: 'plone-logo-wrapper',
                   style: logoStyles.wrapper },
            d.span({ className: 'plone-logo-circle',
                     style: logoStyles.circle },
              d.span({ className: 'plone-logo-innerCircle',
                       style: logoStyles.innerCircle }, [
                d.span({ key: '0', className: 'plone-logo-dot1',
                         style: logoStyles.dot1 }),
                d.span({ key: '1', className: 'plone-logo-dot2',
                         style: logoStyles.dot2 }),
                d.span({ key: '2', className: 'plone-logo-dot3',
                         style: logoStyles.dot3 })
              ])
            )
          )
        ])
      );
    }
  });
  return PloneLogo;

});
