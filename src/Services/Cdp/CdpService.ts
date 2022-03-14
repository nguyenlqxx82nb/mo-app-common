import Constants from "../../Common/Constants";
import { BaseService, BaseServiceMethod } from "../BaseService";
import { HOST_PROFILING } from "../HostPathApi";

class CdpService extends BaseService {

	getApiPath = async () => {
		return HOST_PROFILING();
	}

	public getProfileBySocialIds(social_ids: Array<string>) {
		return this.fetch({
			path: `profile/search_by_social_ids`,
			method: BaseServiceMethod.POST,
			body: { social_ids },
			returnResponseServer: true
		});
	}

	public async updateCustomer(customerId: string, body: any) {
		return await this.fetch({
			path: `merchants/${Constants.MerchantId}/customers/actions/update/${customerId}`,
			method: BaseServiceMethod.PATCH,
			body: body,
			returnResponseServer: true,
		});
	}

	public async getSystemSocialUser(body: any) {
		return await this.fetch({
			path: `systems/social/users`,
			method: BaseServiceMethod.POST,
			body: body,
			returnResponseServer: true,
		});
	}
}

export default new CdpService();