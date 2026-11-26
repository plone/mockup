# 0007 pat-plone-modal: A cancelable event before the modal hides

Status: Accepted (2026-11-26)

## Context

pat-formunloadalert should ask before a form with unsaved changes is closed.
Inside a pat-plone-modal it looked for a parent `.plone-modal`, read the modal
instance from it and set `_suppressHide`, a message the modal asks the user to
confirm before hiding. The modal template does not render `.plone-modal`
anymore, and the modal instance is stored on the trigger element, which is
outside of the modal. So the lookup never matched.

The form then registered its `beforeunload` handler on `window` as for a form
on the page. It never asked when the modal was closed, and after the modal was
closed it still asked when the user left the page.

## Decision

- `hide()` of pat-plone-modal first dispatches a native event
  `plone-modal-before-hide` on the modal element (`.modal`). It bubbles and is
  cancelable. If a listener calls `preventDefault()`, `hide()` returns without
  any change. This happens before the running request is aborted and before
  the `hide` event is emitted.
- Content of the modal finds the modal element with `closest(".modal")` and
  listens to that event. It does not need the modal instance.
- pat-formunloadalert does that: for a changed form it asks with
  `window.confirm()` and cancels the event if the user does not confirm.
- pat-formunloadalert always registers its `beforeunload` handler. The handler
  removes itself and does not ask when the form is not in the document
  anymore.
- The event name has no dots, so that jQuery `.on()` does not read parts of
  it as namespaces.
- `_suppressHide` stays supported for existing code.
- The `beforeunload` listener on `window` is registered with Patternslib's
  `events.add_event_listener` instead of jQuery. As a native listener it calls
  `preventDefault()` to make the browser ask; `returnValue` is still set for
  older browsers. The listeners on the modal element and on the form are
  plain `addEventListener` calls, so they are freed with these elements.

## Consequences

- Closing a modal with unsaved changes in a pat-formunloadalert form asks the
  user, whether it is closed by ESC, a backdrop click, a close button or
  `hide()`.
- Once the modal is closed, the form no longer asks when the user leaves the
  page.
- Other patterns can guard a modal the same way, without access to the modal
  instance.
- The dead `.plone-modal` lookup in pat-manageportlets is not changed here.
