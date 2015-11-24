/// <reference path="../../typings/tsd.d.ts"/>

import { Observable, Injectable } from 'angular2/angular2'
import { Http, Response } from 'angular2/http'
import { GlobalSettings } from './global-settings'

@Injectable()
export class VideoService {
	private _videos: any;
	
	constructor(private _http: Http,
				private _gs: GlobalSettings) {
		this.getVideos();
	}

	get Videos() : Array<Object> {
		return this._videos;
	}
	
	getVideos(): any {
		this._http.get(this._gs.SERVICE_BASE_URL + 'videos')
			.subscribe((res:Response) => { this._videos = res.json(); });
	}

}