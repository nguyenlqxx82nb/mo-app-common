import Utils from "../../Common/Utils";
import { BaseService, BaseServiceMethod } from "../BaseService";
import { HOST_STRINGEE } from '../HostPathApi';
import Storage from '../../Storage';
import StringeeKeys from './StringeeKeys';

class StringeeService extends BaseService {
  access_token: string;
  access_agent_token: string;
  agentUserId: string;

	getApiPath = async () => {
		return await HOST_STRINGEE();
  }
  
  private initKey = async () => {
    this.access_token = await Storage.getItem(StringeeKeys.KEY_ACCESS_TOKEN);
    this.access_agent_token = await Storage.getItem(StringeeKeys.KEY_AGENT_ACCESS_TOKEN);
    this.agentUserId = await Storage.getItem(StringeeKeys.KEY_AGENT_EXTENSION);
  }

	public async getCurrentAgent() {
    await Utils.initGlobalData();
    if (!this.agentUserId) {
      await this.initKey();
    }
    // const currentAgent = await Storage.getItem(StringeeKeys.KEY_CURRENT_AGENT);
    // if (currentAgent) {
    //   return currentAgent;
    // }
    const agents = await this.getAgentList();
    const agent = agents.find(item => item.stringee_user_id === this.agentUserId);
    // Storage.setItem(StringeeKeys.KEY_CURRENT_AGENT, agent);

    return agent;
  }
  
  public getAgentList = async (): Promise<any[]> => {
    if (!this.access_agent_token) {
      await this.initKey();
    }
    const headers = {
      'Content-Type': 'application/json',
      'X-STRINGEE-AUTH': this.access_agent_token
    }
    const response = await this.fetch({
      path: `agent`,
      headers: headers,
			method: BaseServiceMethod.GET
    });
    return (response.result && response.result.data && response.result.data.agents) || [];
  }

  public updateAgent = async (status: string) => {
    if (!this.access_agent_token) {
        this.initKey();
    }
    const headers = {
      'Content-Type': 'application/json',
      'X-STRINGEE-AUTH': this.access_agent_token
    }
    const body = {
        manual_status: status,
    };
    const agent = await this.getCurrentAgent();
    if (!agent) {
      return false;
    }
    const response = await this.fetch({
      path: `agent/${agent.id}`,
      headers: headers,
      body: body,
			method: BaseServiceMethod.PUT
    });
    // console.log('update agent ', response);
    if (response.result && response.result.r === 0) {
      // Storage.removeItem(StringeeKeys.KEY_CURRENT_AGENT);
      return true;
    }
    return false;
  }

  public getLogs = async (query?: {page: 1, limit: 5}) => {
    const headers = {
      'Content-Type': 'application/json',
      'X-STRINGEE-AUTH': this.access_agent_token
    }
    const response = await this.fetch({
      hostApiPath: 'https://api.stringee.com/v1/call/log',
      path: '',
      headers: headers,
      query: query,
      method: BaseServiceMethod.GET,
      returnResponseServer: true
    });

    return response;
  }

}

export default new StringeeService();