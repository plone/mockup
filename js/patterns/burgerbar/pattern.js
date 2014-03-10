/* Burgerbar pattern.
 *
 * Options:
 *    name(type): Description (defaultvalue)
 *
 * Documentation:
 *    # Example
 *
 *    {{ example-1 }}
 *
 * Example: example-1
 *    <div class="pat-burgerbar">
 *      <div>
 *        <a href="#" class="burgerbar-menuitem-add-content">Add...</a>
 *        <ul>
 *          <li><a href="#">Folder contents</a></li>
 *          <li><a href="#">View</a></li>
 *          <li><a href="#">Edit</a></li>
 *          <li><a href="#"></a></li>
 *        </ul>
 *      </div>
 *      <div>
 *        <a href="#" class="burgerbar-menuitem-edit">Edit</a>
 *      </div>
 *      <div>
 *        <a href="#" class="burgerbar-menuitem-browse">Browse</a>
 *      </div>
 *    </div>
 *
 * License:
 *    Copyright (C) 2010 Plone Foundation
 *
 *    This program is free software; you can redistribute it and/or modify it
 *    under the terms of the GNU General Public License as published by the
 *    Free Software Foundation; either version 2 of the License.
 *
 *    This program is distributed in the hope that it will be useful, but
 *    WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
 *    Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License along
 *    with this program; if not, write to the Free Software Foundation, Inc.,
 *    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */


define([
  'jquery',
  'mockup-patterns-base',
  'react',
  'scroller'
], function($, Base, React, Scroller) {
  "use strict";

  var div = React.DOM.div,
      a = React.DOM.a,
      i = React.DOM.i,
      p = React.DOM.p,
      li = React.DOM.li,
      ul = React.DOM.ul,
      nav = React.DOM.nav,
      span = React.DOM.span,
      button = React.DOM.button,
      iframe = React.DOM.iframe,
      header = React.DOM.header,
      footer = React.DOM.footer;

  var BurgerBarPattern = React.createClass({
    getInitialState: function() {
      return {
        isMobile: true,
        isExpanded: false,
        isHidden: false,
        scrollLeft: 0
      };
    },
    componentWillMount: function() {
      var self = this;
      self.scroller = new Scroller(function(left, top, zoom) {
          self.setState({ scrollLeft: left });
      }, {
        bouncing: false,
        scrollingX: true,
        scrollingY: false,
        snapping: true
      });
    },
    componentDidMount: function() {
      var node = this.getDOMNode();
      this.scroller.setDimensions(
        node.clientWidth,
        node.clientHeight,
        node.clientWidth + 130,
        node.clientHeight
      );
      this.scroller.setSnapSize(130, node.clientHeight);
      this.scroller.scrollTo(130, 0);
    },
    handleExpand: function() {
      if (this.state.isExpanded) {
        this.setState({ isExpanded: false });
      } else {
        this.setState({ isExpanded: true });
      }
    },
    handleHide: function() {
    },
    render: function() {

      var Buttons = null,
          HideButton = null,
          wrapperClassName = 'pat-burgerbar-wrapper';


      if (!this.state.isMobile) {

        if (this.state.isExpanded) {
          wrapperClassName += ' pat-burgerbar-expanded'
        } else if (this.state.isHidden) {
          wrapperClassName += ' pat-burgerbar-hidden'
        }

        HideButton = button({
          key: 'btn-hide',
          type: 'button',
          className: 'btn-hide',
          onClick: this.handleHide
        }, i({ className: 'glyphicon glyphicon-arrow-down' }, null));

        Buttons = div({ key: 'btns-level0', className: 'btns-level0' }, [
          ul({}, [
            li({ key: 'contentview-folderContents', id: 'contentview-folderContents'},
              a({ href: '#/folder_contents' }, [
                i({ className: 'icon-folderContents', 'aria-hidden': 'true' }, null),
                span({ }, 'Contents')
              ])),
            li({ key: 'contentview-view', id: 'contentview-view' },
              a({ href: '#/' }, [
                i({ className: 'icon-view', 'aria-hidden': 'true' }, null),
                span({ }, 'View')
              ])),
            li({ key: 'contentview-edit', id: 'contentview-edit' },
              a({ href: '#/edit' }, [
                i({ className: 'icon-edit', 'aria-hidden': 'true' }, null),
                span({ }, 'Edit')
              ])),
            li({ key: 'contentview-local_roles', id: 'contentview-local_roles' },
              a({ href: '#/@@sharing' }, [
                i({ className: 'icon-local_roles', 'aria-hidden': 'true' }, null),
                span({ }, 'Share')
              ]))
          ])
        ]);
      }

      var wrapperStyle = {};
      console.log(this.state.scrollLeft);


      return (
        div({ style: wrapperStyle, className: wrapperClassName, role: 'navigation'}, [
          button({
            key: 'btn-expand',
            type: 'button',
            className: 'btn-expand',
            onClick: this.handleExpand
          }, this.state.isExpanded ?
            i({ className: 'glyphicon glyphicon-arrow-left' }, null) :
            i({ className: 'glyphicon glyphicon-arrow-right' }, null)),
          Buttons,
          HideButton
        ])
      );
    }
  });

  var BurgerBar = Base.extend({
    name: 'burgerbar',
    defaults: {
      mobileWidth: 361
    },
    init: function() {
      var self = this;

      self.view = new BurgerBarPattern({
        mobileWidth: self.options.mobileWidth
      });

      React.renderComponent(self.view, self.$el[0]);

      self.isMobile();
      $(window).on('resize', function(e) { self.isMobile.call(self); });
    },
    isMobile: function() {
      this.view.setState({
        isMobile: $(window).width() < this.options.mobileWidth
      });
    }
  });

  return BurgerBar;

});
/*

  <BurgerBarPattern>
    <BurgerBarExpendButton />
    <BurgerBarButtons>  ... <<<<< AnimatableContainer
      <BurgerBarButton />
      <BurgerBarButton />
      <BurgerBarButton>
        <BurgerBarButtons>
          <BurgerBarButton />
          <BurgerBarButton />
          <BurgerBarButton />
        </BurgerBarButtons>
      </BurgerBarButton>
    </BurgerBarButtons>
  </BurgerPattern>

            header({ id: 'edit-bar' }, [
              div({ className: 'contentViewsWrapper' }, [
                p({ className: 'hiddenStructure' }, 'Views'),
                ul({ className: 'contentViews', id: 'content-views'}, [
                  li({ id: 'contentview-folderContents', className: 'plain' }, a({ href: '#/folder_contents', className: 'icon-folderContents', 'aria-hidden': 'true' }, span({ className: 'text-toolbar' }, 'Contents'))),
                  li({ id: 'contentview-view', className: 'selected' }, a({ href: '#/', className: 'icon-view', 'aria-hidden': 'true' }, span({ className: 'text-toolbar' }, 'View'))),
                  li({ id: 'contentview-edit', className: 'plain' }, a({ href: '#/edit', className: 'icon-edit', 'aria-hidden': 'true' }, span({ className: 'text-toolbar' }, 'Edit'))),
                  li({ id: 'contentview-local_roles', className: 'plain' }, a({ href: '#/@@sharing', className: 'icon-local_roles', 'aria-hidden': 'true' }, span({ className: 'text-toolbar' }, 'Share')))
                ])
              ])
            ])
 */
