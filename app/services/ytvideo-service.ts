/// <reference path="../../typings/tsd.d.ts"/>

import { Observable, Injectable } from 'angular2/angular2'
import { Http, Response } from 'angular2/http'
import { GlobalSettings } from './global-settings'

@Injectable()
export class YTVideoService {
	private _videoInfo: any;
	
	constructor(private _http: Http, 
				private _gs: GlobalSettings) {
		this._videoInfo = {};
		this._videoInfo.url_encoded_fmt_stream_map = [];
		this._videoInfo.iurl = '';
	}
		
	get VideoInfo() : string {
		return this._videoInfo;
	}
	
	private _findUsefulData() {
		console.info(this._videoInfo);
		
		// multiple codecs
		this._videoInfo.url_encoded_fmt_stream_map = 
			this._videoInfo.url_encoded_fmt_stream_map
				.split(/;\+/g)
				.map((object: any) => {
					// find codec
					var itag = /itag=([^&]*)/.exec(object);
					
					var v: any = {};
					v.itag = itag ? itag[1] : null;
					v.fmt = object;
					return v;
				});
	}
	
	getVideoInfo(videoId: string, callback?: (videoInfo: any) => void, callee?: any): any {
		this._http.get(this._gs.SERVICE_BASE_URL + 'ytvideos/' + videoId)
			.subscribe((res:Response) => { 
				this._videoInfo = res.json();
				
				// find useful data
				this._findUsefulData();
				
				// callback 
				if (callback) {
					var param = this._videoInfo;
					if (callee) {
						callback.call(callee, param);
						// callback.apply(callee, param);
					} else {
						callback(param);
					}
				} 
			});
	}
}
