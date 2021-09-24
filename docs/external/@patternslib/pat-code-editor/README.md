# pat-code-editor

## Documentation

This is code editor pattern based on CodeJar and PrismJS.


### Options reference

| Property       | Default Value | Type              | Description                   |
| -------------- | ------------- | ----------------- | ----------------------------- |
| language       | null          | String, null      | Programming language to use.  |
| linenumbres    | true          | Boolean           | Show line numbers.            |
| theme          | null          | String            | Name of PrismJS theme.        |
| tab            | "    "        | String            | Characters to use as tab.     |
| indent-on      | {$            | String            | Regex pattern where the next line is indented. |
| spellcheck     | false         | Boolean           | Activate spellchecking.       |
| catch-tab      | true          | Boolean           | Catch a tab keystroke and indent. |
| preserve-indent | true         | Boolean           | Preserve indentation of original source. |
| add-closing    | true          | Boolean           | Automatically add closing brackets. |
| history        | true          | Boolean           | Activate undo history.        |


## Examples

### Invocation on a contenteditable div

<div class="pat-code-editor" data-pat-code-editor="language: javascript" contenteditable>
import Pattern from "./code-editor";
Pattern.init(document.querySelector(".pat-code-editor"));
</div>

```html
<div class="pat-code-editor" data-pat-code-editor="language: javascript" contenteditable>
import Pattern from "./code-editor";
Pattern.init(document.querySelector(".pat-code-editor"));
</div>
```

### Invocation on a textarea

This will create a div where the code editor is finally initialized and changes are synchronized back to the text editor.

<textarea class="pat-code-editor" data-pat-code-editor="language: css">
body {
  background-color: black;
  color: blue;
}
</textarea>

```html
<textarea class="pat-code-editor" data-pat-code-editor="language: css">
body {
  background-color: black;
  color: blue;
}
</textarea>
```

