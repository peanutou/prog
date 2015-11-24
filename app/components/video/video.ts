/// <reference path="../../../typings/tsd.d.ts"/>

import {Component, View, CORE_DIRECTIVES, Injectable} from 'angular2/angular2'
import {VideoService} from '../../services/video-service'
import {GlobalSettings} from '../../services/global-settings';
import {YTVideoService} from '../../services/ytvideo-service';

@Component({
	selector: 'videos'
})
@View({
	templateUrl: './components/video/video.html',
	styleUrls: ['./components/video/video.css'],
	directives: [CORE_DIRECTIVES]
})
export class VideoComponent {
	private _todoList: any[];
	
	get TodoList() {
		return this._todoList;
	}
	
	constructor(public videoService: VideoService, 
				private gs: GlobalSettings,
				public ytvideoService: YTVideoService) {
		this._restoreFromLocal();
	}
	
	private _addTodos(todos: string) {
		todos.split(';').forEach((value, index, array) => {
			var video = new Video();
			video._id = this._todoList.length + 1;
			video.source = 'youtube';
			video.id = value;
			video.caption_file = '/';
			video.cover_file = '/';
			video.video_file = '/';
			this._todoList.push(video);			
		})
	}
	
	private _restoreFromLocal() {
		if (typeof(Storage) != 'undefined') {
			// Code for LocalStorage/sessionStorage
			this._todoList = JSON.parse(localStorage.getItem('todo_list'));
		} else {
			// Sorry! No Web Storage support...
		}
	}
	
	private _saveToLocal() {
		if (typeof(Storage) != 'undefined') {
			// Code for LocalStorage/sessionStorage
			localStorage.setItem('todo_list', JSON.stringify(this._todoList));
		} else {
			// Sorry! No Web Storage support...
		}
	}
	
	doneTyping($event: any) {
		if ($event.which === 13 /* enter key */) {
			
			// add todo videos, split by ';'
			this._addTodos($event.target.value)
			$event.target.value = '';
			
			// save user input to Local Storage
			this._saveToLocal();
		}
	}
	
	removeTodo($event: any, video: Video) {
		var index = this._todoList.indexOf(video);

		if (index != -1) {
			delete this._todoList[index];
			this._todoList.splice(index, 1);
		}

		this._saveToLocal();
	}
	
	private _findVideoUrl(data: string): string {
		var reg: RegExp = /url=(https:[^,]+)/g;
		var tokens: any = reg.exec(data);
		if (tokens) { // find a url
			// polish url
			var url = tokens[1];
			// no duplicate params
			var reg1: RegExp = /&?([^=]+)=([^&]*)/g;
			var tokens1: any;
			var map: any = {};
			var url1: string = '';
			while (tokens1 = reg1.exec(url)) {
				// if (url1 !== '') url1 += '&';
				if (map[tokens1[1]]) break;
				map[tokens1[1]] = tokens1[2];
				url1 += tokens1[0];
			}
			return url1;
		}

		return '';
	}
	
	private _findHighestQualityVideo(videoInfo: any): string {
		var fmt_list: string = videoInfo.fmt_list;
		var fmts: string[] = fmt_list.split(',');
		var fmt_highest = fmts[0];
		var itag_highest = fmt_highest.split('/')[0];
		var url_encoded_fmt_stream_map: any = videoInfo.url_encoded_fmt_stream_map;
		var i: any;
		var video_highest: any;
		for (i = 0; i < url_encoded_fmt_stream_map.length; ++i) {
			if (url_encoded_fmt_stream_map[i].itag == itag_highest &&
				url_encoded_fmt_stream_map[i].fmt.match('url')) {

				video_highest = this._findVideoUrl(url_encoded_fmt_stream_map[i].fmt);
				break;
			}
		}
		return video_highest;
	}
	
	private _findCaptionUrl(videoInfo: any): string {
		if (videoInfo.has_cc === 'True') {
			var caption_tracks = videoInfo.caption_tracks;
			var reg: RegExp = /u=(.*\?([^=]+=[^&]*&?){10})/g;
			var tokens: any = reg.exec(caption_tracks);
			var caption_url: string = tokens[1];
			return caption_url;
		}
		return '';
	}
	
	private _videoCallback(videoInfo: any) {
		// get video_id
		var videoId = videoInfo.video_id;
		// find video object from this._todoList
		var video: Video = null;
		
		for (var i = 0; i < this._todoList.length; ++i) {
			if (this._todoList[i].id === videoId) {
				video = this._todoList[i];
				break;
			}			
		}
		// if find video, get data
		if (video) {
			video.data = videoInfo;
			video.title = videoInfo.title;
			video.author = videoInfo.author;
			video.cover_file = videoInfo.iurl; 
			video.caption_file = this._findCaptionUrl(videoInfo);
			video.keywords = videoInfo.keywords;
			video.video_file = this._findHighestQualityVideo(videoInfo);
			video.data = videoInfo;
		}
		
		// save to local storage
		this._saveToLocal();
	}
	
	getVideoInfo($event: any, video: Video) {
		this.ytvideoService.getVideoInfo(video.id, this._videoCallback, this);
	}
}

class Video {
	_id: number;
	source: string;
	id: string;
	title: string;
	author: string;
	caption_file: string;
	video_file: string;
	cover_file: string;
	keywords: string;
	data: any;
}
