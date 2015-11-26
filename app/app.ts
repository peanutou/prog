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
	ROUTER_PROVIDERS,
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
import {YTVideoService} from './services/ytvideo-service';
import {GlobalSettings} from './services/global-settings';

@Component({
	selector: 'prog-app'
})
@RouteConfig([
	{ path: '/Video', component: VideoComponent, as: 'Videos'},
	{ path: '/Home', component: HomeComponent, as: 'Home' },
	{ path: '/About', component: AboutComponent, as: 'About' }
])
@View({
	templateUrl: './app.html',
	styleUrls: ['./app.css'],
  	directives: [ROUTER_DIRECTIVES]
})
class AppComponent {
	public selectedPage: string;
	
	constructor(location: Location) {
		// location.go('/Home');
		// this.selectedPage = 'Home';
	}
	
	toggle(selectedPage: string) {
		this.selectedPage = selectedPage;
	}
}

bootstrap(AppComponent, [
	ROUTER_PROVIDERS,
	bind(LocationStrategy).toClass(PathLocationStrategy),
	bind(APP_BASE_HREF).toValue(''),
	VideoService,
	YTVideoService,
	Http,
	HTTP_BINDINGS,
	bind(GlobalSettings).toValue({
		SERVICE_BASE_URL: 'http://www.peanutou.com/api/'})
]).catch(err => console.error(err));

