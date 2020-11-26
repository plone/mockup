---
permalink: "pat/tree/"
title: Tree
---

# Tree

Tree pattern.


## Configuration

| Option | Type | Default | Description |
|:-:|:-:|:-:|:-:|
| data | jSON | undefined | load data structure directly into tree |
| dataUrl | jSON | undefined | Load data from remote url |
| autoOpen | boolean | false | auto open tree contents |
| dragAndDrop | boolean | false | node drag and drop support |
| selectable | boolean | true | if nodes can be selectable |
| keyboardSupport | boolean | true | if keyboard naviation is allowed |

### JSON node data

<div class="pat-tree"
    data-pat-tree='data:[
        { "label": "node1",
        "children": [
            { "label": "child1" },
            { "label": "child2" }
        ]
        },
        { "label": "node2",
        "children": [
            { "label": "child3" }
        ]
        }
    ];'> </div>

### JSON data

<div class="pat-tree"
    data-pat-tree='data:[{"label": "node1","children": [{"label": "child1"},{"label": "child2"}]}]; autoOpen:true;'></div>

### Remote data URL

<div class="pat-tree"
    data-pat-tree="dataUrl:/fileTree.json;
                    autoOpen:true;"></div>

### Drag and drop

<div class="pat-tree"
    data-pat-tree="dataUrl:fileTree.json;
                    dragAndDrop: true;
                    autoOpen: true"></div>
