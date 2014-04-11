define([
  'jquery',
  'react',
  'scroller'
], function($, React, Scoller, undefined) {
  'use strict';

  var toolbarMenuItems = React.createClass({

    displayName: 'ToolbarMenuItems',

    propTypes: {
      backLabel: React.PropTypes.string,
      index: React.PropTypes.number,
      items: React.PropTypes.arrayOf(React.PropTypes.object),
      level: React.PropTypes.number,
      menu: React.PropTypes.component,
      menuStyle: React.PropTypes.object,
      selected: React.PropTypes.arrayOf(React.PropTypes.number),
      size: React.PropTypes.number
    },

    getDefaultProps: function() {
      return {
        backLabel: 'Back',
        index: 0,
        items: [],
        level: 0,
        menuStyle: {},
        selected: []
      };
    },

    handleMenuItemTap: function(e) {
      var selected = this.props.menu.state.selected.slice(0),
          $item = $(e.target).parents('li').first(),
          index = $item.parent().children().index($item);

      e.preventDefault();
      e.stopPropagation();

      if ($(e.target).parents('li').first().find('>ul').size() !== 0) {
        selected = selected.concat([index]);
        this.props.menu.setState({ selected: selected });

      } else if (this.props.level !== 0 && index === 0) {
        selected.pop();
        this.props.menu.setState({ selected: selected });

      } else {
        window.location.href = $(e.target).parents('a').attr('href');
      }
    },

    render: function() {
      var self = this,
          selected = this.props.selected.slice(0),
          current = selected.shift(0),
          menuStyle = {
            marginLeft: 0,
            marginRight: 0,
            paddingLeft: 0,
            paddingRight: 0,
            width: this.props.size,
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0
          };

      if (this.props.index !== current) {
        menuStyle.display = 'none';
      }

      if (this.props.level === 0) {
        for (var i in this.props.menuStyle) {
          menuStyle[i] = this.props.menuStyle[i];
        }
      } else {
        menuStyle.left = this.props.size;
      }

      return (
        React.DOM.ul({
          className: 'toolbar-menu-level-' + this.props.level,
          style: menuStyle
        }, this.props.items.map(function(item, i) {
          item.href = item.href || '#';
          item.id = item.id || '';
          item.items = item.items || [];
          return React.DOM.li(
            { key: 'menuitem-' + i, id: item.id },
            [
              React.DOM.a({
                key: 'link',
                href: item.href,
                onTouchTap: self.handleMenuItemTap
              }, [
                React.DOM.span({ key: 'icon', className: 'toolbar-icon' }),
                React.DOM.span({
                  key: 'text',
                  className: 'toolbar-text',
                  dangerouslySetInnerHTML: { __html: item.html }
                })
              ].concat(item.items.length > 0 ? [React.DOM.span({ key: 'caret', className: 'toolbar-caret' })] : []))
            ].concat(item.items.length > 0 ? toolbarMenuItems({
              key: 'menu',
              index: i,
              items: [{
                id: 'toolbar-icon-back',
                html: self.props.backLabel
              }].concat(item.items),
              level: self.props.level + 1,
              selected: selected,
              menu: self.props.menu,
              size: self.props.size
            }) : [])
          );
        }))
      );
    }

  });

  return toolbarMenuItems;

});
