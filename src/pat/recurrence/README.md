---
permalink: "pat/recurrence/"
title: Recurrence
---

# Recurrence pattern.

Show the recurrence widget.

## Configuration

|    Option     |  Type  | Default |             Description              |
| :-----------: | :----: | :-----: | :----------------------------------: |
| localization  | object |  null   |   Customizations to locatizations.   |
| configuration | object |         | recurrent input widget configuration |

## Example

### Recurrence without additional start feature

<label>Recurrence start date:
<input name="start-1" type="date" value="2026-01-01"/>
</label>
<label>Recurrence:
<textarea
    class="pat-recurrence"
    data-pat-recurrence='{
        "startField": "[name=start-2]"
    }'></textarea>
</label>

```html
<textarea
    class="pat-recurrence"
    data-pat-recurrence='{
        "startField": "[name=start-2]"
    }'
></textarea>
```

### Recurrence with additional start feature

Note: adding additional start dates is a feature of the specification but is
not supported by a number of external tools, like Google Calendar, Microsoft
Outlook or Gnome Calendar.
Therefore, this feature is disabled by default.
However, you can enable it with the `allowAdditionalDates` feature.

<label>Recurrence start date:
<input name="start-2" type="date" value="2026-01-01"/>
</label>
<label>Recurrence:
<textarea
    class="pat-recurrence"
    data-pat-recurrence='{
        "startField": "[name=start-2]",
        "allowAdditionalDates": true
    }'></textarea>
</label>

```html
<textarea
    class="pat-recurrence"
    data-pat-recurrence='{
        "startField": "[name=start-2]",
        "allowAdditionalDates": true
    }'
></textarea>
```
