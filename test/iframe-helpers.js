// Helper functions for use in tests.
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


function createElement(name, resources, content, extra) {
  "use strict";

  var el = document.createElement("div");
  el.setAttribute('data-iframe', name);
  el.setAttribute('data-iframe-resources', resources);

  extra = extra || {};
  for (var key in extra) {
    if (extra.hasOwnProperty(key)) {
      el.setAttribute(key, extra[key]);
    }
  }

  el.innerHTML = content;
  document.body.insertBefore(el, document.body.firstChild);

  return el;
}


function removeElements(el) {
  "use strict";

  if (el.parentNode === undefined) {
    if (el.length !== 0) {
      for (var i = 0; i <= el.length; i += 1) {
        el[0].parentNode.removeChild(el[0]);
      }
    }
  } else {
    el.parentNode.removeChild(el);
  }
}


function getElementStyle(el, property) {
  "use strict";

  if (typeof el.currentStyle !== 'undefined') {
    if (typeof el.currentStyle.getPropertyValue === 'function') {
      return el.currentStyle.getPropertyValue(property);
    }
    return el.currentStyle[property];
  }

  if (typeof el.ownerDocument.defaultView.getComputedStyle === 'function') {
    return el.ownerDocument.defaultView.getComputedStyle(el,null).
                getPropertyValue(property);
  }

  return "";
}


function onLoad(done, iframes, callable) {
  "use strict";

  var iframes_loaded;

  function onLoadInner() {

    if (iframes.loaded !== undefined) {
      iframes_loaded = iframes.loaded;
    } else {
      iframes_loaded = true;
      for (var i = 0; i < iframes.length; i += 1) {
        if (iframes_loaded === false || iframes[i].loaded === false) {
          iframes_loaded = false;
        }
      }
    }

    if (iframes_loaded === true) {
      callable();
      done();
      return;
    }

    window.setTimeout(onLoadInner, 23);
    return;
  }

  onLoadInner();
}
