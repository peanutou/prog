/// <reference path="../typings/tsd.d.ts"/>

import {
	Component, 
	View, 
	bootstrap, 
	bind
} from 'angular2/angular2';
import {
	APP_BASE_HREF,
	ROUTER_DIRECTIVES, 
	routerBindings,
	RouteConfig,
	Location,
	LocationStrategy,
	PathLocationStrategy
} from 'angular2/router';
import {
	Http,
	HTTP_BINDINGS
} from 'angular2/http'

import {HomeComponent} from './components/home/home';
import {AboutComponent} from './components/about/about';
import {VideoComponent} from './components/video/video';
import {VideoService} from './services/video-service';

@Component({
	selector: 'prog-app'
})
@RouteConfig([
  { path: '/Video', component: VideoComponent, as: 'Videos'},
  { path: '/Home', component: HomeComponent, as: 'Home' },
  { path: '/About', component: AboutComponent, as: 'About' },
])
@View({
	templateUrl: './app.html',
	styleUrls: ['./app.css'],
  	directives: [ROUTER_DIRECTIVES]
})
class AppComponent {
	constructor(location: Location) {
		//location.go('/home');
	}
};

bootstrap(AppComponent, [
	routerBindings(AppComponent),
	bind(LocationStrategy).toClass(PathLocationStrategy),
	bind(APP_BASE_HREF).toValue('/'),
	VideoService,
	Http,
	HTTP_BINDINGS
]).catch(err => console.error(err));

