---
permalink: "pat/select2/"
title: Select2
---

# Select2 pattern.

Autoselection widget.


## Configuration

| Option | Type | Default | Description |
|:-:|:-:|:-:|:-:|
| separator | string | ',' | Analagous to the separator constructor parameter from Select2. Defines a custom separator used to distinguish the tag values. Ex: a value of ";" will allow tags and initialValues to have values separated by ";" instead of the default ",". |
| initialValues | string | null | This can be a json encoded string, or a list of id:text values. Ex: Red:The Color Red,Orange:The Color Orange  This is used inside the initSelection method, if AJAX options are NOT set. |
| vocabularyUrl | string | null | This is a URL to a JSON-formatted file used to populate the list. |
| allowNewItems | string | true | All new items to be entered into the widget. |
| onSelecting | string or function | null | Name of global function or function to call when value is selecting. |
| onSelected | string or function | null | ame of global function or function to call when value has been selected. |
| onDeselecting | string or function | null | Name of global function or function to call when value is deselecting. |
| onDeselected | string or function | null | Name of global function or function to call when value has been deselected. |

For more options on select2 go to http://ivaynberg.github.io/select2/#documentation


## Examples

### Autocomplete with search (single select)

<select class="pat-select2" data-pat-select2="width:20em">
 <option value="Acholi">Acholi</option>
 <option value="Afrikaans">Afrikaans</option>
 <option value="Akan">Akan</option>
 <option value="Albanian">Albanian</option>
 <option value="Amharic">Amharic</option>
 <option value="Arabic">Arabic</option>
 <option value="Ashante">Ashante</option>
 <option value="Asl">Asl</option>
 <option value="Assyrian">Assyrian</option>
 <option value="Azerbaijani">Azerbaijani</option>
 <option value="Azeri">Azeri</option>
</select>


### Tagging

<input type="text" class="pat-select2"
       data-pat-select2="separator:,;
                         tags:Red,Yellow,Green,Orange,Purple;
                         width:20em;
                         initialValues:Red:The Color Red,Orange:The Color Orange"
       value="Red,Orange"/>


### Orderable tags

<input type="text" class="pat-select2"
      data-pat-select2="orderable:true;
                        tags:Red,Yellow,Green;
                        width:20em" />


### AJAX tags

<input type="hidden" class="pat-select2"
       data-pat-select2="placeholder:Search for a Value;
                         vocabularyUrl:select2-test.json;
                         width:20em" />

