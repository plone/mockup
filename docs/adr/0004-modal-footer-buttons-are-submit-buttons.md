# 0004 pat-plone-modal: Only submit buttons of the form controls go to the footer

Status: Proposed (2026-11-26)

## Context

The `buttons` option of pat-plone-modal selects the elements which are moved
to the modal footer. The originals are hidden in the modal body, and with
`automaticallyAddButtonActions` (the default) the same selector registers
them as form actions: a click submits the form via AJAX and, with the
default `actionOptions`, closes the modal.

The default was
`.formControls > input[type="submit"], .formControls > button`. It also
matched buttons of the type `button` and `reset`. Such buttons do not submit
a form - they are usually handled by JavaScript or reset the form - but the
modal moved them to the footer and submitted the form on a click.

The type of a button does not tell form buttons (save, cancel) from other
submit buttons in `.formControls`, like the add and remove buttons of a
z3c.form multi widget. Those are submit buttons, because the server redraws
the form with the added or removed row. They have to be told apart by their
place in the form, as pat-registry does with `.multi-widget-buttons`.

## Decision

The default of `buttons` is
`.formControls > input[type="submit"], .formControls > button:not([type="button"], [type="reset"])`.
A `<button>` without a `type` attribute is a submit button and is still
selected.

pat-registry, which overrides `buttons` to exclude `.multi-widget-buttons`,
uses the same restriction.

## Consequences

-   Buttons of the type `button` or `reset` in `.formControls` stay visible in
    the modal body and keep their own behavior. They no longer submit the
    form or close the modal.
-   Forms which relied on a `type="button"` button in `.formControls` being
    moved to the footer and submitting the form have to use a submit button
    or set the `buttons` option.
-   The buttons of a multi widget are still selected by the default. Modals
    which show forms with multi widgets need to exclude them, like
    pat-registry does.
