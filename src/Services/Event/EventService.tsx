import { BaseService, BaseServiceMethod } from "mo-app-common/src/Services/BaseService";
import { HOST_EVENT } from "mo-app-common/src/Services/HostPathApi";

class EventService extends BaseService {

	getApiPath = async () => {
		return HOST_EVENT();
	}

	public async updateTag(service, query, body) {
		const params = service;
		params.body = body;
		console.log('updateTag', params);
		return await this.fetch({
			path: params.path,
			method: params.method,
			body: params.body,
			returnResponseServer: params.returnResponseServer,
		});
	} 

}


export default new EventService();