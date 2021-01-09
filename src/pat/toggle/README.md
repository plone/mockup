---
permalink: "pat/toggle/"
title: Toggle
---

# Toggle pattern

Toggles things.

## Migration note (Plone 6)

This mockup pattern will probably replaced by patternslib/toggle. Some features are
already broken like "Toggle an element by hover event".
We decided to not migrate all examples and no tests.

## Configuration

| Option | Type | Default | Description |
|:-:|:-:|:-:|:-:|
| target | string | null | selector of the target elements to toggle ('undefied')
| targetScope | null | selector of a target scope element in anchestors ('global')
| attribute | string | null | element attribute which will be toggeled ('class')
| event | string | null |  event which will trigger toggling ('click')

## Examples

## Toggle itself

<button type="button"
        class="btn btn-primary pat-toggle mb-2"
        data-pat-toggle="value:btn-lg;">
            This button goes bigger/smaller!
</button>

```html
<button type="button"
        class="btn btn-primary pat-toggle"
        data-pat-toggle="value:btn-lg;">
            This button goes bigger/smaller!
</button>
```

## Toggle all targets (global scope)

<div class="wrapper">
    <button type="button"
            class="btn btn-primary pat-toggle mb-2"
            data-pat-toggle="value:bg-success;target:.targetElement">
                This button is toggling the background of a element.</button><br />
    <span class="targetElement badge bg-secondary">Hello World</span>
</div>

```html
<div class="wrapper">
    <button type="button"
            class="btn btn-primary pat-toggle mb-2"
            data-pat-toggle="value:badge-success;target:.targetElement">
                This button is toggling the background of a element.</button><br />
    <span class="targetElement badge bg-secondary">Hello World</span>
</div>
```

# Toggle specific target inside a target scope

<div class="wrapper">
    <div class="myScope">
        <button type="button"
                class="btn btn-primary pat-toggle mb-2"
                data-pat-toggle="value:bg-success;target:.targetElement;targetScope:.myScope;">toggle</button><br />
        <span class="targetElement badge bg-secondary mb-4">Hello World</span>
    </div>
    <div class="myScope">
        <button type="button"
                class="btn btn-primary pat-toggle mb-2"
                data-pat-toggle="value:bg-success;target:.targetElement;targetScope:.myScope;">toggle</button><br />
        <span class="targetElement badge bg-secondary">Hello World</span>
    </div>
</div>

```html
<div class="wrapper">
    <div class="myScope">
        <button type="button"
                class="btn btn-primary pat-toggle mb-2"
                data-pat-toggle="value:bg-success;target:.targetElement;targetScope:.myScope;">toggle</button><br />
        <span class="targetElement badge bg-secondary mb-4">Hello World</span>
    </div>
    <div class="myScope">
        <button type="button"
                class="btn btn-primary pat-toggle mb-2"
                data-pat-toggle="value:bg-success;target:.targetElement;targetScope:.myScope;">toggle</button><br />
        <span class="targetElement badge bg-secondary">Hello World</span>
    </div>
</div>
```

# Toggle more than one target inside a specific target scope

<div class="wrapper">
   <div class="myScope">
     <button type="button"
             class="btn btn-primary pat-toggle mb-2"
             data-pat-toggle="value:bg-success;target:.targetElement;targetScope:.myScope;">toggle</button><br />
     <span class="targetElement badge bg-secondary">Hello World</span>
     <span class="targetElement badge bg-secondary mb-4">Hello again</span>
   </div>
   <div class="myScope">
     <button type="button"
             class="btn btn-primary pat-toggle mb-2"
             data-pat-toggle="value:bg-success;target:.targetElement;targetScope:.myScope;">toggle</button><br />
     <span class="targetElement badge bg-secondary">Hello World</span>
   </div>
</div>

```html
<div class="wrapper">
   <div class="myScope">
     <button type="button"
             class="btn btn-primary pat-toggle mb-2"
             data-pat-toggle="value:bg-success;target:.targetElement;targetScope:.myScope;">toggle</button><br />
     <span class="targetElement badge bg-secondary">Hello World</span>
     <span class="targetElement badge bg-secondary mb-4">Hello again</span>
   </div>
   <div class="myScope">
     <button type="button"
             class="btn btn-primary pat-toggle mb-2"
             data-pat-toggle="value:bg-success;target:.targetElement;targetScope:.myScope;">toggle</button><br />
     <span class="targetElement badge bg-secondary">Hello World</span>
   </div>
</div>
```

