import Constants from '../Common/Constants';
import Storage from '../Storage';
import Utils from '../Common/Utils';
import { logout, toast } from '../CommonMethod';
import axios from 'axios';
import { omitBy, isNil } from 'lodash';

export interface IApiResult {
  code?: any;
  result?: any;
  paging?: any;
  message?: string;
  data?: any;
  searchValue?: string;
}

export enum BaseServiceType {
  LOYALTY = 1,
  MARKETING = 2,
  PROFILING = 3,
  PRODUCT = 4,
  TEST = 5,
}

export interface IServiceParamPaging {
  page?: string;
  per_page?: string;
  search?: string;
  afterToken?: string;
}

// export interface IServiceParams {
//     path: string;
//     query: any;
//     body: any;
//     paging: IServiceParamsPaging;
// }

export enum BaseServiceMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete'
}

export interface IServiceResponse {
  dataKey?: string,
  item?: any
}

export interface BaseServiceParam {
  hostApiPath?: string;
  path: string;
  method?: BaseServiceMethod;
  body?: any;
  query?: any;
  headers?: any;
  clearCache?: boolean;
  keyCache?: string;
  paging?: IServiceParamPaging;
  response?: IServiceResponse;
  returnResponseServer?: boolean;
  successCode?: string | number;
}

export class BaseService {
  constructor() { }

  endCodeUrl(params: any, isBody: boolean): String {
    params = omitBy(params, param => param === '' || isNil(param));
    let res = '';
    for (const p in params) {
      res += `&${p}=${encodeURIComponent(params[p])}`;
    }
    return res === '' ? '' : `${isBody ? '' : '?'}${res.substring(1)}`;
  }

