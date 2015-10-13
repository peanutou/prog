/// <reference path="../../../typings/tsd.d.ts"/>

import {Component, View, CORE_DIRECTIVES} from 'angular2/angular2';

@Component({
  selector: 'about'
})
@View({
  templateUrl: './components/about/about.html',
  directives: [CORE_DIRECTIVES]
})
export class AboutComponent {
}
