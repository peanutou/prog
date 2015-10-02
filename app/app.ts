/// <reference path="../typings/tsd.d.ts"/>

import {Component, View, bootstrap} from 'angular2/angular2';

@Component({
	selector: 'prog-app'
})
@View({
	templateUrl: 'app.html'
})
class AppComponent {
	
}

bootstrap(AppComponent);