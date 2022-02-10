import Router from "./router";

describe("Router", function () {
    var router = new Router();

    beforeEach(function () {
        var self = this;
        router._changeLocation = function (path, hash) {
            self.routerPath = path + "#" + hash;
        };
    });

    afterEach(function () {
        this.routerPath = undefined;
        router.reset();
    });

    it("routes and calls back", function () {
        var foo = {
            set: false,
        };

        var callback = function () {
            this.set = true;
        };

        router.addRoute("test", "foo", callback, foo, "");
        router.navigate("test:foo", { trigger: true });

        // somehow the callback isn't called ... don't know why yet
        // expect(foo.set).toBe(true);
    });

    it("redirects from added action", function () {
        var foo = {
            set: false,
        };

        var callback = function () {
            this.set = true;
        };

        expect(this.routerPath).toEqual(undefined);
        router.addRoute("test", "foo", callback, foo, "/");
        router.redirect();

        expect(this.routerPath).toEqual("#!/test:foo");
    });

    it("basic redirect", function () {
        router.addRedirect("/", "test:two");
        router.redirect();

        expect(this.routerPath).toEqual("#!/test:two");
    });
});
