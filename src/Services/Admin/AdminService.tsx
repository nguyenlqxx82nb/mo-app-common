import StorageKeys from "../../Storage/keys";
import { BaseService, BaseServiceMethod, BaseServiceParam } from "../BaseService";
import { CacheKeys } from '../CacheKeys';
import JwtHelper from "../../Common/JwtHelper";
import Storage from "../../Storage";
import Constants from '../../Common/Constants';
import Utils from '../../Common/Utils';
import { HOST_ADM } from '../HostPathApi';

class AdminService extends BaseService {

	getApiPath = async () => {
		return await HOST_ADM();
	}

	public async getListAccountActive(query) {
		return await this.fetch({
			path: 'accounts',
			method: BaseServiceMethod.GET,
			query: query,
			returnResponseServer: true,
			keyCache: StorageKeys.CacheListAccountActive
		});
	}

	public async fetchBrandsRelated() {
		await Utils.initGlobalData();
		return await this.fetch({
			path: `merchants/${Constants.MerchantId}/related`,
			method: BaseServiceMethod.GET,
			query: '&page=-1',
			returnResponseServer: true,
			keyCache: CacheKeys.BRAND_RELATED
		});
	}

	public async fetchProfileGroups(needRelated: boolean, hasCurrentMerchant: boolean, query: any = { page: -1 }) {
		await Utils.initGlobalData();
		let brandsRelated;
		if (needRelated) {
			const brandResponse = await this.fetchBrandsRelated();
			brandsRelated = brandResponse.data;
		}
		// console.log('getProfileGroup brandsRelated ', brandsRelated);
		const merchantIDs = [];
		if (hasCurrentMerchant) {
			merchantIDs.push(Constants.MerchantId);
		}
		if (brandsRelated && brandsRelated.length) {
			brandsRelated.map(item => {
				if (!hasCurrentMerchant && item.id === Constants.MerchantId) {
					return;
				}
				merchantIDs.push(item.id);
			});
		}

		query.merchant_ids = merchantIDs.toString();
		const config: BaseServiceParam = {
			path: `profile-groups`,
			method: BaseServiceMethod.GET,
			query: query,
			returnResponseServer: true,
			keyCache: CacheKeys.PROFILE_GROUP
		}
		const result = await this.fetch(config);

		return result;
	}

	// public async fetchProfileGroups(needRelated: boolean, hasCurrentMerchant: boolean, query: any = {page:-1}) {
	// 	await Utils.initGlobalData();
	// 	let brandsRelated;
	//   if (needRelated) {
	// 		const brandResponse = await this.fetchBrandsRelated();
	// 		brandsRelated = brandResponse.data;
	// 	}
	// 	// console.log('getProfileGroup brandsRelated ', brandsRelated);
	// 	const merchantIDs = [];
	//   if (hasCurrentMerchant) {
	//     merchantIDs.push(Constants.MerchantId);
	//   }
	//   if (brandsRelated && brandsRelated.length) {
	//     brandsRelated.map(item => {
	//       if (!hasCurrentMerchant && item.id === Constants.MerchantId) {
	//         return;
	//       }
	//       merchantIDs.push(item.id);
	//     });
	//   }

	//   query.merchant_ids = merchantIDs.toString();
	// 	const config: BaseServiceParam = {
	// 		path: `profile-groups`,
	// 		method: BaseServiceMethod.GET,
	// 		query: query,
	// 		returnResponseServer: true,
	// 		keyCache: CacheKeys.PROFILE_GROUP
	// 	}
	// 	const result = await this.fetch(config);

	// 	return result;
	// }

	public async getAccountSetting() {
		const allSetting = await Storage.getItem(StorageKeys.KEY_CACHE_SETTING_ALL);
		if (allSetting && allSetting.length) {
			Promise.resolve(allSetting);
			return;
		}
		await Utils.initGlobalData();
		return await this.fetch({
			path: `merchants/${JwtHelper.decodeToken().merchantID}/accounts/settings/get`,
			method: BaseServiceMethod.GET,
			query: {},
			returnResponseServer: true,
		});
	}

	public async updateSetting(body) {
		await Utils.initGlobalData();
		return await this.fetch({
			path: `merchants/${JwtHelper.decodeToken().merchantID}/accounts/settings/update`,
			method: BaseServiceMethod.POST,
			body: body,
			returnResponseServer: true,
		});
}

	public async getPermisions() {
		await Utils.initGlobalData();
		return await this.fetch({
			path: `merchants/${JwtHelper.decodeToken().merchantID}/modules/details`,
			method: BaseServiceMethod.GET,
			query: {},
			returnResponseServer: true,
		});
	}
}

export default new AdminService();