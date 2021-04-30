---
permalink: "pat/eventedit/"
title: Eventedit
---

# Eventedit

The pattern works with plone.app.event Archetypes and Dexterity forms.

-   Start / end validation: The pattern adds a error class, if end is before start.

-   Start / end delta: After changing the start date, the end date is automatically updated by a delta timespan.
    The delta is calculated from the difference of the start and end time, if they are already set.

-   Whole day handling: After clicking the whole day checkbox, the start and end time fields are hidden.

-   Open end handling: After clicking the open end checkbox, the end date/time field is hidden.

## Configuration

|   Option   |  Type  | Default |                                  Description                                  |
| :--------: | :----: | :-----: | :---------------------------------------------------------------------------: |
| errorClass | string | "error" | class to set on the end datetime field wrapper, if end date validation fails. |

## Examples

### Example 1

<div class="pat-eventedit">
    <div id="formfield-form-widgets-IEventBasic-start">
        Start
        <input class="pat-pickadate" type="text" name="form.widgets.IEventBasic.start" value="2014-08-14 14:00" />
    </div>
    <div id="formfield-form-widgets-IEventBasic-end">
        End
        <input class="pat-pickadate" type="text" name="form.widgets.IEventBasic.end" value="2014-08-14 15:30" />
    </div>
    <div id="formfield-form-widgets-IEventBasic-whole_day">
        Whole Day
        <input type="checkbox" />
    </div>
    <div id="formfield-form-widgets-IEventBasic-open_end">
        Open End
        <input type="checkbox" />
    </div>
</div>

### Example 2

<div class="pat-eventedit">
    <div id="archetypes-fieldname-startDate">
        Start
        <input class="pat-pickadate" type="text" name="startDate" value="2014-08-14 14:00" />
    </div>
    <div id="archetypes-fieldname-endDate">
        End
        <input class="pat-pickadate" type="text" name="endDate" value="2014-08-14 14:30" />
    </div>
    <div id="archetypes-fieldname-wholeDay">
        Whole Day
        <input type="checkbox" id="wholeDay" />
    </div>
    <div id="archetypes-fieldname-openEnd">
        Open End
        <input type="checkbox" id="openEnd" />
    </div>
</div>
