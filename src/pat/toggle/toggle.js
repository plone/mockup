import $ from "jquery";
import Base from "patternslib/src/core/base";

export default Base.extend({
        name: "toggle",
        trigger: ".pat-toggle",
        parser: "mockup",
        defaults: {
            attribute: "class",
            event: "click",
            targetScope: "global",
        },
        init: function () {
            var self = this;

            if (!self.options.target) {
                self.$target = self.$el;
            } else if (self.options.targetScope === "global") {
                self.$target = $(self.options.target);
            } else {
                //self.$target = self.$el[self.options.menu](self.options.target);
                self.$target = self.$el
                    .parents(self.options.targetScope)
                    .first()
                    .find(self.options.target);
            }

            if (!self.$target || self.$target.length === 0) {
                $.error('No target found for "' + self.options.target + '".');
            }

            self.on(self.options.event, function (e) {
                self.toggle();
                e.stopPropagation();
                e.preventDefault();
            });
        },
        isMarked: function () {
            var self = this;
            var marked = false;

            for (var i = 0; i < this.$target.length; i = i + 1) {
                if (self.options.attribute === "class") {
                    if (this.$target.eq(i).hasClass(this.options.value)) {
                        marked = true;
                    } else {
                        marked = false;
                        break;
                    }
                } else {
                    if (
                        this.$target.eq(i).attr(this.options.attribute) ===
                        this.options.value
                    ) {
                        marked = true;
                    } else {
                        marked = false;
                        break;
                    }
                }
            }
            return marked;
        },
        toggle: function () {
            var self = this;
            if (self.isMarked()) {
                self.remove();
            } else {
                self.add();
            }
        },
        remove: function () {
            var self = this;
            self.emit("remove-attr");
            if (self.options.attribute === "class") {
                self.$target.removeClass(self.options.value);
            } else {
                self.$target.removeAttr(self.options.attribute);
            }
            self.emit("attr-removed");
        },
        add: function () {
            var self = this;
            self.emit("add-attr");
            if (self.options.attribute === "class") {
                self.$target.addClass(self.options.value);
            } else {
                self.$target.attr(self.options.attribute, self.options.value);
            }
            self.emit("added-attr");
        },
    });

