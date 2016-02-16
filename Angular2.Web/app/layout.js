System.register(['angular2/core', './todo_app', './page2', './http-test.component', 'angular2/router'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, todo_app_1, page2_1, http_test_component_1, router_1, router_2;
    var Layout;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (todo_app_1_1) {
                todo_app_1 = todo_app_1_1;
            },
            function (page2_1_1) {
                page2_1 = page2_1_1;
            },
            function (http_test_component_1_1) {
                http_test_component_1 = http_test_component_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
                router_2 = router_1_1;
            }],
        execute: function() {
            Layout = (function () {
                function Layout() {
                }
                Layout = __decorate([
                    core_1.Component({
                        selector: 'layout',
                        template: "\n    <nav>\n        <a [routerLink]=\"['Page1']\">Page1</a>\n        <a [routerLink]=\"['Page2']\">Page2</a>\n    </nav>\n    <div>\n        <router-outlet></router-outlet>\n        \n        <http-test></http-test>\n    </div>",
                        directives: [todo_app_1.TodoApp, page2_1.Page2, http_test_component_1.HTTPTestComponent, router_1.ROUTER_DIRECTIVES]
                    }),
                    router_2.RouteConfig([
                        { path: '/page1', name: 'Page1', component: todo_app_1.TodoApp, useAsDefault: true },
                        { path: '/page2', name: 'Page2', component: page2_1.Page2 }
                    ]), 
                    __metadata('design:paramtypes', [])
                ], Layout);
                return Layout;
            })();
            exports_1("Layout", Layout);
        }
    }
});
//# sourceMappingURL=layout.js.map