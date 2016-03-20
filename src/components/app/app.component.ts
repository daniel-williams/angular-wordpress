import {Component} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {STORE_PROVIDERS} from '../../store';
import {HomeComponent} from '../home/home.component';
import {AboutComponent} from '../about/about.component';
import {BlogComponent} from '../blog/blog.component';
import {BlogPostComponent} from '../blogArticle/blogArticle.component';


@Component({
    selector: 'my-app',
    template: require('./app.component.html'),
    styles: [require('./app.component.scss')],
    directives: [ROUTER_DIRECTIVES],
    providers: [HTTP_PROVIDERS, ...STORE_PROVIDERS]
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
        path: '/blog',
        name: 'Blog',
        component: BlogComponent
    },
    {
      path: '/blog/:id',
      name: 'BlogPost',
      component: BlogPostComponent
    }
])
export class AppComponent {
}