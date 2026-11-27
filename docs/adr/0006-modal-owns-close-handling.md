# 0006 pat-plone-modal: The modal handles ESC and backdrop clicks itself

Status: Accepted (2026-11-26)

## Context

pat-plone-modal draws its backdrop with pat-backdrop. Closing worked through
the backdrop: the Backdrop closed itself on ESC, the modal wrapper's click
handler hid the backdrop, and the modal listened to the backdrop's `hidden`
event to hide itself.

This broke with stacked modals. The modal creates a new Backdrop on every
show, but all modals on the same backdrop element share that element, and
pat-backdrop triggers `hidden` on it. Every modal on that element listened to
it, so one ESC or one backdrop click closed all stacked modals.

Each show also added a document `keydown` handler, a `resize` handler and a
`hidden` handler which were never removed. And the modal's own ESC handler
compared `e.key` with `"Esc"`, an old Internet Explorer name, so it never
fired.

## Decision

- The modal creates its Backdrop with `closeOnEsc: false` and
  `closeOnClick: false`. The Backdrop only draws. The modal reads its own
  `backdropOptions.closeOnEsc` and `backdropOptions.closeOnClick`, which keep
  their meaning.
- A module-level list keeps the open modals in the order they were shown.
  A modal is added when `show()` starts, so a modal which is still loading
  counts as open. Only the last one, the topmost, reacts to ESC
  (`e.key === "Escape"`).
  A backdrop click hits the topmost modal's wrapper, which covers the ones
  below, and calls `hide()` of that modal.
- The modal no longer listens to the backdrop's `hidden` event.
- The ESC and resize handlers on `document` and `window.parent` are
  registered with Patternslib's `events.add_event_listener` when the modal is
  shown, under per-instance ids like `plone-modal-3--keydown`. Registering
  the same id again replaces the old listener. `hide()` removes them with
  `events.remove_event_listener(el, "plone-modal-3--*")` and also calls the
  new `Backdrop.destroy()`.
- `add_event_listener` keeps the element alive until the listener is
  removed. It is only used for `document` and `window`, which outlive the
  modal anyway. Listeners on elements which are removed with the modal, like
  the modal element or its forms, are plain `addEventListener` calls, so they
  are freed with the element. No new code uses jQuery for events.

## Consequences

- With stacked modals, ESC and backdrop clicks close only the topmost modal.
- Opening and closing a modal no longer adds listeners.
- Code which closed a modal by hiding its backdrop, e.g.
  `modal.backdrop.hide()`, must call `modal.hide()` now. Nothing in mockup
  did that.
- ESC while an ajax modal is still loading does nothing, also when another
  modal is open below it. Before, it hid the backdrop while the spinner
  stayed, or closed the modal below.
- A modal keeps the shared backdrop when it is hidden while another modal on
  the same backdrop element is open or loading.
- ESC is only recognized by `e.key`. Events without `key`, like a
  jQuery-triggered event with only `keyCode`, do not close the modal.
