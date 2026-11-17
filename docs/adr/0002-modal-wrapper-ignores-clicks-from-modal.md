# 0002 pat-modal: The wrapper's close on click handler ignores clicks from within the modal

Status: Accepted (2026-11-15)

## Context

pat-modal has two close on click handlers:

-   A native handler on the `.modal` element, registered in
    `activateFocusTrap`, which calls `hide()`.
-   A jQuery handler on the modal wrapper, which hides the backdrop. The
    backdrop's `hidden` event then hides the modal.

With `loadLinksWithinModal` (the default) another click handler on `.modal`
stops the propagation of all clicks, so the wrapper handler only received
clicks on the wrapper itself.

With `loadLinksWithinModal: false`, clicks inside the modal bubbled up to
the wrapper. The wrapper handler canceled them with `preventDefault()` -
breaking checkboxes, links and submit buttons in the modal - and closed the
modal. The modal's own handler had already reset the pointer state from
[ADR 0001](0001-modal-close-on-click-pointer-position.md), so the wrapper
handler could not tell that the click came from inside.

## Decision

The wrapper handler returns early for clicks whose event path includes the
`.modal` element. It neither cancels nor stops these clicks, nor closes the
modal.

Clicks triggered via jQuery - e.g. by the modal's own Enter key handler,
which triggers a click on the first submit button of a form - have no
`originalEvent` and no event path. For those, the wrapper handler checks
if the `.modal` element contains the target. Their target is the element
the click was triggered on, which is still connected.

Each click is handled by exactly one close on click handler: clicks on
`.modal` and its descendants by the modal's handler, clicks on the wrapper
and the inner wrapper by the wrapper's handler.

The wrapper ignores all clicks from `.modal` and not only those from
`.modal-content`. Otherwise a click on the backdrop area of `.modal` would be
evaluated twice and the second evaluation would see the already reset pointer
state - a drag from inside the modal to its backdrop area would close it.

## Consequences

-   `loadLinksWithinModal: false` is usable: clicks inside the modal work and
    keep the modal open.
-   With `loadLinksWithinModal: false`, clicks inside the modal now bubble up
    to `document`. With the default setting they still don't, because the
    `.modal` click handler stops their propagation. Document level and
    delegated click handlers - e.g. Bootstrap's data API for dropdowns or
    collapse - therefore do not work inside modals by default. Removing that
    `stopPropagation()` call is a separate change.
