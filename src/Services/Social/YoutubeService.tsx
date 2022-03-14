import Constants  from "../../Common/Constants";
import { BaseService, BaseServiceMethod } from "../BaseService";
import { HOST_YOUTUBE } from "../HostPathApi";

class YoutubeService extends BaseService {
  getApiPath = async () => {
    return HOST_YOUTUBE();
  }

  private getHeader(token?: string) {
    if (!token) {
      return {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      };
    }
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  public getInfoUserById(token: string, idChannel?: string) {
    return this.fetch({
      path: 'channels?part=snippet%2CcontentDetails%2Cstatistics',
      method: BaseServiceMethod.GET,
      query: idChannel ? { id: idChannel } : {},
      headers: this.getHeader(token),
      returnResponseServer: true
    });
  }

  public getInfoChannel(token: string, idChannel?: string) {
    const param: any = {
      part: 'snippet%2CcontentDetails%2Cstatistics',
      mine: true
    };
    if (idChannel) {
      param.id = idChannel;
    }
    return this.fetch({
      path: 'channels',
      method: BaseServiceMethod.GET,
      query: param,
      headers: this.getHeader(token),
      returnResponseServer: true
    });
  }

  public getIconYoutube(page: any): Promise<string> {
    return new Promise((resolve) => {
      return resolve ('')
      // this.getInfoChannel(page.token_auth).then((data: any) => {
      //   if (!data || !data.items || !data.items.length || !data.items[0].snippet || !data.items[0].snippet.thumbnails || !data.items[0].snippet.thumbnails.default) {
      //     return resolve('');
      //   }
      //   return resolve(data.items[0].snippet.thumbnails.default.url);
      // }).catch(error => {
      //   if (error['status'] === 401) {
      //     this.refreshTokenYoutube(page.id, page.token_refresh_auth).then(data => {
      //       const newPage = data['page'];
      //       newPage.token_auth = newPage['access_token'];
      //       this.getIconYoutube(newPage);
      //       return resolve('');
      //     });
      //   }
      //   return resolve('');
      // });
    });
  }

  public refreshTokenYoutube(page_id: string, refresh_token: string) {
    const body = { refresh_token };
    return this.fetch({
      path: `merchants/${Constants.MerchantId}/socials/${Constants.SOCIAL.TYPE.YOUTUBE}/pages/${page_id}/refresh-token`,
      method: BaseServiceMethod.GET,
      body: body,
      headers: this.getHeader(),
      returnResponseServer: true
    });
  }
}

export default new YoutubeService();