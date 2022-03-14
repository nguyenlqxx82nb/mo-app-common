import { BaseService, BaseServiceMethod } from "../BaseService";
import { HOST_CHAT_TOOL } from "../HostPathApi";

class ChattoolService extends BaseService {

    getApiPath = async () => {
        return HOST_CHAT_TOOL();
    }

    public getStatusOnline(visitor_ids: Array<string>) {
        return this.fetch({
            path: `visitor/check_online`,
            method: BaseServiceMethod.POST,
            body: { visitor_ids },
            returnResponseServer: true
        });
    }

    public getBrowsingInformation(domain_id: string, visitor_id: string) {
        return this.fetch({
            path: `visitor/page/detail/${domain_id}/${visitor_id}`,
            method: BaseServiceMethod.GET,
            returnResponseServer: true
        });
    }

}

export default new ChattoolService();