export class GlobalSettings {
	SERVICE_BASE_URL: string;
	
	constructor (data: any) { 
		this.SERVICE_BASE_URL = data.SERVICE_BASE_URL;
	}
} 