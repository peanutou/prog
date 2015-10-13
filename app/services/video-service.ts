/// <reference path="../../typings/tsd.d.ts"/>

import { Observable, Injectable } from 'angular2/angular2'
import { Http, Response } from 'angular2/http'

@Injectable()
export class VideoService {
	private _videos: any;
	
	constructor(private http: Http) {
		console.info(http);
		this.getVideos();
	}

	get Videos() : Array<Object> {
		return this._videos;
	}
	
	getVideos(): any {
		this.http.get('http://localhost:3000/api/videos')
			.subscribe((res:Response) => { this._videos = res.json(); });
	}

}