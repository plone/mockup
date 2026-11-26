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
  Only the last one, the topmost, reacts to ESC (`e.key === "Escape"`).
  A backdrop click hits the topmost modal's wrapper, which covers the ones
  below, and calls `hide()` of that modal.
- The modal no longer listens to the backdrop's `hidden` event.
- The ESC and resize handlers are bound per instance, in a jQuery namespace
  like `.plone-modal-3`, when the modal is shown, and removed on every
  `hide()`. `hide()` also calls the new `Backdrop.destroy()`.

## Consequences

- With stacked modals, ESC and backdrop clicks close only the topmost modal.
- Opening and closing a modal no longer adds listeners.
- Code which closed a modal by hiding its backdrop, e.g.
  `modal.backdrop.hide()`, must call `modal.hide()` now. Nothing in mockup
  did that.
- ESC while an ajax modal is still loading does nothing. Before, it hid the
  backdrop while the spinner stayed.
- ESC is only recognized by `e.key`. Events without `key`, like a
  jQuery-triggered event with only `keyCode`, do not close the modal.
