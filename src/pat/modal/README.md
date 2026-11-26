---
permalink: "pat/modal/"
title: Modal
---

# Modal

Show content in a modal.


## Basic Modal

<a href="#modal1" class="plone-btn plone-btn-large plone-btn-primary pat-plone-modal"
                    data-pat-plone-modal="width: 400">Modal basic</a>

<div id="modal1" style="display: none">
    <h1>Basic modal!</h1>
    <p>Indeed. Whoa whoa whoa whoa. Wait.</p>
</div>

```html
<a
    href="#modal1"
    class="plone-btn plone-btn-large plone-btn-primary pat-plone-modal"
    data-pat-plone-modal="width: 400"
    >Modal basic</a
>
<div id="modal1" style="display: none">
    <h1>Basic modal!</h1>
    <p>Indeed. Whoa whoa whoa whoa. Wait.</p>
</div>
```

## Modal with Buttons

<a href="#modal2" class="plone-btn plone-btn-large plone-btn-primary pat-plone-modal"
                    data-pat-plone-modal="{'width': '400', 'buttons': ['.plone-btn']}">Modal with buttons</a>

<div id="modal2" style="display: none">
    <h1>Modal with buttons!</h1>
    <p>Indeed. Whoa whoa whoa whoa. Wait.</p>
    <input type="submit" class="btn btn-secondary plone-btn me-1" name="cancel" value="Cancel" />
    <input type="submit" class="btn btn-primary plone-btn" name="insert" value="Submit" />
</div>

```html
<a
    href="#modal2"
    class="plone-btn plone-btn-large plone-btn-primary pat-plone-modal"
    data-pat-plone-modal="{'width': '400', 'buttons': ['.plone-btn']}"
    >Modal with buttons</a
>
<div id="modal2" style="display: none">
    <h1>Modal with buttons!</h1>
    <p>Indeed. Whoa whoa whoa whoa. Wait.</p>
    <input type="submit" class="btn btn-secondary plone-btn me-1" name="cancel" value="Cancel" />
    <input type="submit" class="btn btn-primary plone-btn" name="insert" value="Submit" />
</div>
```

## Modal scrolling

<a href="#modal3" class="plone-btn plone-btn-lg plone-btn-primary pat-plone-modal"
                data-pat-plone-modal="width: 500">Modal long scrolling</a>

<div id="modal3" style="display: none">
<h1>Basic with scrolling</h1>
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
</div>

```html
<a
    href="#modal3"
    class="plone-btn plone-btn-lg plone-btn-primary pat-plone-modal"
    data-pat-plone-modal="width: 500"
    >Modal long scrolling</a
>
<div id="modal3" style="display: none">
    <h1>Basic with scrolling</h1>
    <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua
    </p>
    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua
    </p>
    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua
    </p>
    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua
    </p>
    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua
    </p>
    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua
    </p>
</div>
```

## Modal with TinyMCE

<a href="#modaltinymce" class="btn btn-lg btn-primary pat-plone-modal"
data-pat-plone-modal="height: 600px;
                width: 80%">
Modal with TinyMCE</a>

<div id="modaltinymce" style="display:none">
<textarea class="pat-tinymce"></textarea>
</div>

```html
<a
    href="#modaltinymce"
    class="btn btn-lg btn-primary pat-plone-modal"
    data-pat-plone-modal="height: 600px;
                width: 80%"
>
    Modal with TinyMCE</a
>
<div id="modaltinymce" style="display:none">
    <textarea class="pat-tinymce"></textarea>
</div>
```

## Modal modalSize modal-fullscreen

<a href="#modal4"
   class="plone-btn plone-btn-large plone-btn-primary pat-plone-modal"
   data-pat-plone-modal="modalSizeClass: modal-fullscreen ; margin: 0;">Modal fullscreen!</a>

<div id="modal4" style="display: none">
    <h1>Full screen modal!</h1>
    <p>Indeed. Whoa whoa whoa whoa. Wait.</p>
</div>

```html
<a
    href="#modal4"
    class="plone-btn plone-btn-large plone-btn-primary pat-plone-modal"
    data-pat-plone-modal="modalSizeClass: modal-fullscreen; margin: 0;"
    >Modal fullscreen!</a
>
<div id="modal4" style="display: none">
    <h1>Basic screen modal!</h1>
    <p>Indeed. Whoa whoa whoa whoa. Wait.</p>
</div>
```

## Modal modalSize modal-lg

<a href="#modal5"
   class="plone-btn plone-btn-large plone-btn-primary pat-plone-modal"
   data-pat-plone-modal="modalSizeClass: modal-lg;">Modal large!</a>

<div id="modal5" style="display: none">
    <h1>Full screen modal!</h1>
    <p>Indeed. Whoa whoa whoa whoa. Wait.</p>
</div>

```html
<a
    href="#modal5"
    class="plone-btn plone-btn-large plone-btn-primary pat-plone-modal"
    data-pat-plone-modal="modalSizeClass: modal-lg;"
    >Modal large!</a
>
<div id="modal5" style="display: none">
    <h1>Basic screen modal!</h1>
    <p>Indeed. Whoa whoa whoa whoa. Wait.</p>
</div>
```

## Modal with a form submit that fails

When the server returns an error, the modal shows an error above the form,
with the HTTP status of the response. When the server does not respond within
`timeout`, the modal shows a warning instead, as the request may still have
been processed.

<a href="#modal6"
   class="plone-btn plone-btn-large plone-btn-primary pat-plone-modal">Error response</a>
