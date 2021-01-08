import $ from "jquery";
import Base from "patternslib/src/core/base";

export default Base.extend({
    name: "inlinevalidation",
    trigger: ".pat-inlinevalidation",
    parser: "mockup",

    render_error($field, errmsg) {
        var $errbox = $("div.fieldErrorBox", $field);
        if (errmsg !== "") {
            $field.addClass("error");
            $errbox.html(errmsg);
        } else {
            $field.removeClass("error");
            $errbox.html("");
        }
    },

    render_error_bootstrap($field, errmsg) {
        var $input = $("input", $field),
            $errbox = $(".invalid-feedback", $field);
        if (errmsg !== "") {
            $input.addClass("is-invalid");
            if ($errbox.length) {
                $errbox.html(errmsg);
            } else {
                $(
                    '<div class="invalid-feedback">' + errmsg + "</div>"
                ).insertAfter($input);
            }
        } else {
            $input.removeClass("is-invalid");
            if ($errbox.length) {
                $errbox.remove();
            }
        }
    },

    append_url_path(url, extra) {
        // Add '/extra' on to the end of the URL, respecting querystring
        var i,
            ret,
            urlParts = url.split(/\?/);
        ret = urlParts[0];
        if (ret[ret.length - 1] !== "/") {
            ret += "/";
        }
        ret += extra;
        for (i = 1; i < urlParts.length; i += 1) {
            ret += "?" + urlParts[i];
        }
        return ret;
    },

    queue(queueName, callback) {
        if (typeof callback === "undefined") {
            callback = queueName;
            queueName = "fx"; // 'fx' autoexecutes by default
        }
        $(window).queue(queueName, callback);
    },

    validate_archetypes_field(input) {
        var $input = $(input),
            $field = $input.closest(".field"),
            uid = $field.attr("data-uid"),
            fname = $field.attr("data-fieldname"),
            value = $input.val();

        // value is null for empty multiSelection select, turn it into a [] instead
        // so it does not break at_validate_field
        if ($input.prop("multiple") && value === null) {
            value = $([]).serialize();
        }

        // if value is an Array, it will be send as value[]=value1&value[]=value2 by $.post
        // turn it into something that will be useable or value will be omitted from the request
        var traditional;
        var params = $.param(
            { uid: uid, fname: fname, value: value },
            (traditional = true)
        );
        if ($field && uid && fname) {
            this.queue(
                $.proxy((next) => {
                    $.ajax({
                        type: "POST",
                        url:
                            $("base").attr("href") +
                            "/at_validate_field?" +
                            params,
                        iframe: false,
                        success: $.proxy((data) => {
                            this.render_error($field, data.errmsg);
                            next();
                        }, this),
                        error() {
                            next();
                        },
                        dataType: "json",
                    });
                }, this)
            );
        }
    },

    validate_formlib_field(input) {
        var $input = $(input),
            $field = $input.closest(".field"),
            $form = $field.closest("form"),
            $cloned_form = $form.clone(),
            fname = $field.attr("data-fieldname");

        // XXX: Remove binary files so they are not uploaded to server
        $cloned_form.find("input[type=file]").remove();
        this.queue(
            $.proxy((next) => {
                $cloned_form.ajaxSubmit({
                    url: this.append_url_path(
                        $cloned_form.attr("action"),
                        "@@formlib_validate_field"
                    ),
                    data: { fname: fname },
                    iframe: false,
                    success: $.proxy((data) => {
                        this.render_error($field, data.errmsg);
                        next();
                    }, this),
                    error() {
                        next();
                    },
                    dataType: "json",
                });
            }, this)
        );
    },

    validate_z3cform_field(input) {
        var $input = $(input),
            $field = $input.closest(".field"),
            $form = $field.closest("form"),
            $cloned_form = $form.clone(),
            fset = $input.closest("fieldset").attr("data-fieldset"),
            fname = $field.attr("data-fieldname");

        // XXX: When cloning a form, values from 'select' elements are not kept
        //      so we copy them from the original form here.
        $.each($("select", $form), (k, v) => {
            $('select[name="' + v.name + '"]', $cloned_form).val($(v).val());
        });

        // XXX: Remove binary files so they are not uploaded to server
        $cloned_form.find("input[type=file]").remove();
        if (fname) {
            this.queue(
                $.proxy((next) => {
                    $cloned_form.ajaxSubmit({
                        url: this.append_url_path(
                            $cloned_form.attr("action"),
                            "@@z3cform_validate_field"
                        ),
                        data: { fname: fname, fset: fset },
                        iframe: false,
                        success: $.proxy((data) => {
                            if ($field.hasClass("form-group")) {
                                this.render_error_bootstrap(
                                    $field,
                                    data.errmsg
                                );
                            } else {
                                this.render_error($field, data.errmsg);
                            }
                            next();
                        }, this),
                        error() {
                            next();
                        },
                        dataType: "json",
                    });
                }, this)
            );
        }
    },

    init() {
        this.$el
            .find(
                'input[type="text"], ' +
                    'input[type="password"], ' +
                    'input[type="checkbox"], ' +
                    "select, " +
                    "textarea"
            )
            .on(
                "blur",
                $.proxy((ev) => {
                    if (this.options.type === "archetypes") {
                        this.validate_archetypes_field(ev.target);
                    } else if (this.options.type === "z3c.form") {
                        this.validate_z3cform_field(ev.target);
                    } else if (this.options.type === "formlib") {
                        this.validate_formlib_field(ev.target);
                    }
                }, this)
            );
    },
});
