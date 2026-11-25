# 0001 pat-plone-modal: Close on click only if pressed and released outside the modal

Status: Accepted (2026-11-15)

## Context

With the `closeOnClick` backdrop option (the default), a click outside of
`.modal-content` closes the modal.

Browsers dispatch the `click` event on the nearest common ancestor of the
`mousedown` and `mouseup` targets. When a drag starts inside the modal and
ends on the backdrop area - e.g. when selecting text in a form field - or the
other way round, the click is dispatched on `.modal` or on the modal wrapper.
Both are outside of `.modal-content`, so the modal closed and unsaved form
input was lost.

Bootstrap 5 only closes a modal if the `mousedown` target and the `click`
target are both the modal element. That handles a drag from inside to
outside, but not the other way round: pressing on `.modal` and releasing
inside `.modal-content` results in a click on `.modal` - the same element
which received the `mousedown`.

## Decision

The modal wrapper listens to `mousedown` and `mouseup` and stores in
`_pointer_inside` whether either of them happened inside `.modal-content`.
`mousedown` resets the state, `mouseup` can only set it.

The listeners are registered natively in the capture phase. Controls inside
the modal which stop the propagation of `mousedown` or `mouseup` - e.g.
select2 - would hide these events from bubbling listeners on the wrapper.

Both close on click handlers - the one on `.modal` and the one on the
wrapper - read and reset this state via `_consumePointerInside()` and do not
close the modal if it is set.

Inside detection is done with `_isInsideModal()`, which checks the event's
`composedPath()` instead of the target's current ancestry. The path is fixed
at dispatch time and still valid if a reactive control removed the clicked
node before the handler runs.

Events triggered via jQuery do not reach native listeners and do not
change the state.

## Consequences

-   The modal is only closed by a click if the mouse button was pressed and
    released outside of `.modal-content`.
-   Each `mousedown` resets the state, so a press without a following click
    cannot affect a later click.
-   Only capture listeners on `window` or `document` which stop the
    propagation of `mousedown` or `mouseup` can hide these events from the
    wrapper.
-   Clicks without a preceding `mousedown`, e.g. from `element.click()`, are
    only checked by their own event path.
-   A click inside the modal which is stopped by another handler before it
    reaches `.modal` - e.g. on the buttons in `.formControls` - does not
    reset the state. A following click without a preceding `mousedown` on
    the backdrop area, e.g. from `element.click()`, then does not close the
    modal. This cannot be reached with the mouse, because each `mousedown`
    resets the state.
