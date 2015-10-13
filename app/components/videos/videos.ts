/// <reference path="../../../typings/tsd.d.ts"/>

import {Component, View, CORE_DIRECTIVES, Injectable} from 'angular2/angular2'
import {VideoService} from '../../services/video-service'

@Component({
	selector: 'videos'
})
@View({
	templateUrl: './components/video/video.html',
	directives: [CORE_DIRECTIVES]
})
export class VideoComponent {	
	/*
	constructor(public videos: VideoService) {
		console.info('aaaaaaaaa');
		console.info(videos);		
	}
	*/
}