  async postUrlEndCode(api: string, body: any, options?: { search?: any, mapResponse?: any, requestOptions?: any } = {}) {
    await Utils.initGlobalData();
    const pathAPI = await this.getApiPath();
    const baseQuery = `?lang=${Constants.Lang}`;
    const url = `${pathAPI}${api}${baseQuery}`;
    let formBody = [];
    for (var property in body) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(body[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    const convertBody = formBody.join("&");
    const config: any = {
      method: BaseServiceMethod.PATCH,
      url: url,
      headers: {
        Accept: 'application/json',
        'X-Merchant-ID': Constants.MerchantId,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${Constants.AuthToken}`,
      },
      data: convertBody
    };
    // console.log('config', config);

    const service = axios.create(config);
    return new Promise(resolve => {
      service.request(config).then((response) => {
        if (!response || !response.data) {
          return resolve({
            code: 500,
            result: null
          });
        }
        return resolve(response);
        // const responseData = this.getResponseData(response, params.response);
        // if (params.returnResponseServer) {
        //   keyCache && Storage.setItem(keyCache, responseData);
        //   return resolve(responseData);
        // }
        // const result = {
        //   code: response.data.code,
        //   result: responseData,
        //   paging: response.data.paging || (response.data.data && response.data.data.paging),
        //   message: response.data.message
        // };
        // keyCache && Storage.setItem(keyCache, result);
        // resolve(result);
      }).catch((error) => {
        console.log('postUrlEndCode error ', error, config, 'data = ', error.response);
        if (error.response && error.response && error.response.status === 401) {
          toast('Phiên làm việc của bạn đã quá hạn hoặc bạn đã đăng nhập ở trên thiết bị khác. Vui lòng đăng nhập lại.');
          logout(true);
          resolve({
            code: 401,
            result: error.response && error.response.data
          });
          return;
        }
        const code: number = error.response && error.response && error.response.data ? parseInt(`${error.response.data.code}`) : 500;
        resolve({
          code: code,
          result: error.response && error.response.data
        });
      });
    })

    // const params = new URLSearchParams();
    // params.append('classify', '1');

    // axios.patch(url, params, config1)
    //   .then((result) => {
    //     console.log('class', result);
    //     return resolve(result);
    //   })
    //   .catch((err) => {
    //     console.log('err', err);
    //     return resolve(null);
    //     // Do somthing
    //   })
    // })




    // const bodyValue = DefineFunction.endCodeUrl(body, true);
    // if (!options.mapResponse || typeof options.mapResponse !== 'function') {
    //   options.mapResponse = this.mapResponseDefault;
    // }
    // return this._http.post(`${this.apiUrl}${api}`, bodyValue, this.options).map(options.mapResponse).catch(this.catchError);
  }

  async fetch(params: BaseServiceParam, isThirdParty: boolean = false, useOriginUrl: boolean = false): Promise<IApiResult> {
    // await Utils.initGlobalData();
    const config = await this.buildParams(params, isThirdParty, useOriginUrl);
    return new Promise(async (resolve) => {
      let keyCache = params && params.keyCache && `${params.keyCache}_${params.method}_${config.url}_${config.data && JSON.stringify(config.data)}`;
      if (params.clearCache && keyCache) {
        Storage.removeItem(keyCache);
      }
      const dataCache = keyCache && await Storage.getItem(keyCache);
      if (dataCache) {
        // console.log('get from cache ', params.keyCache);
        return resolve(dataCache);
      }
      const service = axios.create(config);
      // console.log('fetch config', config);
      service.request(config).then((response) => {
        if (!response || !response.data) {
          return resolve({
            code: 500,
            result: null
          });
        }
        const responseData = this.getResponseData(response, params.response);
        if (params.returnResponseServer) {
          keyCache && Storage.setItem(keyCache, responseData);
          return resolve(responseData);
        }
        const result = {
          code: response.data.code,
          result: responseData,
          paging: response.data.paging || (response.data.data && response.data.data.paging),
          message: response.data.message
        };
        keyCache && Storage.setItem(keyCache, result);
        resolve(result);
      }).catch((error) => {
        console.log('fetch error ', error, config, 'data = ', error.response);
        if (error.response && error.response && error.response.status === 401) {
          toast('Phiên làm việc của bạn đã quá hạn hoặc bạn đã đăng nhập ở trên thiết bị khác. Vui lòng đăng nhập lại.');
          logout(true);
          resolve({
            code: 401,
            result: error.response && error.response.data
          });
          return;
        }
        const code: number = error.response && error.response && error.response.data ? parseInt(`${error.response.data.code}`) : 500;
        resolve({
          code: code,
          result: error.response && error.response.data
        });
      });
    });
  }

  getResponseData = (response: any, serviceResponse?: IServiceResponse) => {
    if (!serviceResponse) {
      return response.data;
    }
    const dataKey = serviceResponse.dataKey || 'data';
    const dataKeys = dataKey.split(',');
    let data = response.data;
    dataKeys.forEach((key: string) => {
      data = data[key];
    });
    const items = serviceResponse.item ?
      data.map((item: any) => {
        const newItem: any = {};
        Object.keys(serviceResponse.item).forEach(key => {
          const convertValue = serviceResponse.item[key];
          if (typeof convertValue === 'string') {
            newItem[key] = item[convertValue];
          }
          if (typeof convertValue === 'function') {
            newItem[key] = convertValue(item);
          }
        });
        return newItem;
      }) :
      [...data];

    response.data.data = items;
    return response.data;
  }

  async buildParams(params: BaseServiceParam, isThirdParty: boolean = false, useOriginUrl: boolean = false) {
    // build query
    const baseQuery = !isThirdParty ? `?lang=${Constants.Lang}` : '';
    let query = baseQuery;
    if (params.query) {
      if (typeof params.query === 'string') {
        query = `${query}${params.query}`;
      } else {
        Object.keys(params.query).forEach(key => {
          query = `${query}&${key}=${params.query[key]}`;
        });
      }
    }

    // build config
    const pathAPI = await this.getApiPath();
    const url = useOriginUrl ? `${params.path}${query}` : `${params.hostApiPath || pathAPI}${params.path}${query}`;
    let config: any = {
      method: params.method || BaseServiceMethod.GET,
      url: url,
      headers: params.headers || {
        Accept: 'application/json',
        'X-Merchant-ID': Constants.MerchantId,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Constants.AuthToken}`,
      },
    };
    if (params.body) {
      config = { ...config, data: params.body };
    }


    return config;
  }

  getApiPath = async () => {
    return '';
  }
}


