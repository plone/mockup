---
permalink: "pat/resourceregistry/"
title: Resource Registry
---

# Resource Registry pattern.

## Configuration

| Option | Type | Default | Description |
|:-:|:-:|:-:|:-:|
| bundles | object | {} | object with all bundles |
| resources | object | {} | object with all resources |
| javascripts | object | {} | object with all legacy type javascripts |
| css | object | {} | object with all legacy type css |
| overrides | array | [] | List of current overrides |
| managerUrl | string | null | url to handle manage actions |
| baseUrl | string  | null | to render resources from |
| lesscUrl | string | null | url to lessc to load for compiling less |
| rjsUrl | string | null | url to lessc to load for compiling less |
| lessvariables | object | {} | group of settings that can be configured |


## Example

<div class="pat-resourceregistry"
   data-pat-resourceregistry='{"bundles":{
                                "plone": {
                                  "resources": ["plone"], "depends": "",
                                  "expression": "", "enabled": true, "conditionalcomment": "",
                                  "develop_javascript": false, "develop_css": false,
                                  "compile": true
                                },
                                "plone-auth": {
                                  "resources": ["plone-auth"], "depends": "plone",
                                  "expression": "", "enabled": true, "conditionalcomment": "",
                                  "develop_javascript": false, "develop_css": false,
                                  "compile": true
                                },
                                "barceloneta": {
                                  "resources": ["barceloneta"], "depends": "*",
                                  "expression": "", "enabled": true, "conditionalcomment": "",
                                  "develop_javascript": false, "develop_css": false,
                                  "compile": false
                                }
                              },
                              "resources": {
                                "plone": {
                                  "url": "js/bundles", "js": "plone.js",
                                  "css": [], "deps": "", "export": "",
                                  "conf": "", "force": false
                                },
                                "plone-auth": {
                                  "url": "js/bundles", "js": "plone-auth.js",
                                  "css": [], "deps": "", "export": "",
                                  "conf": "", "force": false
                                },
                                "barceloneta": {
                                  "url": "js/bundles", "js": "barceloneta.js",
                                  "css": ["barceloneta.less"], "deps": "", "export": "",
                                  "conf": "", "force": false
                                },
                                "modal": {
                                  "url": "patterns/modal", "js": "pattern.js",
                                  "css": ["pattern.modal.less"], "deps": "", "export": "",
                                  "conf": "", "force": false
                                },
                                "autotoc": {
                                  "url": "patterns/autotoc", "js": "pattern.js",
                                  "css": ["pattern.autotoc.less", "pattern.other.less"],
                                  "deps": "", "export": "", "conf": ""
                                },
                                "pickadate": {
                                  "url": "patterns/pickadate", "js": "pattern.js",
                                  "css": ["pattern.pickadate.less"], "deps": "", "export": "",
                                  "conf": "", "force": true
                                }
                              },
                              "lessvariables": {
                                "foo": "bar"
                              },
                              "overrides": ["patterns/pickadate/pattern.js"],
                              "baseUrl": "/resources-registry",
                              "manageUrl": "/registry-manager",
                              "lessUrl": "node_modules/less/dist/less-1.7.4.min.js",
                              "lessConfigUrl": "tests/files/lessconfig.js",
                              "rjsUrl": "tests/files/r.js"}'>
</div>

```html
<div class="pat-resourceregistry"
   data-pat-resourceregistry='{"bundles":{
                                "plone": {
                                  "resources": ["plone"], "depends": "",
                                  "expression": "", "enabled": true, "conditionalcomment": "",
                                  "develop_javascript": false, "develop_css": false,
                                  "compile": true
                                },
                                "plone-auth": {
                                  "resources": ["plone-auth"], "depends": "plone",
                                  "expression": "", "enabled": true, "conditionalcomment": "",
                                  "develop_javascript": false, "develop_css": false,
                                  "compile": true
                                },
                                "barceloneta": {
                                  "resources": ["barceloneta"], "depends": "*",
                                  "expression": "", "enabled": true, "conditionalcomment": "",
                                  "develop_javascript": false, "develop_css": false,
                                  "compile": false
                                }
                              },
                              "resources": {
                                "plone": {
                                  "url": "js/bundles", "js": "plone.js",
                                  "css": [], "deps": "", "export": "",
                                  "conf": "", "force": false
                                },
                                "plone-auth": {
                                  "url": "js/bundles", "js": "plone-auth.js",
                                  "css": [], "deps": "", "export": "",
                                  "conf": "", "force": false
                                },
                                "barceloneta": {
                                  "url": "js/bundles", "js": "barceloneta.js",
                                  "css": ["barceloneta.less"], "deps": "", "export": "",
                                  "conf": "", "force": false
                                },
                                "modal": {
                                  "url": "patterns/modal", "js": "pattern.js",
                                  "css": ["pattern.modal.less"], "deps": "", "export": "",
                                  "conf": "", "force": false
                                },
                                "autotoc": {
                                  "url": "patterns/autotoc", "js": "pattern.js",
                                  "css": ["pattern.autotoc.less", "pattern.other.less"],
                                  "deps": "", "export": "", "conf": ""
                                },
                                "pickadate": {
                                  "url": "patterns/pickadate", "js": "pattern.js",
                                  "css": ["pattern.pickadate.less"], "deps": "", "export": "",
                                  "conf": "", "force": true
                                }
                              },
                              "lessvariables": {
                                "foo": "bar"
                              },
                              "overrides": ["patterns/pickadate/pattern.js"],
                              "baseUrl": "/resources-registry",
                              "manageUrl": "/registry-manager",
                              "lessUrl": "node_modules/less/dist/less-1.7.4.min.js",
                              "lessConfigUrl": "tests/files/lessconfig.js",
                              "rjsUrl": "tests/files/r.js"}'>
</div>
```

