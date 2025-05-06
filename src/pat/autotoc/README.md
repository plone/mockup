---
layout: layout.liquid
permalink: "pat/autotoc/"
title: Autotoc
---

# Autotoc pattern.

Automatically create a table of contents.

## Configuration

|        Option        |  Type  |      Default      |              Description                                                    |
| :------------------: | :----: | :---------------: | :-------------------------------------------------------------------------: |
| IDPrefix             | string | 'autotoc-item-'   | Prefix used to generate ID.                                                 |
| classActiveName      | string | 'active'          | Class used for active level.                                                |
| classLevelPrefixName | string | 'autotoc-level-'  | Class prefix used for the TOC levels.                                       |
| classSectionName     | string | 'autotoc-section' | Class used for section in TOC.                                              |
| classTOCName         | string | 'autotoc-nav'     | Class used for the TOC.                                                     |
| levels               | string | 'h1,h2,h3'        | Selectors used to find levels.                                              |
| scrollDuration       | string | 'slow'            | Speed of scrolling.                                                         |
| scrollEasing         | string | 'swing'           | Easing to use while scrolling.                                              |
| section              | string | 'section'         | Tag type to use for TOC.                                                    |
| validationDelay      | number | 200               | For tabbed forms: Delay time in ms after the validation marker gets active. |

## Validation support for tabbed forms

In case the autotoc pattern is used for tabbed forms together with
pat-validation (a quite common case for z3c forms in Plone) the autotoc
navigation items are marked with `required` and `invalid` classes, if
applicable.

This allows for a quick overview in which tabs required input fields or invalid
data is present.

The option `validationDelay` is set to twice the delay of pat-validation input
check delay. The default is 200ms after which the form's tab-navigation is
marked with the required and invalid CSS classes.


## Examples

### Example 1

<div class="pat-autotoc"
     data-pat-autotoc="scrollDuration:slow;levels:h4,h5,h6;">
 <h4>Title 1</h4>
 <p>Mr. Zuckerkorn, you've been warned about touching. You said
    spanking. It walked on my pillow! How about a turtle? I've always
    loved those leathery little snappy faces.</p>
 <h5>Title 1.1</h5>
 <p>Ah coodle doodle do Caw ca caw, caw ca caw. Butterscotch!</p>
 <h6>Title 1.1.1</h6>
 <p>Want a lick? Okay, Lindsay, are you forgetting that I was
    a professional twice over - an analyst and a therapist.</p>
 <h4>Title 2</h4>
 <p>You boys know how to shovel coal? Don't worry, these young
 beauties have been nowhere near the bananas. I thought the two of
 us could talk man-on-man.</p>
</div>

### Example 2

<div class="pat-autotoc autotabs"
     data-pat-autotoc="section:fieldset;levels:legend;">
   <fieldset>
     <legend>Tab 1</legend>
     <div>
       Lorem ipsum dolor sit amet, ex nam odio ceteros fastidii,
       id porro lorem pro, homero facilisis in cum.
       At doming voluptua indoctum mel, natum noster similique ne mel.
     </div>
   </fieldset>
   <fieldset>
     <legend>Tab 2</legend>
     <div>
       Reque repudiare eum et. Prompta expetendis percipitur eu eam,
       et graece mandamus pro, eu vim harum audire tractatos.
       Ad perpetua salutandi mea, soluta delicata aliquando eam ne.
       Qui nostrum lucilius perpetua ut, eum suas stet oblique ut.
     </div>
   </fieldset>
   <fieldset>
     <legend>Tab 3</legend>
     <div>
       Vis mazim harum deterruisset ex, duo nemore nostro civibus ad,
       eros vituperata id cum. Vim at erat solet soleat,
       eum et iuvaret luptatum, pro an esse dolorum maiestatis.
     </div>
   </fieldset>
</div>
