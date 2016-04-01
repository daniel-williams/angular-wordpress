import {Component, ViewEncapsulation} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {STORE_PROVIDERS} from './store';

import {HomeComponent} from './home';
import {AboutComponent} from './about';
import {BlogComponent, BlogService} from './blog';


@Component({
    selector: 'my-app',
    template: require('./app.component.html'),
    styles: [require('./app.component.scss')],
    directives: [ROUTER_DIRECTIVES],
    providers: [HTTP_PROVIDERS, ...STORE_PROVIDERS, BlogService],
    encapsulation: ViewEncapsulation.None,
})
@RouteConfig([
    {
        path: '/',
        name: 'Home',
        component: HomeComponent
    },
    {
        path: '/about',
        name: 'About',
        component: AboutComponent
    },
    {
      path: '/blog/tag/:tag',
      name: 'BlogTag',
      component: BlogComponent
    },
    {
      path: '/blog/:slug',
      name: 'BlogPost',
      component: BlogComponent
    },
    {
        path: '/blog',
        name: 'Blog',
        component: BlogComponent
    }
])
export class AppComponent {
}