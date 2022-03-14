import { BaseService, BaseServiceMethod } from "../BaseService";
import { HOST_CALL_CENTER } from "../HostPathApi";
import Utils from '../../Common/Utils';
import Constants from '../../Common/Constants';
import { CacheKeys } from '../../Services/CacheKeys';
// import StorageKeys from '../../Storage/keys';
import Storage from '../../Storage/index';
import jwt_decode from 'jwt-decode';

const AccessTokenApi = '/access-token-api';
const AccessTokenClient = '/access-token-client';
class CallCenterConfigService extends BaseService {

	getApiPath = async () => {
		return HOST_CALL_CENTER();
	}

	/**
	 * get access token
	 * @param data object type = 1: accessToken, 2: accessAgentToken 
	 */
	public getAccessToken = async (data: { type: 1 | 2 }) => {
		await Utils.initGlobalData();
		let checkExpired = false;
		let token;
		let keyCached;
		let cachedValue;
		const date = new Date();
		const time = Math.ceil(date.getTime());
		data['staff_id'] = Constants.StaffId;
		switch (data.type) {
			case 1:
				keyCached = CacheKeys.KEY_CACHE_CALL_CENTER + AccessTokenClient;
				break;
			case 2:
				keyCached = CacheKeys.KEY_CACHE_CALL_CENTER + AccessTokenApi;
				break;
			default:
				break;
		}
		cachedValue = await Storage.getItem(keyCached);
		if (cachedValue) {
			token = cachedValue['token'];
			const dataToken = jwt_decode(token);
			checkExpired = time < dataToken['exp'] ? true : false;
		}

		if (!cachedValue || checkExpired) {
			const result = await this.fetch({
				path: `merchants/${Constants.MerchantId}/callcenter/access_token`,
				method: BaseServiceMethod.POST,
				body: data,
			});
			console.log('result ', result);
			// this._cacheService.set(keyCached, result['data'], CacheService.CACHE_1_DAY);
		}
	}

}

export default new CallCenterConfigService(); 