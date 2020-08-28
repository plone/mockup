jqTreeContextMenu
=================

A context menu "plugin" to jqTree.

Heavily modifed version of [the original](https://github.com/DavidUv/jqTreeContextMenu).

Usage
-----

Example:

```
    <!-- context menu -->
    <ul id="context-menu" class="dropdown-menu">
        <li data-item="edit"><a>Edit</a></li>
        <li data-item="delete"><a>Delete</a></li>
        <li data-item="foo"><a>bar</a></li>
    </ul>  

    <!-- jqTree -->
    <div id="tree"></div>

    <script>
      $(function() {
          var data = [
              {
                   name: 'node1', id: 1,
                   children: [
                       { name: 'child1', id: 2 },
                       { name: 'child2', id: 3 }
                   ]
              },
              {
                  name: 'node2', id: 4,
                  children: [
                      { name: 'child3', id: 5 }
                  ]
              }
          ];
          $('#tree').tree({ data: data });
          $('#tree').jqTreeContextMenu({
              menu: '#context-menu',
              onContextMenuItem: function(e, node, $el){
                  console.log($el.data("item"));
                  console.log(node.name);
              }
          });
      });
    </script>
</body>
```

Options
-----

| Name | Type | Default | Description |
|------|------|---------|-------------|
| menu | string | undefined | A jQuery selector for the menu (ie `#context-menu`) |
| selectClickedNode | bool | true | Whether or not the jqTree node should be selected when right-clicked |
| onContextMenuItem | closure | null | Called when a context menu item is clicked. `functon(e, node, $menuItem) { }`|
| contextMenuDecider | closure | null | Called before the menu is shown to allow choosing the context menu (see below) |
| menuFadeDuration | int | 250 | The time in miliseconds for the menu fade in/out effect |

Examples
-----

**contextMenuDecider**

Use this closure option to decide which context menu should be shown when a node is clicked:

```
    $('#tree').jqTreeContextMenu({
        menu: '#context-menu',
        contextMenuDecider: function(node) {
            // Return a special context menu for the "root" jqTree node...
            if (!node.parent.parent) {
                return '#context-menu-root';
            }

            // Return false and the default context menu will be shown...
            return false;
        }
    });
```

**onContextMenuItem**

Use this closure to decide what action to take when a menu item is clicked. See the use example for more detail.

Events
-----

| Name | Parameters | Description |
|------|------------|-------------|
| cm-jqtree.item.click | event, node, $el | This is triggered when a menu item is clicked. The `$el` is the menu item itself |

