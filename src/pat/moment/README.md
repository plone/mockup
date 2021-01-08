---
permalink: "pat/moment/"
title: Moment
---

# Moment pattern.

## Configuration

| Option | Type | Default | Description |
|:-:|:-:|:-:|:-:|
| selector | string | null | selector to use to look for dates to format |
| format | string | "MMMM Do YYYY, h:mm:ss a" | Format to use to render date. Also available is "relative" and "calendar" formats. |
| setTitle | boolean | false | set the title attribute to display the full date and time on hover |


## Examples

### Simple

<span class="pat-moment">2014-10-30T15:10:00</span>

```html
<span class="pat-moment">2014-10-30T15:10:00</span>
```


### Defaults

<ul class="pat-moment" data-pat-moment="selector:li">
  <li>2013-10-01T10:00:00-05:00</li>
  <li>2013-01-01T22:10:00-05:00</li>
  <li>2013-01-05T04:34:00-05:00</li>
  <li>2013-02-14T16:55:00-05:00</li>
</ul>

```html
<ul class="pat-moment" data-pat-moment="selector:li">
  <li>2013-10-01T10:00:00-05:00</li>
  <li>2013-01-01T22:10:00-05:00</li>
  <li>2013-01-05T04:34:00-05:00</li>
  <li>2013-02-14T16:55:00-05:00</li>
</ul>
```


### Relative format

<ul class="pat-moment"
    data-pat-moment="selector:li;format:relative;">
  <li>2013-10-01T10:00:00-05:00</li>
  <li>2013-01-01T22:10:00-05:00</li>
  <li>2013-01-05T04:34:00-05:00</li>
  <li>2013-02-14T16:55:00-05:00</li>
</ul>

```html
<ul class="pat-moment"
    data-pat-moment="selector:li;format:relative;">
  <li>2013-10-01T10:00:00-05:00</li>
  <li>2013-01-01T22:10:00-05:00</li>
  <li>2013-01-05T04:34:00-05:00</li>
  <li>2013-02-14T16:55:00-05:00</li>
</ul>
```


### Calendar format

<ul class="pat-moment"
    data-pat-moment="selector:li;format:calendar;">
  <li>2013-10-01T10:00:00-05:00</li>
  <li>2013-10-02T22:10:00-05:00</li>
  <li>2013-10-05T04:34:00-05:00</li>
  <li>2013-10-03T16:55:00-05:00</li>
</ul>

```html
<ul class="pat-moment"
    data-pat-moment="selector:li;format:calendar;">
  <li>2013-10-01T10:00:00-05:00</li>
  <li>2013-10-02T22:10:00-05:00</li>
  <li>2013-10-05T04:34:00-05:00</li>
  <li>2013-10-03T16:55:00-05:00</li>
</ul>
```


### Custom format

<ul class="pat-moment"
    data-pat-moment="selector:li;format:MMM Do, YYYY h:m a;">
  <li>2013-10-01T10:00:00-05:00</li>
  <li>2013-01-01T22:10:00-05:00</li>
  <li>2013-01-05T04:34:00-05:00</li>
  <li>2013-02-14T16:55:00-05:00</li>
</ul>

```html
<ul class="pat-moment"
    data-pat-moment="selector:li;format:MMM Do, YYYY h:m a;">
  <li>2013-10-01T10:00:00-05:00</li>
  <li>2013-01-01T22:10:00-05:00</li>
  <li>2013-01-05T04:34:00-05:00</li>
  <li>2013-02-14T16:55:00-05:00</li>
</ul>
```


### Setting date by attribute

<ul class="pat-moment"
    data-pat-moment="selector:li;format:MMM Do, YYYY h:m a;">
  <li data-date="2013-10-01T10:00:00-05:00"></li>
  <li data-date="2013-01-01T22:10:00-05:00"></li>
  <li data-date="2013-01-05T04:34:00-05:00"></li>
  <li data-date="2013-02-14T16:55:00-05:00"></li>
</ul>

```html
<ul class="pat-moment"
    data-pat-moment="selector:li;format:MMM Do, YYYY h:m a;">
  <li data-date="2013-10-01T10:00:00-05:00"></li>
  <li data-date="2013-01-01T22:10:00-05:00"></li>
  <li data-date="2013-01-05T04:34:00-05:00"></li>
  <li data-date="2013-02-14T16:55:00-05:00"></li>
</ul>
```
