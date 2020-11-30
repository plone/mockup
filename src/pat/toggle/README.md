---
permalink: "pat/toggle/"
title: Toggle
---

# Toggle pattern

Toggles things

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
        class="btn btn-default pat-toggle"
             data-pat-toggle="value:btn-lg;">This button goes bigger/smaller!</button>

