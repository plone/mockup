---
permalink: "pat/modal/"
title: Modal
---

# Modal

This is the modal pattern.

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

<a href="#modal2" class="plone-btn plone-btn-lg plone-btn-primary pat-plone-modal"
                data-pat-plone-modal="width: 500">Modal long scrolling</a>

<div id="modal2" style="display: none">
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
    href="#modal2"
    class="plone-btn plone-btn-lg plone-btn-primary pat-plone-modal"
    data-pat-plone-modal="width: 500"
    >Modal long scrolling</a
>
<div id="modal2" style="display: none">
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

## Configuration

|            Option             |        Type         |                                                               Default                                                               |                                                                                                                                                                                Description                                                                                                                                                                                |
| :---------------------------: | :-----------------: | :---------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|            height             |       string        |                                                                 ''                                                                  |                                                                                                                                                              Set the height of the modal, for example: 250px                                                                                                                                                              |
|             width             |       string        |                                                                 ''                                                                  |                                                                                                                                                          Set the width of the modal, for example: 80% or 500px.                                                                                                                                                           |
|            margin             | function or integer |                                                                 20                                                                  |                                                                                                               A function, Integer or String which will be used to set the margin of the modal in pixels. If a function is passed it must return an Integer.                                                                                                               |
|           position            |       string        |                                                           'center middle'                                                           |                                                                                                             Position the modal relative to the window with the format: "<horizontal> <vertical>" -- allowed values: top, bottom, left, right, center, middle.                                                                                                             |
|           triggers            |        array        |                                                                 []                                                                  | Add event listeners to elements on the page which will open the modal when triggered. Pass an Array of strings with the format `["EVENT SELECTOR"]` or `["EVENT"]`. For example, `["click .someButton"]`. If you pass in only an event such as, `["change"]`, the event listener will be added to the element on which the modal was initiated, usually a link or button. |
|             title             |       string        |                                                                null                                                                 |                                                                                                                                          A string to place in the modal header. If title is provided, titleSelector is not used.                                                                                                                                          |
|         titleSelector         |       string        |                                                             'h1:first'                                                              |                                                                                                                                 Selector for an element to extract from the content provided to the modal and place in the modal header.                                                                                                                                  |
|            content            |       string        |                                                             '#content'                                                              |                                                                                                                                        Selector for an element within the content provided to the modal to use as the modal body.                                                                                                                                         |
|        prependContent         |       string        |                                                          '.portalMessage'                                                           |                                              Selector for elements within the content provided to the modal which will be collected and inserted, by default above, the modal content. This is useful for extracting things like alerts or status messages on forms and displaying them to the user after an AJAX response.                                               |
|           backdrop            |       string        |                                                               'body'                                                                |                                                                   Selector for the element upon which the Backdrop pattern should be initiated. The Backdrop is a full width mask that will be apply above the content behind the modal which is useful for highlighting the modal dialog to the user.                                                                    |
|        backdropOptions        |       object        | { zIndex: "1040", opacity: "0.8", className: "backdrop", classActiveName: "backdrop-active", closeOnEsc: true, closeOnClick: true } |                                                                                                                                                                   Look at options at backdrop pattern.                                                                                                                                                                    |
|            buttons            |       string        |                                               '.formControls > input[type="submit"]'                                                |                                                                                                Selector for matching elements, usually buttons, inputs or links, from the modal content to place in the modal footer. The original elements in the content will be hidden.                                                                                                |
| automaticallyAddButtonActions |       boolean       |                                                                true                                                                 |                                                                                                                     Automatically create actions for elements matched with the buttons selector. They will use the options provided in actionOptions.                                                                                                                     |
|     loadLinksWithinModal      |       boolean       |                                                                true                                                                 |                                                                                                                                                         Automatically load links inside of the modal using AJAX.                                                                                                                                                          |
|         actionOptions         |       object        |                                                                 {}                                                                  |                                                              A hash of selector to options. Where options can include any of the defaults from actionOptions. Allows for the binding of events to elements in the content and provides options for handling ajax requests and displaying them in the modal.                                                               |
|           onSuccess           |      Function       |                                                               string                                                                |                                                                                                                                                                                                                                                                                                                                                                           | function which is called with parameters (modal, response, state, xhr, form) when form has been successfully submitted. if value is a string, this is the name of a function at window level            |
|          onFormError          |      Function       |                                                               string                                                                |                                                                                                                                                                                                                                                                                                                                                                           | function which is called with parameters (modal, response, state, xhr, form) when backend has sent an error after form submission. if value is a string, this is the name of a function at window level |
|            onError            |      Function       |                                                               string                                                                |                                                                                                                                                                                                                                                                                                                                                                           | function which is called with parameters (xhr, textStatus, errorStatus) when form submission has failed. if value is a string, this is the name of a function at window level                           |
