import {bootstrap} from 'angular2/platform/browser';
import {Layout}   from './layout';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

bootstrap(Layout, [ROUTER_PROVIDERS, HTTP_PROVIDERS);