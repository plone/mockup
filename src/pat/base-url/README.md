# pat-base-url

Update `body[data-base-url]` and `body[data-view-url]` on navigation changes.

## Description

Plone maintains the `data-base-url` and `data-view-url` data attributes on the
body tag. The base-url is the URL of the current context, the view-url is the
full URL including the view name and both can be used in JavaScript.

This needs to be updated, when navigating through the site with AJAX, for
example using Patternslib `pat-inject` with the `history:record` setting, which
updates the URL bar after a ajax call:

```html
<a
    class="pat-inject"
    href="news"
    data-pat-inject="
      source: body;
      target: body;
      history: record;
  "
>
    Click here.
</a>
```

The logic is as follows:

- Get active on a `pat-inject-before-history-update` event from pat-inject in
  Patternslib ([See this PR](https://github.com/Patternslib/Patterns/pull/1280)).
  The AJAX response data is stored on the event.
  Note:‌ This pattern can listen to other events, having different event payload
  data structures as well as other areas throwing this event.

- Add or update either or both `data-base-url` and `data-view-url` if it exists
  in the ajax response from pat-inject.

- Remove it from the body tag otherwise, so that we don't provide wrong URLs
  when the URL bar changes. A fallback should be provided, see below.

## Considerations

- When `data-base-url` and `data-view-url` are not available, a fallback should
  be used.

- The fallback can be `<link rel="canonical" href="">` or `window.location`.

- A utility method to get the `base-url` and `view-url` would be good, which
  uses a fallback, if they are not provided on the body as data attributes.

- This pattern is sorted early and executes even before any other pattern, when
  running sequentially. But this order doesn't matter, since this Pattern is only
  getting active on an event and the execution order is not defined for events
  (whatever comes first executes first) and actually shouldn't matter anyway.
