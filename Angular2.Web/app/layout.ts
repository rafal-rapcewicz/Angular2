import {Component} from 'angular2/core';
import {TodoApp} from './todo_app';
import {Page2} from './page2';
import {HTTPTestComponent} from './http-test.component';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {RouteConfig} from 'angular2/router';

@Component({
    selector: 'layout',
    template: `
    <nav>
        <a [routerLink]="['Page1']">Page1</a>
        <a [routerLink]="['Page2']">Page2</a>
    </nav>
    <div>
        <router-outlet></router-outlet>
        
        <http-test></http-test>
    </div>`,
    directives: [TodoApp, Page2, HTTPTestComponent, ROUTER_DIRECTIVES]
})
@RouteConfig([
    { path: '/page1', name: 'Page1', component: TodoApp, useAsDefault: true },
    { path: '/page2', name: 'Page2', component: Page2 }
])
export class Layout {
}
