import {Component, provide} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {provideStore} from '@ngrx/store';

import {blog} from '../../reducers';

import {HomeComponent} from '../home/home.component';
import {AboutComponent} from '../about/about.component';
import {BlogComponent} from '../blog/blog.component';
import {BlogArticleComponent} from '../blogArticle/blogArticle.component';



@Component({
    selector: 'my-app',
    template: require('./app.component.html'),
    styles: [require('./app.component.scss')],
    directives: [ROUTER_DIRECTIVES],
    providers: [HTTP_PROVIDERS, provideStore({blog})]
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
      path: '/blog/:slug',
      name: 'BlogArticle',
      component: BlogArticleComponent
    }
])
export class AppComponent {
}