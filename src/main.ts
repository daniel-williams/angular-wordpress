import {provide} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy, APP_BASE_HREF} from 'angular2/router';

import {AppComponent} from './components/app/app.component';

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  // PathLocationStrategy being the default, we only need to define APP_BASE_HREF
  provide(APP_BASE_HREF, {useValue: '/'})
  // Here we want to use the # strategy instead:
  // provide(LocationStrategy, {useClass: HashLocationStrategy})
]);