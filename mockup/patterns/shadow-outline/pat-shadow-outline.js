(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        
        define([
            "pat-registry",
            "pat-parser",
            "pat-base"
            ], function() {
                return factory.apply(this, arguments);
            });
    } else {
        // A module loader is not available. In this case, we need the
        // patterns library to be available as a global variable "patterns"
        factory(root.patterns, root.patterns.Parser, root.patterns.Base);
    }
}(this, function(registry, Parser, Base) {
   
    "use strict"; 

    
    var parser = new Parser("shadow-outline");
    // A configuration parameter and its default value.
parser.addArgument("align", "right");
    // We now create and return our custom pattern.
    // We extend the Base pattern so our custom pattern will be automatically registered.
    return Base.extend({
        name: "shadow-outline",
       
        trigger: ".pat-shadow-outline", // The CSS selector that triggers this pattern

        jquery_plugin: true,

        init: function patExampleInit($el, opts) {
            // $el is the DOM element on which the pattern is declared.
            // It gets passed in to init, but is also available on the
            // pattern itself, just call this.$el.
            var options = parser.parse($el, opts);  
            setTimeout($.proxy(function () {
                this.setColor($el, options);
            }, this),100);
        },
	
        setColor: function patExampleSetColor($el, options) {
            $el.css("margin-left", options.align);
	    $el.css("margin-right", options.align);
	    $el.css("background-color",'#b0c4de');
	    $el.css("border-radius","10px 35px");
	    $el.css("box-shadow", "10px 10px 15px #3b5998");
	   
	    
		
        }
    });
}));
