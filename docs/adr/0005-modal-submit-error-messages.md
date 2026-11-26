# 0005 pat-plone-modal: Error or warning for a failed form submit, with the HTTP status

Status: Proposed (2026-11-26)

## Context

When a form submit in pat-plone-modal fails and neither `onError` nor
`onTimeout` is set, the modal shows a message above the form (#1363). jQuery
reports the failure as one of `timeout`, `abort`, `parsererror` or `error`.
These failures are not all alike: after a timeout the server may still have
processed the request, after an error response it most likely did not.

To help the user understand what went wrong, we considered showing a message
from the error response. Plone's `ExceptionView`
(`Products.CMFPlone/browser/exceptions.py`) answers a request without
`text/html` in its `Accept` header with JSON, and jQuery sends `*/*` for the
modal's form submit. That JSON only contains the exception class name, like
`{"error_type": "ReadOnlyError"}`, which is meant for developers.
Errors from outside of Plone, like a proxy's 502 or 413, come as HTML or plain
text. Getting a useful text out of all of these would need a parser for each
format, and the result would still often be technical.

## Decision

The message depends on the failure:

| Failure | Message | Type |
|---|---|---|
| `timeout` | The request may still have been processed, check before submitting again. | warning |
| `parsererror` | The response could not be read. | error |
| `error` without a status (no response, e.g. network down) | The server could not be reached. | error |
| `error` with a status | The server could not process the request, with the HTTP status, e.g. `(500 Internal Server Error)`. | error |
| `abort` | none, the request was aborted on purpose | |

A warning uses the classes `statusmessage-warning alert-warning` and the label
"Warning", an error `statusmessage-error alert-danger` and "Error".

The HTTP status code and status text are shown, but not the response body.
HTTP/2 has no status text, then only the code is shown.

## Consequences

-   The user sees whether the request may have succeeded (warning) or not
    (error), and can tell e.g. a missing permission (403) from a server error
    (500).
-   The response body is not read, so no exception details or internals of
    the server are shown, and no response format has to be supported.
-   The message does not say what exactly failed on the server. Detailed
    handling still needs `onError` or `onTimeout`.
