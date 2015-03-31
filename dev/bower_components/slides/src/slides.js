/** slides.js
 *
 * Copyright 2013 Simplon B.V. - Wichert Akkerman
 */

(function() {

var _whitespace = /[\t\r\n\f]/g;

function hasClass(el, name) {
        return (" " + el.className + " ").replace(this._whitespace, " ").indexOf(name)>=0;
}


function addClass(el, name) {
        if (hasClass(el, name))
                return;
        el.className+=" " + name;
}


function removeClass(el, name) {
        var classes = el.className.split(/\s+/);
        for (var i=0; i<classes.length; i++)
                if (classes[i]===name) {
                        classes.splice(i, 1);
                        el.className=classes.join(" ");
                        return;
                }
}


function extend(target, src) {
        for (var name in src)
                if  (src.hasOwnProperty(name))
                        target[name]=src[name];
}


//////////////////////////////////////////////////////////////////////
function EventTracker() {
        this.listeners=[];
}

EventTracker.prototype={
        add: function(el, type, handler, context) {
                var bound_handler = handler.bind(context);
                this.listeners.push({el: el,
                                     type: type,
                                     handler: handler,
                                     bound_handler: bound_handler});
                el.addEventListener(type, bound_handler);
        },

        remove: function(el, type, handler) {
                var listener;
                for (var i=0; i<this.listeners.length; i++) {
                        listener=this.listeners[i];
                        if (listener.el===el && listener.type===type && listener.handler===handler) {
                                listener.el.removeEventListener(listener.type, listener.bound_handler);
                                this.listeners.splice(i, 1);
                                break;
                        }
                }
        },

        removeAll: function() {
                var listener;
                for (var i=0; i<this.listeners.length; i++) {
                        listener=this.listeners[i];
                        listener.el.removeEventListener(listener.type, listener.bound_handler);
                }
                this.listeners=[];
        }
};


//////////////////////////////////////////////////////////////////////
function Slide(presentation, element, active, number) {
        this.presentation=presentation;
        this.element=element;
        this.id=element.id;
        this.active=!!active;
        this.number=number;
        element.addEventListener("click", this._onClick.bind(this));
}


Slide.prototype={
        title: function() {
                var el = this.element.querySelector(this.presentation.config.slide_title_selector);
                return el!==null ? el.textContent : null;
        },

        notes: function() {
                return this.element.querySelector(this.presentation.config.slide_notes_selector);
        },

        _onClick: function() {
                this.presentation._showSlide(this);
        },

        _markActive: function() {
                this.active=true;
                addClass(this.element, "active");
        },

        _markInactive: function() {
                this.active=false;
                removeClass(this.element, "active");
        }
};


//////////////////////////////////////////////////////////////////////
function Notes(presentation) {
        this.presentation=presentation;
        this.events=new EventTracker();
        this.time_start=new Date();
}


Notes.prototype={
        window: null,
        document: null,
        timer_inter: null,
        time_start: null,
        global_onunload: null,

        show: function(notes) {
                if (this.window===null || this.window.closed)
                        this.window=window.open("about:blank", "presenter-notes",
                                "menubar=no,personalbar=no,location=no,status=no");
                if (this.window===null)
                        return false;
                this.document=this.window.document;
                this.events.add(this.document, "keydown", this.presentation._onKey, this.presentation);
                this._addContent();
                this.update();
                this._startTimer();
                this.global_onunload=window.onunload;
                window.onunload=this._onUnload.bind(this);
                return true;
        },

        hide: function(notes) {
                this.events.removeAll();
                this._stopTimer();
                window.onunload=this.global_ununload;
                if (this.window!==null) {
                        if (!this.window.closed)
                                this.window.close();
                        this.window=null;
                        this.document=null;
                }
        },

        update: function() {
                if (!this.isOpen())
                        return;

                var number = this.presentation.current_slide_index+1,
                    span = this.document.querySelector("#slide .current");
                span.firstChild.textContent=number.toString();

                var slide = this.presentation.slides[this.presentation.current_slide_index],
                    notes = slide.notes(),
                    section = this.document.getElementById("notes");

                while (section.hasChildNodes())
                        section.removeChild(section.firstChild);

                if (notes && notes.childElementCount) {
                        var children = notes.children, dir, lang;
                        for (var i=0; i<children.length; i++)
                                section.appendChild(this.document.importNode(children[i], true));

                        for (var w=notes; w!==null && (!dir || !lang); w=w.parentElement) {
                                if (!dir && w.dir)
                                        dir=w.dir;
                                if (!lang && w.lang)
                                        lang=w.lang;
                        }
                        section.dir=dir || "";
                        section.lang=lang || "";
                }
        },

        isOpen: function() {
                return this.window && !this.window.closed;
        },

        _addContent: function() {
                var body = this.document.body,
                    header, container, span;

                body.id="presentor-notes";

                header=this.document.createElement("header");
                header.className="meta";

                // Create the slide index
                container=this.document.createElement("div");
                container.id="slide";
                span=this.document.createElement("span");
                span.className="current";
                span.appendChild(this.document.createTextNode(this.presentation.current_slide_index+1));
                container.appendChild(span);
                span.appendChild(this.document.createTextNode("/"));
                span=this.document.createElement("span");
                span.className="total";
                span.appendChild(this.document.createTextNode(this.presentation.slides.length));
                container.appendChild(span);
                header.appendChild(container);

                // Create the timer
                container=this.document.createElement("timer");
                container.id="timer";
                container.appendChild(this.document.createTextNode("00:00:00"));
                header.appendChild(container);

                body.appendChild(header);

                container=this.document.createElement("section");
                container.id="notes";
                body.appendChild(container);
        },

        _onUnload: function() {
                if (this.global_onunload!==null)
                        this.global_onunload();
                this.hide();
        },

        _startTimer: function() {
                this.timer_interval=setInterval(this._updateTimer.bind(this), 1000);
                this._updateTimer();
        },

        _stopTimer: function() {
                if (this.timer_interval!==null) {
                        clearInterval(this.timer_interval);
                        this.timer_interval=null;
                }
        },

        _twoDigitNumber: function(num) {
                var buf = num.toString();
                return buf.length>1 ? buf : "0"+buf;
        },

        _updateTimer: function() {
                if (this.window.closed) {
                        this.hide();
                        return;
                }

                var delta = new Date(new Date()-this.time_start),
                    digits = this._twoDigitNumber,
                    timer = this.document.getElementById("timer");
                timer.firstChild.textContent=delta.getUTCHours()+":"+digits(delta.getUTCMinutes())+":"+digits(delta.getUTCSeconds());
                timer.setAttribute("datetime",
                                delta.getUTCHours()+"h "+delta.getUTCMinutes()+"m "+delta.getUTCSeconds()+"s");
        }
};


//////////////////////////////////////////////////////////////////////

var default_config = {
        // Selector to find slides.
        slide_selector: ".slide",

        // Selector to find the title of a slide *from the slide*.
        slide_title_selector: "header",

        // Selector to find the presentation notes for a slide *from the slide*.
        slide_notes_selector: "footer"
};


function Presentation(container, options) {
        this.config={};
        extend(this.config, default_config);
        if (typeof options==="object")
                extend(this.config, options);
        this.container=container;
        removeClass(this.container, "mode-full");
        addClass(this.container, "mode-list");
        this.scan();
        this.events=new EventTracker();
        this.notes_window=new Notes(this);
}


Presentation.prototype={
        // Notes instance
        notes_window: null,

        // Flag if we are currently running in presentation mode.
        running: false,

        // The currently shown slide.
        current_slide_index: null,

        // Identifier of touch event being tracked
        touch_identifier: null,

        // Page position where a touch event started.
        touch_start_position: null,

        // Last seen page position during a touch.
        touch_last_position: null,

        start: function(slide) {
                if (this.running)
                        return;

                this.running=true;
                if (this.current_slide_index===null)
                        this.current_slide_index=0;
                addClass(document.body, "slideshow-running");
                addClass(this.container, "mode-full");
                removeClass(this.container, "mode-list");
                this._scaleDocument();
                this.events.add(window, "resize", this._scaleDocument, this);
                this.events.add(document, "keydown", this._onKey, this);
                this.events.add(document, "touchstart", this._onTouchStart, this);
                var event = document.createEvent("CustomEvent");
                event.initCustomEvent("SlideshowStart", true, true,
                                {slideshow: this.container});
                this.container.dispatchEvent(event);
                this._display(this.current_slide_index);
        },

        stop: function(slide) {
                if (!this.running)
                        return;
                this.running=false;

                if (this._isFullScreen())
                        this.exitFullscreen();
                this.events.removeAll();
                removeClass(this.container, "mode-full");
                addClass(this.container, "mode-list");
                removeClass(document.body, "slideshow-running");
                this._applyScale(1);
                this.notes_window.hide();

                var event;

                event=document.createEvent("CustomEvent");
                event.initCustomEvent("SlideHide", true, true,
                                {slideshow: this,
                                 slide: this.slides[this.current_slide_index],
                                 number: this.current_slide_index+1});
                this.slides[this.current_slide_index].element.dispatchEvent(event);

                event=document.createEvent("CustomEvent");
                event.initCustomEvent("SlideshowStop", true, true,
                                {slideshow: this.container});
                this.container.dispatchEvent(event);
        },

        toggleNotesWindow: function() {
                if (this.notes_window.isOpen())
                        this.notes_window.hide();
                else
                        this.notes_window.show();
        },

        enterFullscreen: function() {
                var names = ["requestFullScreen", "webkitRequestFullScreen",
                             "mozRequestFullScreen", "msCancelFullScreen",
                             "oRequestFullScreen"];
                for (var i=0; i<names.length; i++)
                        if (typeof this.container[names[i]]==="function") {
                                this.container[names[i]](this.container);
                                break;
                        }
        },

        exitFullscreen: function() {
                var names = ["cancelFullScreen", "webkitCancelFullScreen",
                             "mozCancelFullScreen", "msCancelFullScreen",
                             "oCancelFullScreen"];
                for (var i=0; i<names.length; i++)
                        if (typeof document[names[i]]==="function") {
                                document[names[i]]();
                                break;
                        }
        },

        _isFullScreen: function() {
                var names = ["fullScreen", "webkitIsFullScreen", "mozFullScreen",
                             "msFullScreen", "oFullScreen"],
                    fullScreen;

                for (var i=0; fullScreen===undefined && i<names.length; i++)
                        fullScreen=document[names[i]];
                return fullScreen;
        },

        toggleFullscreen: function() {
                switch (this._isFullScreen()) {
                        case undefined:
                                return;
                        case true:
                                this.exitFullscreen();
                                break;
                        case false:
                                this.enterFullscreen();
                                break;
                }
        },

        first: function() {
                if (!this.running)
                        return;
                this._display(0);
        },

        previous: function() {
                if (!this.running)
                        return;
                if (!this.current_slide_index)
                        return;
                this._display(this.current_slide_index-1);
        },

        next: function() {
                if (!this.running)
                        return;
                if (this.current_slide_index==(this.slides.length-1))
                        return;
                this._display(this.current_slide_index+1);
        },

        last: function() {
                if (!this.running)
                        return;
                this._display(this.slides.length-1);
        },

        _applyScale: function(ratio) {
                var style = (ratio!=1) ? ("scale("+ratio+")") : "";
                this.container.style.WebkitTransform=style;
                this.container.style.MozTransform=style;
                this.container.style.msTransform=style;
                this.container.style.OTransform=style;
                this.container.style.transform=style;
        },

        _scaleDocument: function() {
                var el = this.slides[0].element;
                var ratio = 1/Math.max(el.clientWidth/window.innerWidth,
                                       el.clientHeight/window.innerHeight);
                this._applyScale(ratio);
        },

        _showSlide: function(slide) {
                for (var i=0; i<this.slides.length; i++)
                        if (this.slides[i]===slide) {
                                this.current_slide_index=i;
                                break;
                        }
                if (this.running)
                        this._display(this.current_slide_index);
                else
                        this.start();
        },

        _display: function(index) {
                var event, slide;

                for (var i=0; i<this.slides.length; i++) {
                        slide=this.slides[i];
                        if (i===index)
                                slide._markActive();
                        else if (slide.active) {
                                slide._markInactive();
                                event=document.createEvent("CustomEvent");
                                event.initCustomEvent("SlideHide", true, true,
                                                {slideshow: this,
                                                 slide: slide,
                                                 number: i+1});
                                slide.element.dispatchEvent(event);
                        }
                }
                this.current_slide_index=index;
                this.notes_window.update();

                event=document.createEvent("CustomEvent");
                slide=this.slides[this.current_slide_index];
                event.initCustomEvent("SlideDisplay", true, true,
                                {slideshow: this,
                                 slide: slide,
                                 number: this.current_slide_index+1});
                slide.element.dispatchEvent(event);
        },

        _onKey: function(event) {
                switch (event.which) {
                        case 27: // Escape
                                event.preventDefault();
                                this.stop();
                                break;

                        case 33: // PageUp
                        case 38: // Up
                        case 37: // Left
                                event.preventDefault();
                                this.previous();
                                break;

                        case 32: // Space
                        case 34: // PageDown
                        case 39: // Right
                        case 40: // Down
                                event.preventDefault();
                                this.next();
                                break;

                        case 36: // Home
                                event.preventDefault();
                                this.first();
                                break;

                        case 35: // End
                                event.preventDefault();
                                this.last();
                                break;

                        case 70: // F
                                event.preventDefault();
                                this.toggleFullscreen();
                                break;

                        case 78: // N
                                event.preventDefault();
                                this.toggleNotesWindow();
                                break;
                }
        },

        _onTouchStart: function(event) {
                if (event.touches.length!==1)
                        return;
                this.touch_identifier=event.touches[0].identifier;
                this.touch_start_position=[event.touches[0].pageX, event.touches[0].pageY];
                this.touch_last_position=[event.touches[0].pageX, event.touches[0].pageY];
                this.events.add(document, "touchmove", this._onTouchMove, this);
                this.events.add(document, "touchend", this._onTouchEnd, this);
                this.events.add(document, "touchcancel", this._onTouchCancel, this);
        },

        _onTouchMove: function(event) {
                for (var i=0; i<event.touches.length; i++)
                        if (event.touches[i].identifier===this.touch_identifier) {
                                this.touch_last_position[0]=event.touches[i].pageX;
                                this.touch_last_position[1]=event.touches[i].pageY;
                                event.preventDefault();
                                break;
                        }
        },

        _onTouchEnd: function(event) {
                for (var i=0; i<event.changedTouches.length && this.touch_identifier!==null; i++)
                        if (event.changedTouches[i].identifier===this.touch_identifier) {
                                this.touch_identifier=null;
                                var delta_x = this.touch_start_position[0]-this.touch_last_position[0],
                                    delta_y = this.touch_start_position[1]-this.touch_last_position[1],
                                    offset_x = Math.abs(delta_x),
                                    offset_y = Math.abs(delta_y);

                                if (Math.max(offset_x, offset_y)<50)
                                        continue;

                                if (offset_x>offset_y) {
                                        if (delta_x<0)
                                                this.previous();
                                        else
                                                this.next();
                                } else if (delta_y<0)
                                        this.stop();
                        }
        },

        _onTouchCancel: function() {
                this.touch_identifier=null;
                this.touch_start_position=null;
                this.touch_last_position=null;
                this.events.remove(document, "touchmove", this._onTouchMove);
                this.events.remove(document, "touchend", this._onTouchEnd);
                this.events.remove(document, "touchcancel", this._onTouchCancel);
        },

        scan: function() {
                var elements = this.container.querySelectorAll(this.config.slide_selector);
                this.slides=[];
                this.current_slide_index=0;
                for (var i=0; i<elements.length; i++) {
                        var element = elements[i],
                            active = hasClass(element, "active");
                        this.slides.push(new Slide(this, element, active, i+1));
                        if (active)
                                this.current_slide_index=i;
                }
        }
};

window.Presentation=Presentation;
})();
