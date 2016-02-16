System.register(['angular2/platform/browser', './layout', 'angular2/router', 'angular2/http'], function(exports_1) {
    var browser_1, layout_1, router_1, http_1;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (layout_1_1) {
                layout_1 = layout_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            browser_1.bootstrap(layout_1.Layout, [router_1.ROUTER_PROVIDERS, http_1.HTTP_PROVIDERS]);
        }
    }
});
//# sourceMappingURL=main.js.map