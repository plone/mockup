ES6 Upgrade TODO
================

- pat-markspeciallinks: less -> scss, integrate scss, fix icons
- passwordstrength
- pickadate icons
- querystring
- recurrende date picker
- less imports and macro calls.
-
- utils.resolveIcon - check if imported / fetched icons benefit from caching
-
-
-
-


Glyphicons -> Bootstrap Icons
-----------------------------

glyphicon-check                             check, check-all
glyphicon-cog                               gear, gear-fill
glyphicon-duplicate                         clipboard-plus
glyphicon-eye-open                          eye
glyphicon-file                              file-earmark
glyphicon-folder-close                      folder2
glyphicon-folder-open                       folder2-open
glyphicon-fullscreen                        arrows-fullscreen
glyphicon-home                              house-door
glyphicon-list                              list-ul
glyphicon-ok-circle                         check-circle, file-check, bookmark-check
glyphicon-open-file                         clipboard
glyphicon-pencil                            pencil
glyphicon-picture                           image
glyphicon-plus                              plus-circle, plus
glyphicon-refresh                           arrow-repeat
glyphicon-remove                            x-circle
glyphicon-remove-circle
glyphicon-remove-sign
glyphicon-scissors                          clipboard-x
glyphicon-star                              star
glyphicon-step-backward rleft               arrow-down, carret-down
glyphicon-step-backward rright              arrow-up, carret-up
glyphicon-time                              clock
glyphicon-trash                             trash


link-external                               link-45deg
link-mailto                                 envelope
link-ftp                                    server
link-news                                   newspaper
link-irc                                    chat
link-h323                                   camera-video
link-sip                                    headset
link-callto                                 telephone
link-https                                  lock
link-feed                                   rss
link-webcal                                 calendar-event






105:            icon: "floppy-disk",
114:                icon: "folder-open",
122:                icon: "file",
130:                icon: "search",
138:                icon: "search",
146:                icon: "random",
153:                icon: "trash",
188:            icon: "file",
197:            icon: "file",
205:            icon: "search",
226:                icon: "upload",


7:            icon: "search",
522:            icon: "wrench",
529:            icon: "fullscreen",
552:            icon: "new-window",
562:            icon: "cog",
569:            icon: "refresh",
579:            icon: "floppy-remove",
586:            icon: "question-sign",
611:            icon: "file",


icon-up
icon-down
icon-moreOptions
icon-logout
icon-edit
icon-folderContents

iconLevelUp
iconLevelDown

src/pat/tinymce/js/links.js
341:        icon: "image",
348:        icon: "image",
359:        icon: "link",
367:        icon: "unlink",
378:        icon: "link",


src/pat/structure/js/views/textfilter.js
155:            icon: "filter",


src/pat/structure/js/views/app.js
388:            icon: "th",
412:                icon: "sort-by-attributes",
432:                icon: "upload",
















src/core/ui/templates/dropdown.xml
3:  <span class="glyphicon glyphicon-<%= icon %>"></span>

src/core/ui/views/anchor.js
18:        '<% if (icon) { %><span class="glyphicon glyphicon-<%= icon %>"></span><% } %> <%= title %> <span class="shortcut"><%= shortcut %></span>',

src/core/ui/views/button.js
17:        '<% if (icon) { %><span class="glyphicon glyphicon-<%= icon %>"></span><% } %> <%= title %>',