<a href="#modal6"
   class="plone-btn plone-btn-large plone-btn-primary pat-plone-modal"
   data-pat-plone-modal='{"actionOptions": {"timeout": 1}}'>No response in time</a>

<div id="modal6" style="display: none">
    <h1>Log in</h1>
    <form method="post" action="does-not-exist">
        <label for="modal6-login">Login name</label>
        <input id="modal6-login" type="text" name="login" />
        <div class="formControls">
            <button type="submit" class="btn btn-primary" name="submit">Log in</button>
        </div>
    </form>
</div>

```html
<a href="#modal6" class="plone-btn plone-btn-large plone-btn-primary pat-plone-modal"
    >Error response</a
>
<a
    href="#modal6"
    class="plone-btn plone-btn-large plone-btn-primary pat-plone-modal"
    data-pat-plone-modal='{"actionOptions": {"timeout": 1}}'
    >No response in time</a
>
<div id="modal6" style="display: none">
    <h1>Log in</h1>
    <form method="post" action="does-not-exist">
        <label for="modal6-login">Login name</label>
        <input id="modal6-login" type="text" name="login" />
        <div class="formControls">
            <button type="submit" class="btn btn-primary" name="submit">Log in</button>
        </div>
    </form>
</div>
```

## Configuration

| Option | Type | Default | Description |
| :---: | :---: | :---: | :---: |
| height | string | '' | Set the height of the modal, for example: 250px |
| width | string | '' | Set the width of the modal, for example: 80% or 500px. |
| modalSizeClass | string | '' | Set the modal size class, for example: modal-sm, modal-lg, modal-xl or modal-fullscreen. |
| margin | function or integer | 20 | A function, Integer or String which will be used to set the margin of the modal in pixels. If a function is passed it must return an Integer. |
| position | string | 'center middle' | Position the modal relative to the window with the format: "<horizontal> <vertical>" -- allowed values: top, bottom, left, right, center, middle. |
| triggers | array | [] | Add event listeners to elements on the page which will open the modal when triggered. Pass an Array of strings with the format `["EVENT SELECTOR"]` or `["EVENT"]`. For example, `["click .someButton"]`. If you pass in only an event such as, `["change"]`, the event listener will be added to the element on which the modal was initiated, usually a link or button. |
| title | string | null | A string to place in the modal header. If title is provided, titleSelector is not used. |
| titleSelector | string | 'h1:first' | Selector for an element to extract from the content provided to the modal and place in the modal header. |
| content | string | '#content' | Selector for an element within the content provided to the modal to use as the modal body. |
| prependContent | string | '.portalMessage' | Selector for elements within the content provided to the modal which will be collected and inserted, by default above, the modal content. This is useful for extracting things like alerts or status messages on forms and displaying them to the user after an AJAX response. |
| backdrop | string | 'body' | Selector for the element upon which the Backdrop pattern should be initiated. The Backdrop is a full width mask that will be apply above the content behind the modal which is useful for highlighting the modal dialog to the user. |
| backdropOptions | object | { zIndex: "1040", opacity: "0.8", className: "backdrop", classActiveName: "backdrop-active", closeOnEsc: true, closeOnClick: true } | Look at options at backdrop pattern. |
| buttons | string | '.formControls > input[type="submit"], .formControls > button:not([type="button"], [type="reset"])' | Selector for matching elements, usually buttons, inputs or links, from the modal content to place in the modal footer. The original elements in the content will be hidden. By default, these are the submit buttons of `.formControls`. |
| automaticallyAddButtonActions | boolean | true | Automatically create actions for elements matched with the buttons selector. They will use the options provided in actionOptions. |
| loadLinksWithinModal | boolean | true | Automatically load links inside of the modal using AJAX. |
| actionOptions | object | {} | A hash of selector to options. Where options can include any of the defaults from actionOptions. Allows for the binding of events to elements in the content and provides options for handling ajax requests and displaying them in the modal. |
| onSuccess | Function | string | | function which is called with parameters (modal, response, state, xhr, form) when form has been successfully submitted. if value is a string, this is the name of a function at window level |
| onFormError | Function | string | | function which is called with parameters (modal, response, state, xhr, form) when backend has sent an error after form submission. if value is a string, this is the name of a function at window level |
| onError | Function | string | | function which is called with parameters (xhr, textStatus, errorStatus) when form submission has failed. if value is a string, this is the name of a function at window level. Without onError, the modal shows an error above the form. |
| onTimeout | Function | string | | function which is called with parameters ($modal, xhr, errorStatus) when the server did not respond within `timeout`, to a form submission or to loading a link into the modal. if value is a string, this is the name of a function at window level. Without onTimeout and onError, a timed-out form submission shows a warning above the form. |
| timeout | integer | 5000 | Milliseconds to wait for the server to respond to a form submission. Set it in actionOptions. |

## Closing

ESC and a click on the backdrop close the topmost open modal only, if
`closeOnEsc` and `closeOnClick` in `backdropOptions` are enabled.

Before the modal is hidden, a native `plone-modal-before-hide` event is
dispatched on the modal element (`.modal`). It bubbles and is cancelable.
Content of the modal can keep the modal open by calling `preventDefault()`:

```javascript
const modal_el = form.closest(".modal");
modal_el.addEventListener("plone-modal-before-hide", (e) => {
    if (has_unsaved_changes && !window.confirm("Discard changes?")) {
        e.preventDefault();
    }
});
```

When a form submit in the modal fails, a native `plone-modal-submit-failed`
event is dispatched on the form. It bubbles.

pat-formunloadalert uses these events to ask before a modal with unsaved
changes is closed, also after a failed submit.
