# Simple HTML/CSS slideshows

[Patternslib/slides](https://github.com/Patternslib/slides) is a minimal
slideshows library. It is minimal for several reasons:

* no dependencies on other javascript libraries
* no hardcoded styling: everything is handled through CSS

Even with its minimal design a number of interesting features are available:

* navigating between slides using swipe gestures
* multiple slideshows on a page
* separate window with timer and presenter notes for the current clise
* fullscreen mode

# Markup structure

A slideshow has a basic structure: a top level element which contains the
slideshow, which contains one or more slides. Each slide can optionally contain
presenter notes.

```html
<div class="slideshow">
  <div class="slide cover">
    <div class="slide-content">
      <section>
        <hgroup>
          <h1>Patternslib/slides</h1>
          <h2>Create slideshows in HTML 5</h2>
        </hgroup>
      </section>
    </div>
  </div>

  <div class="slide">
    <div class="slide-content">
      <section>
        <h1>Slide title>
        ...
      </section>
    </div>
  </div>
</div>
```

In presentation mode a number of class changes are made:

* The currently shown slide will get a ``active`` class.
* The slideshows container will get a ``mode-full`` class.
* The slideshow container will ``transform: scale(XX)`` style to make it fill the entire window

When not in presentation page the slideshow container will get a
``mode-list`` class.

# Controls

You can start a presentation by clicking on a slide. This will start the
presentation at the given slide. In presentation mode a number of keyboard
and swipe controls are available:

* `Esc` key: exit presentation
* `PageUp`, `Up`, and `Left` keys: go to previous slide
* `PageDown`, `Down`, `Right` and `Space` keys: go to next slide
* `Home` key: jump to the first slide
* `End` key: jump to the last slide
* `F` key: toggle fullscreen
* `N` key: toggle presenter notes window
* Swipe left: go to the previous slide
* Swipe right: go to the next slide
* Swipe down: exit presentation


# JavaScript events

Patternslib/slides sends [custom
events](http://dev.w3.org/2006/webapi/DOM-Level-3-Events/html/DOM3-Events.html#events-CustomEvent)
when something happens in the slideshow. These events have a `detail` property
with data specific for the event.

## SlideshowStart

The `SlideshowStart` event is fired when a slideshow is started.

This event is dispatched from the slideshow container. The `detail` property of
this event contains the following items:

| Property    | Description                                                    |
| ----------- | -------------------------------------------------------------- |
| `slideshow` | Instance of the slideshow object                               |

This event is dispatched from the slideshow container.

Immediately after this event is send a `SlideDisplay` event is send with
information on the first slide that will be shown.


## SlideshowStop

The `SlideshowStop` event is fired when the slideshow is stopped and the
the page has switched back to list mode.

This event is dispatched from the slideshow container. The `detail` property of
this event contains the following items:


| Property    | Description                                                    |
| ----------- | -------------------------------------------------------------- |
| `slideshow` | Instance of the slideshow object                               |

Before this event is dispatched a separate `SlideHide` event is fired for the
slide that was last displayed.


## SlideDisplay

The `SlideDisplay` event is fired when a new slide is displayed, or immediately
after `SlideshowStart` has been send for the initial slide shown when a
presentation starts.

This event is dispatched from the slide element. The `detail` property of this
event contains the following items:

| Property    | Description                                                    |
| ----------- | -------------------------------------------------------------- |
| `slideshow` | Instance of the slideshow object                               |
| `slide`     | Instance of the slide object for the slide that will be shown. |
| `number`    | The number for the slide that is now displayed.                |


## SlideHide

The `SlideHide` event is fired when a slide is replaced with another slide,
or when a presentation is stopped and before the `SlideshowStop` event is
dispatched.

This event is dispatched from the slide element. The `detail` property of this
event contains the following items:

| Property    | Description                                                    |
| ----------- | -------------------------------------------------------------- |
| `slideshow` | Instance of the slideshow object                               |
| `slide`     | Instance of the slide object for the slide that was shown last.|
| `number`    | The number for the slide that is was displayed.                |
