// This plugin is used to put selected element into iframe.
//
// @author Rok Garbas
// @version 1.0
// @licstart  The following is the entire license notice for the JavaScript
//            code in this page.
//
// Copyright (C) 2010 Plone Foundation
//
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 2 of the License.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along with
// this program; if not, write to the Free Software Foundation, Inc., 51
// Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//
// @licend  The above is the entire license notice for the JavaScript code in
//          this page.
//

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  regexp:true, undef:true, strict:true, trailing:true, browser:true */


(function(window, document, undefined) {
"use strict";

// # IFrame Object
window.IFrame = function(el) { this.init(el); };
window.IFrame.prototype = {
  add: function(el) {
    var self = this, attr;

    // make sure original element is hidden
    el.setAttribute("style", "display:none;");

    //
    self.content += el.innerHTML;

    // get options from original element
    self.updateOption(el, 'name', 'noname_frame');
    self.updateOption(el, 'title', '');
    self.updateOption(el, 'doctype', '<!doctype html>');
    self.updateOption(el, 'style', '');
    self.updateOption(el, 'position', 'top');
    self.updateOption(el, 'resources', '');
    self.updateOption(el, 'styles', '');

  },
  updateOption: function(el, name, _default) {
    var self = this,
        option_name = 'data-iframe-' + name;
    if (name === 'name') {
      option_name = 'data-iframe';
    }
    var value = el.getAttribute(option_name);
    if (name === 'resources') {
      if (value) {
        value = value.split(';');
        for (var i = 0; i < value.length; i += 1) {
          var url = value[i].replace(/^\s+|\s+$/g, ''),
              resource = '', attrs = {}, attr;

          if (url.indexOf('?') !== -1) {
            var url2 = url.slice(url.indexOf('?') + 1, url.length).split('&');
            for (var j = 0; j < url2.length; j += 1) {
              attr = url2[j].split('=');
              if (attr[1][0] === "\"" || attr[1][0] === "'") {
                attr[1] = attr[1].slice(1, attr[1].length - 1);
              }
              attrs[attr[0]] = attr[1];
            }
            url = url.slice(0, url.indexOf('?'));
          }

          if (url.slice(-3) === '.js') {
            resource = document.createElement('script');
            resource.src = url;
            resource.type = 'text/javascript';
            resource.async = false;
          } else if (url.slice(-4) === '.css') {
            resource = document.createElement('link');
            resource.href = url;
            resource.type = 'text/css';
            resource.rel = 'stylesheet';
          } else if (url.slice(-5) === '.less') {
            resource = document.createElement('link');
            resource.href = url;
            resource.type = 'text/css';
            resource.rel = 'stylesheet/less';
          }

          if (resource !== '') {
            for (attr in attrs) {
              resource.setAttribute(attr, attrs[attr]);
            }
            self.resources += resource.outerHTML;
          }
        }
      }
    } else if (name === 'styles') {
      if (value) {
        var style_node = document.createElement('style');
        style_node.type = "text/css";
        style_node.textContent = value;
        self.resources += style_node.outerHTML;
      }
    }
    if (value) {
      self.options[name] = value;
    } else if (self.options[name] === undefined) {
      self.options[name] = _default;
    }
  },
  init: function(el) {
    var self = this;

    self.options = {};
    self.content = '';
    self.resources = '';
    self.loaded = false;

    self.add(el);

    // Create iframe
    var iframe = document.createElement('iframe');
    iframe.setAttribute('frameBorder', '0');
    iframe.setAttribute('border', '0');
    iframe.setAttribute('allowTransparency', 'true');
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('id', self.options.name);
    iframe.setAttribute('name', self.options.name);
    iframe.setAttribute('style', 'display:none;');

    document.body.appendChild(iframe);

    self.el = iframe;
    self.window = iframe.contentWindow;
    self.document = self.window.document;
  },
  open: function() {
    var self = this;
    self.document.open();
    self.document.write(
        self.options.doctype +
        '<html>' +
          '<head>' +
            '<title>' + self.options.title + '</title>' +
            '<meta http-equiv="X-UA-Compatible" content="IE=edge">' +
          '</head>' +
          '<body onload="parent.window.iframe[\'' +
              self.options.name + '\'].load()">' +
            self.content + self.resources +
          '</body>' +
        '</html>');
    self.document.close();
  },
  load: function() {
    var self = this;

    // check if already loaded
    if ( self.loaded === true ) {
      return;
    }

    // mark iframe as loaded
    self.loaded = true;

    self.document.body.setAttribute('style',
        (self.document.body.getAttribute('style') || '') +
        'background:transparent;');

    self.el.setAttribute('style', 'border:0;overflow:hidden;' +
        'position:absolute;left:0px;position:fixed;overflow:hidden;' +
        'width:100%;background-color:transparent;z-index:500;' +
        self.options.style);

    self.el.setAttribute('style', self.el.getAttribute('style') +
        'height:' + self.document.body.offsetHeight + 'px;');

    if (self.options.position === 'top') {
        self.el.setAttribute('style', self.el.getAttribute('style') +
            'top:0px;');
        document.body.setAttribute('style',
            (document.body.getAttribute('style') || '') +
            ';border-top:0' +
            ';margin-top:' + self.el.offsetHeight + 'px;');

    } else if(self.options.position === 'bottom') {
        self.el.setAttribute('style', self.el.getAttribute('style') +
            'bottom:0px;');
        document.body.setAttribute('style',
            (document.body.getAttribute('style') || '') +
            ';border-bottom:0' +
            ';margin-bottom:' + self.el.offsetHeight + 'px;');
    }

  }
};

// # Initialize
window.iframe_initialize = function() {
  var i,j, body, matching, iframe;

  // Check for DOM to be ready
  body = document.getElementsByTagName('body')[0];
  if (body === undefined) {
    window.setTimeout(window.iframe_initialize, 23);
    return;
  }

  // find [data-iframe] elements in context
  matching = [];
  if (document.querySelectorAll !== undefined) {
    matching = document.querySelectorAll('[data-iframe]');
  } else {
    var all = document.getElementsByTagName('*');
    for (i = 0; i < all.length; i += 1) {
      if (all[i].getAttribute('data-iframe')) {
        matching.push(all[i]);
      }
    }
  }

  // initialize IFrame object for each of them
  window.iframe = {};
  for (j = 0; j < matching.length; j += 1) {
    var name = matching[j].getAttribute('data-iframe');
    if (window.iframe[name] === undefined) {
      window.iframe[name] = new window.IFrame(matching[j]);
    } else {
      window.iframe[name].add(matching[j]);
    }
  }
  for (iframe in window.iframe) {
    if (window.iframe.hasOwnProperty(iframe)) {
      window.iframe[iframe].open();
    }
  }
};

if (window.iframe_initialized !== true) {
  window.iframe_initialized = true;
  window.iframe_initialize();
}

}(window, window.document));
