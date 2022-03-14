import StorageKeys from '../../Storage/keys';
import Constants from '../../Common/Constants';
import { HOST_SOCIAL, DOMAIN_GET_SOURCES_STATIC, HOST_CHAT_TOOL, PATH_SOCIAL } from '../HostPathApi';
import AdminService from "../Admin/AdminService";
import JwtHelper from './../../Common/JwtHelper';
import FacebookService from './FacebookService';
import YoutubeService from './YoutubeService';
import Utils from './../../Common/Utils';
import { BaseService, BaseServiceMethod } from '../BaseService';
import CdpService from "../Cdp/CdpService";
import moment from 'moment';
import { uid } from 'uid';
import ChattoolService from "./ChattoolService";
import { DeviceEventEmitter } from 'react-native';
const cloneDeep = require('clone-deep');

class SocialService extends BaseService {
  public profilesBySocialIds: Map<string, any>;
  public defaultAvatar: string = '';
  private allStaffs: Array<any>;
  private timeReAssignBySocials: Map<number, number>;

  constructor() {
    super();
    this.profilesBySocialIds = new Map();
    this.allStaffs = [];
    Utils.initGlobalData();
    this.getDefaultAvatar();
  }

  getDefaultAvatar = async () => {
    if (this.defaultAvatar) {
      return this.defaultAvatar;
    }
    const domainGetSourcesStatic = await DOMAIN_GET_SOURCES_STATIC();
    this.defaultAvatar = `${domainGetSourcesStatic}avatar.png`;
    return this.defaultAvatar;
  }

  getApiPath = async () => {
    return await HOST_SOCIAL();
  }

  public async assignTagActivityStatus(status: number, object: any) {
    const body = {
      assign_tag_activity_status: status,
      object_type: object.object_type,
      object_assignee_id: object.object_assignee_id,
      object_id: object.object_id,
      page_social_id: object.page_social_id,
      social_type: object.social_type,
      page_id: object.page_id
    };
    return await this.fetch({
      path: `assign/update-assign-tag-activity-status`,
      method: BaseServiceMethod.POST,
      body: body,
      returnResponseServer: true,
    });
  }

  public async getStaffSetting(key: string) {
    return await this.fetch({
      path: 'staff-setting/get',
      method: BaseServiceMethod.GET,
      query: { setting_key: key },
      returnResponseServer: true,
    });
  }

  public async setStaffSetting(key: string, status) {
    const body = {
      page_social_id: null,
      social_type: null,
      setting_key: key,
      setting_status: status
    };
    return await this.fetch({
      path: `staff-setting/save`,
      method: BaseServiceMethod.POST,
      body: body,
      returnResponseServer: true,
    });
  }

  public async getTemplatesInPage(own_type: string, page_social_ids: string) {
    return await this.fetch({
      path: 'template-reply/list-for-page',
      method: BaseServiceMethod.GET,
      query: {
        own_type: own_type,
        page_social_ids: page_social_ids
      },
      returnResponseServer: true,
    });
  }

  public async sendMessageConversations(social_type: number, page_id: string, conversation_id: string, token: string, body: any) {
    // truyền token nếu là facebook, không truyền nếu là các MXH khác
    if (token) {
      return await this.fetch({
        path: `merchants/${JwtHelper.decodeToken().merchantID}/socials/${social_type}/pages/${page_id}/conversations/${conversation_id}/message?access_token=${token}`,
        method: BaseServiceMethod.POST,
        body: body,
        returnResponseServer: true,
      });
    }
    return await this.fetch({
      path: `socials/${social_type}/pages/${page_id}/conversations/${conversation_id}/message`,
      method: BaseServiceMethod.POST,
      body: body,
      returnResponseServer: true,
    });
  }

  public async sendComment(social_type: number, page_id: string, topic_social_id: string, parent_id: string, comment_level: number, commentData) {
    return this.fetch({
      path: `merchants/${JwtHelper.decodeToken().merchantID}/socials/${social_type}/pages/${page_id}/topics/${topic_social_id}/comment/${comment_level}/${parent_id}`,
      method: BaseServiceMethod.POST,
      body: commentData,
      returnResponseServer: true,
    });
  }

  public async getSocialTag(filter: any) {
    return await this.fetch({
      path: 'social-tag',
      method: BaseServiceMethod.GET,
      query: filter,
      returnResponseServer: true,
    });
  }

  public async getConfigPages(social_type: number = -1) {
    Utils.initGlobalData();
    return await this.fetch({
      path: 'configs/related-info',
      method: BaseServiceMethod.GET,
      query: { social_type: social_type },
      returnResponseServer: true,
      keyCache: StorageKeys.CacheConfigsRelatedInfoSocial
    });
  }

  public async getAllSocialPage(): Promise<any> {
    return await this.fetch({
      path: 'pages/in-assign', //`merchants/${Constants.MerchantId}/socials/pages`,
      method: BaseServiceMethod.GET,
      returnResponseServer: true,
      keyCache: StorageKeys.CacheListAllPageSocial
    });
  }

  public async getInfoBySocialIds(social_type: number, page_id: string, user_social_ids: string) {
    return await this.fetch({
      path: `social/${social_type}/page/${page_id}/users`,
      method: BaseServiceMethod.GET,
      query: { user_social_ids },
      returnResponseServer: true,
    });
  }

  public async checkSummaryAllSocial(path: string, body?: any) {
    if (path !== 'unreply') {
      return await this.fetch({
        path: `social/check-${path}`,
        method: BaseServiceMethod.GET,
        returnResponseServer: true,
      });
    }
    return await this.fetch({
      path: `social/check-${path}`,
      method: BaseServiceMethod.POST,
      body: body,
      returnResponseServer: true,
    });
  }

  public async changeHoldAssignmentStatus(body: { page_social_id: string, social_type: number, object_id: string, object_type: number, is_hold: boolean }) {
    return await this.fetch({
      path: `assign/hold-assignment`,
      method: BaseServiceMethod.POST,
      body: body,
      returnResponseServer: true,
    });
  }

  public async changePinOrderAssignment(body: { page_social_id: string, social_type: number, object_id: string, object_type: number, is_pin_order: boolean }) {
    return await this.fetch({
      path: `assign/pin-assignment`,
      method: BaseServiceMethod.POST,
      body: body,
      returnResponseServer: true,
    });
  }

  public async getAssignments(social_type: number, filter: any) {
    return await this.fetch({
      path: `socials/${social_type}/assignment/list`,
      method: BaseServiceMethod.GET,
      query: filter,
      returnResponseServer: true
    });
  }

  public async searchMessageOfConversations(social_type: number, page_id: string, conversation_id: string, params: { search?: string, search_index?: number, per_page: number, after_token?: string, before_token?: string }) {
    const query = cloneDeep(params);
    return await this.fetch({
      path: `merchants/${Constants.MerchantId}/socials/${social_type}/pages/${page_id}/conversations/${conversation_id}/messages/search`,
      method: BaseServiceMethod.GET,
      query: query,
      returnResponseServer: true,
    });
  }

  public async getConversationByUserSocialId(social_type: number, page_id: string, user_social_id: string) {
    return await this.fetch({
      path: `merchants/${Constants.MerchantId}/socials/${social_type}/pages/${page_id}/conversations/actions/search`,
      method: BaseServiceMethod.GET,
      query: { user_social_id },
      returnResponseServer: true,
    });
  }

  public async getMessageOfConversations(social_type: number, page_social_id: string, socialId: string, query: any) {
    return await this.fetch({
      path: `message/socials/${social_type}/pages/${page_social_id}/conversations/${socialId}/list`,
      method: BaseServiceMethod.GET,
      query: query,
      returnResponseServer: true,
    });
  }

  public async assignTags(assign_type: number, assign_id: string, tags: Array<string>, page_id: string) {
    const body = {
      page_id: page_id,
      tag: tags,
      target: {
        id: assign_id,
        type: assign_type,
      }
    };
    return await this.fetch({
      path: `merchants/${Constants.MerchantId}/tags/actions/assign`,
      method: BaseServiceMethod.POST,
      body: body,
      returnResponseServer: true,
    });
  }

  public async resolveConversation(social_type: number, page_id: any, conversation_id: any, body?: any) {
    return await this.fetch({
      path: `merchants/${Constants.MerchantId}/socials/${social_type}/pages/${page_id}/conversations/${conversation_id}/actions/resolve`,
      method: BaseServiceMethod.POST,
      body: body || {},
      returnResponseServer: true,
    });
  }

  public async resolveComment(social_type: number, page_id: string, comment_id: string, body?: any) {
    return await this.fetch({
      path: `merchants/${Constants.MerchantId}/socials/${social_type}/pages/${page_id}/comments/${comment_id}/actions/resolve`,
      method: BaseServiceMethod.POST,
      body: body || {},
      returnResponseServer: true,
    });
  }

  public async resolveRating(social_type: number, page_id: string, rating_id: string, body?: any) {
    return await this.fetch({
      path: `merchants/${Constants.MerchantId}/socials/${social_type}/pages/${page_id}/ratings/${rating_id}/resolve`,
      method: BaseServiceMethod.POST,
      body: body || {},
      returnResponseServer: true,
    });
  }

  public async readAssignment(body: { page_social_id: string; social_type: number; object_id: string; object_type: number }) {
    return await this.fetch({
      path: `assign/mark-read`,
      method: BaseServiceMethod.POST,
      body: body,
      returnResponseServer: true,
    });
  }


  public async assign(social_type: number, page_id: string, body) {
    return await this.fetch({
      path: `merchants/${Constants.MerchantId}/socials/${social_type}/pages/${page_id}/assignment/actions/assign`,
      method: BaseServiceMethod.POST,
      body: body,
      returnResponseServer: true,
    });
  }

  public async syncTopic(social_type: number, page_id: string, topics: { topic_social_id: string, message: string }[]) {
    const body = { topics };
    return await this.fetch({
      path: `merchants/${Constants.MerchantId}/socials/${social_type}/pages/${page_id}/topics`,
      method: BaseServiceMethod.POST,
      body: body,
      returnResponseServer: true,
    });
  }

  public async changeClassifyCommentTopic(social_type: number, page_id: string, topic_id: string, comment_id: string, classify: number, external_data?: any) {
    const body = {
      classify: classify,
      // external_data: external_data ? external_data : {}
    };
    return await this.postUrlEndCode(`merchants/${Constants.MerchantId}/socials/${social_type}/pages/${page_id}/topics/${topic_id}/comments/${comment_id}/actions/classify`, body);
  }

  public async getAssignById(social_type: number, page_id: string, assignId: string, assignType: number, assignee?: string) {
    const query: any = {
      assign_type: assignType,
      object_id: assignId
    };
    assignee && (query.assignee = assignee);
    return await this.fetch({
      path: `merchants/${Constants.MerchantId}/socials/${social_type}/pages/${page_id}/assignment`,
      method: BaseServiceMethod.GET,
      query: query,
      returnResponseServer: true,
    });
  }

  public async syncComment(social_type: number, topic_id: string, comments: any) {
    return await this.fetch({
      path: `merchants/${Constants.MerchantId}/socials/${social_type}/topics/${topic_id}/comments`,
      method: BaseServiceMethod.POST,
      body: { comments },
      returnResponseServer: true,
    });
  }

  public async getHistoryAssign(social_type: number, page_id: string, per_page: number, object_type: number, object_social_id: string, before_token: string) {
    const query = {
      object_type: object_type,
      object_social_id: object_social_id,
      per_page: per_page,
      before_token: before_token
    };
    return await this.fetch({
      path: `social/${social_type}/page/${page_id}/history-assign`,
      method: BaseServiceMethod.GET,
      query: query,
      returnResponseServer: true,
    });
  }

  // ====================== Viết các hàm ko gọi thuần API , sau sẽ refactor ======================
  getAssignmentSocialId(item: any) {
    switch (item.type) {
      case Constants.SOCIAL.FEATURE_CODE.MESSAGE:
        return item.social ? item.social.id : '';
      case Constants.SOCIAL.FEATURE_CODE.COMMENT:
        return item.comment_social_id;
      case Constants.SOCIAL.FEATURE_CODE.RATE:
        return item.social ? item.social.id : '';
    }
  }

  public getAvatarPage(page, isErrorImage) {
    return new Promise(resolve => {
      this.getInfoSocial('avatar-page', isErrorImage, page).then(async link => {
        if (!link) {
          // console.log('link error ', link, ' page=',page);
          link = await this.getErrorDefaultAvatar(page);
          // console.log('link 2 ', link, ' page=',page);
        }  
        page.icon = link;
        page.avatar = link;
        return resolve('');
      });
    });
  }

  public async getInfoSocial(type: string, errorImg: boolean, data: any, callback?: Function): Promise<any> {
    return new Promise(async (resolve) => {
      switch (type) {
        case 'avatar-page':
          const pathGetSourcesStatic = await DOMAIN_GET_SOURCES_STATIC();
          if (errorImg === true) {
            const defaultAvatar = await this.getErrorDefaultAvatar(data);
            return resolve(defaultAvatar);
          }

          if (data.social_type === Constants.SOCIAL.TYPE.ZALO) {
            return resolve(`${pathGetSourcesStatic}icon-zalo.png`);
          }

          if (data.social_type === Constants.SOCIAL.TYPE.LINE) {
            return resolve(`${pathGetSourcesStatic}icon-line.png`);
          }

          if (data.social_type === Constants.SOCIAL.TYPE.MOBILE_APP) {
            const userInfo = JwtHelper.decodeToken();
            return resolve(userInfo.avatar);
          }

          if (!data || !data.social_type || !data.page_social_id) {
            return resolve('');
          }

          if (data.social_type === Constants.SOCIAL.TYPE.FACEBOOK) {
            FacebookService.getInfoPageOrUserById(data.page_social_id, data.token_auth).then(res => {
              callback && callback(res);
            }).catch(err => {
              data.specific_token_expire = true;
              callback && callback(err);
            });
            return resolve(`https://graph.facebook.com/${data.page_social_id}/picture`);
          }

          if (data.social_type === Constants.SOCIAL.TYPE.INSTAGRAM) {
            const link = await FacebookService.getIconInstagram(data);
            data.specific_loadImgError = false;
            if (!link) {
              data.specific_loadImgError = true;
              data.specific_token_expire = true;
            }
            return resolve(link);
          }

          if (data.social_type === Constants.SOCIAL.TYPE.YOUTUBE) {
            const link = await YoutubeService.getIconYoutube(data);
            data.specific_loadImgError = false;
            if (!link) {
              data.specific_loadImgError = true;
              data.specific_token_expire = true;
            }
            return resolve(link);
          }

          if (data.social_type === Constants.SOCIAL.TYPE.WEB_LIVE_CHAT) {
            const hostChattool = await HOST_CHAT_TOOL();
            return resolve(`${hostChattool}domain/image/${data.page_social_id}`);
          }
          break;
        case 'name-by-social-type':
          return resolve(this.getNameBySocialType(data.social_type));
        case 'iconfont-social':
          return resolve(this.getIconfontBySocialType(data.social_type))
      }

    });

  }

  private getErrorDefaultAvatar = async (page: any) => {
    const pathGetSourcesStatic = await DOMAIN_GET_SOURCES_STATIC();
    if (page.social_type === Constants.SOCIAL.TYPE.FACEBOOK) {
      return `${pathGetSourcesStatic}icon-facebook.svg`;
    }

    if (page.social_type === Constants.SOCIAL.TYPE.INSTAGRAM) {
      return `${pathGetSourcesStatic}icon-instagram.png`;
    }

    if (page.social_type === Constants.SOCIAL.TYPE.ZALO) {
      return `${pathGetSourcesStatic}icon-zalo.png`;
    }

    if (page.social_type === Constants.SOCIAL.TYPE.YOUTUBE) {
      return `${pathGetSourcesStatic}icon-youtube.png`;
    }

    if (page.social_type === Constants.SOCIAL.TYPE.LINE) {
      return `${pathGetSourcesStatic}icon-line.png`;
    }

    if (page.social_type === Constants.SOCIAL.TYPE.WEB_LIVE_CHAT) {
      return `${pathGetSourcesStatic}icon-web-live-chat.svg`;
    }
    return '';
  }

  public async getSummary(social_type: number, page_id: string, metrics: string, assignee: string = '', is_admin?: number, reassign_time?: number, before_revoke_time?: number, page_social_ids?: string) {
    const query: any = {
      metrics: metrics,
      assignee: `${assignee}${is_admin ? '' : `&reassign_time=${reassign_time}&before_revoke_time=${before_revoke_time}`}`
    };
    if (!page_social_ids) {
      return await this.fetch({
        path: `merchants/${Constants.MerchantId}/socials/${social_type}/pages/${page_id}/summary`,
        method: BaseServiceMethod.GET,
        query: query,
        returnResponseServer: true,
      });
    }
    query.page_social_ids = page_social_ids;
    return await this.fetch({
      path: `socials/${social_type}/summary`,
      method: BaseServiceMethod.GET,
      query: query,
      returnResponseServer: true,
    });
  }


  private getNameBySocialType(socialType: number) {
    switch (socialType) {
      case Constants.SOCIAL.TYPE.FACEBOOK:
        return 'Facebook';
      case Constants.SOCIAL.TYPE.INSTAGRAM:
        return 'Instagram';
      case Constants.SOCIAL.TYPE.ZALO:
        return 'Zalo';
      case Constants.SOCIAL.TYPE.YOUTUBE:
        return 'Youtube';
      case Constants.SOCIAL.TYPE.LINE:
        return 'Line';
      case Constants.SOCIAL.TYPE.MOBILE_APP:
        return 'Mobile App';
      case Constants.SOCIAL.TYPE.WEB_LIVE_CHAT:
        return 'Web live chat';
      default:
        return '';
    }
  }

  private getIconfontBySocialType(socialType: number) {
    switch (socialType) {
      case Constants.SOCIAL.TYPE.FACEBOOK:
        return 'mo-icn-FB ';
      case Constants.SOCIAL.TYPE.INSTAGRAM:
        return 'mo-icn-Insta ';
      case Constants.SOCIAL.TYPE.ZALO:
        return 'mo-icn-Zalo ';
      case Constants.SOCIAL.TYPE.YOUTUBE:
        return 'mo-icn-Youtube ';
      case Constants.SOCIAL.TYPE.LINE:
        return 'mo-icn-Line ';
      case Constants.SOCIAL.TYPE.MOBILE_APP:
        return 'mo-icn-Apps-Push ';
      case Constants.SOCIAL.TYPE.WEB_LIVE_CHAT:
        return 'mo-icn-Live-web ';
      default:
        return '';
    }
  }

  getProfileBySocialIds(socialType, assignments: Array<any>, onSetProfileCompleted: any) {
    try {
      if (!assignments || !assignments.length) {
        return;
      }
      const assignmentNeedGetProfile = [];
      assignments.forEach(userAssign => {
        if (this.setProfileOfUserAssign(socialType, userAssign, onSetProfileCompleted)) {
          return;
        }
        assignmentNeedGetProfile.push(userAssign);
      });
      if (!assignmentNeedGetProfile.length) {
        return;
      }
      const ids = assignmentNeedGetProfile.map(item => item.last_message.from.id);
      CdpService.getProfileBySocialIds(ids).then(result => {
        if (!result || !result.data || !result.data.length) {
          return;
        }
        const profiles = result.data;
        for (const profile of profiles) {
          const socials = [];
          if (profile.social_user && profile.social_user.length) {
            socials.push(...profile.social_user);
          }

          if (profile.social_name && profile.social_name.length) {
            socials.push(...profile.social_name);
          }
          if (!socials.length) {
            continue;
          }
          for (const social of socials) {
            this.profilesBySocialIds.set(social.social_id, profile);
          }
        }

        for (const userAssign of assignmentNeedGetProfile) {
          this.setProfileOfUserAssign(socialType, userAssign, onSetProfileCompleted);
        }
      });
    } catch (error) {
      console.log(error);
    }

  }

  private setProfileOfUserAssign(socialType: number, assignment: any, onSetProfileCompleted: any): boolean {
    if (!assignment) {
      return false;
    }
    const idSocial = assignment.last_message.from.id;
    const profile = this.profilesBySocialIds.get(idSocial);
    if (!profile) {
      return false;
    }
    assignment.specific_profile = {
      name: profile.name,
      phone: '',
      originCustomer: profile
    };
    // if (socialType !== Constants.SOCIAL.TYPE.WEB_LIVE_CHAT) {
    //   return true;
    // }
    if (!profile.social_name || !profile.social_name.length) {
      return true;
    }
    const socialObj = profile.social_name.find(item => item.social_id === idSocial);
    if (!socialObj || !socialObj.name) {
      socialType === Constants.SOCIAL.TYPE.WEB_LIVE_CHAT && (assignment.specific_username = profile.social_name[0].name || profile.name || '&mdash;');
      onSetProfileCompleted(assignment);
      return true;
    }
    socialType === Constants.SOCIAL.TYPE.WEB_LIVE_CHAT && (assignment.specific_username = socialObj.name);
    onSetProfileCompleted(assignment);
    return true;
  }

  getTimeReAssignBySocials() {
    return this.timeReAssignBySocials;
  }

  getAllConfigPages(pages: Array<any>) {
    return new Promise((resolve, reject) => {
      this.getConfigPages(-1).then(result => {
        if (!result || !result.data) {
          return reject();
        }
        if (!this.timeReAssignBySocials) {
          this.timeReAssignBySocials = new Map();
        }
        const configs = result.data;
        for (const item of configs) {
          const page = pages.find(pageEl => pageEl.page_social_id === item.page_social_id);
          if (!page) {
            continue;
          }
          page.specific_config = item;
          page.staffs = [];
          page.staffsOfPage = [];
          const currentStaff: any = JwtHelper.decodeToken();
          currentStaff.isAdmin = 0;
          currentStaff.username = currentStaff.accessName;
          if (!item.user_role || !item.user_team || item.user_role === 'manager') {
            currentStaff.isAdmin = 1;
          }
          page.currentStaff = currentStaff;
          if (!item.team) {
            continue;
          }
          const staffsOfPage = [];
          let teams = item.team;
          this.getMemberOfTeams(teams, staffsOfPage, currentStaff);
          this.buildStaff({ data: staffsOfPage }, page.staffsOfPage, { ...currentStaff, isAdmin: 1 }, true);
          if (item.user_team) {
            teams = item.team.filter(team => team.id === item.user_team);
          }
          const reAssignTime = item.reassign_time;
          const timeConvert = reAssignTime.time * Constants.SOCIAL.MULTIPLIER_OF_UNIT[reAssignTime.unit] - Constants.SOCIAL.RANGE_TIME_REVOKE_BEFORE;
          this.timeReAssignBySocials.set(item.social_type, timeConvert);
          if (item.user_role === 'staff' && reAssignTime) {
            page.reAssignTime = timeConvert;
          }
          const staffs = [];
          this.getMemberOfTeams(teams, staffs, currentStaff);
          this.buildStaff({ data: staffs }, page.staffs, currentStaff, false);
        }
        return resolve('');
      }, _ => {
        return reject();
      });
    });
  }

  private getMemberOfTeams(teams, staffs, currentStaff) {
    teams.forEach(team => {
      if (!team.member || !team.member.length) {
        return;
      }

      team.member.forEach(member => {
        const staffOfMemberId = this.allStaffs.find(staff => staff.id === member.id);
        if (staffOfMemberId) {
          staffs.push(staffOfMemberId);
        }
      });
    });
    if (!staffs.find(staff => staff.id === currentStaff.id)) {
      staffs.push(currentStaff);
    }
  }

  convertTags = (tagSources: any[]): any[] => {
    if (!tagSources || !tagSources.length) {
      return [];
    }
    const convertedTags = tagSources.map(tagSource => {
      return {
        id: tagSource.id,
        name: tagSource.value || tagSource.tag,
        bgColor: tagSource.properties ? tagSource.properties.background_color : '',
        color: tagSource.properties ? tagSource.properties.foreground_color : '',
      };
    });
    return convertedTags;
  }

  async getAllStaffs() {
    if (this.allStaffs.length) {
      return this.allStaffs;
    }
    const result = await AdminService.getListAccountActive({ page: -1 });
    const currentStaff: any = JwtHelper.decodeToken();
    currentStaff.isAdmin = 1;
    this.buildStaff(result, this.allStaffs, currentStaff, true);
    return this.allStaffs;
  }

  private buildStaff(result, staffs, currentStaff, ignoreItemAllStaff: boolean) {
    if (!result || !result.data || !result.data.length) {
      return;
    }
    const data = result.data;

    const staffFound = data.find(staff => staff.id === currentStaff.id);
    if (currentStaff.isAdmin !== 1 && staffFound) {
      delete staffFound.avatar;
      staffFound.label = this.buildLabelStaff(staffFound);
      staffs.push(staffFound);
      return;
    }

    data.forEach(staff => {
      delete staff.avatar;
      staff.label = this.buildLabelStaff(staff);
      staffs.push(staff);
    });
    staffs.sort((staffA, staffB) => {
      return staffA.label.localeCompare(staffB.label);
    });

    if (staffs.length > 1 && !ignoreItemAllStaff) {
      const staffAll = {
        id: `${data.map(staff => staff.id).join(',')},`,
        label: 'Tất cả',
        username: 'Tất cả',
        fullname: 'Tất cả',
        isAll: true
      };
      staffs.splice(0, 0, staffAll);
    }
  }

  private buildLabelStaff(staff: any) {
    if (!staff.fullname) {
      return (staff.username);
    }
    return `${staff.fullname} (${staff.username})`;
  }

  // =================================PROCESSING FUNCTION OF MESSAGE=====================================
  public buildAssignmentFromSocket(body: any, type: number): IAssignmentItem { // return IAssignmentItem trong project mo-app-social/src/api/AssignmentItem.tsx
    const newAssignmentment: IAssignmentItem = {
      assignees: body.assign,
      classify: body.classify,
      comment_social_id: body.comment_social_id,
      conversation_social_id: body.conversation_social_id,
      rating_social_id: body.rating_social_id,
      resolved_user: body.resolved_user,
      created_user: body.created_user || (body.data && body.data.created_user),
      id: body.comment_id ? body.comment_id : (body.rating_id ? body.rating_id : (body.conversation_id ? body.conversation_id : (body.data && body.data.conversation ? body.data.conversation.id : ''))),
      is_reply: body.is_reply !== undefined ? body.is_reply : (body.data && body.data.conversation && body.data.conversation.is_reply ? body.data.conversation.is_reply : 0),
      last_message: {
        created_time: body.created_time ? body.created_time : (body.data && body.data.conversation && body.data.conversation.created_date ? body.data.conversation.created_date : moment().format()),
        from: {
          id: body.user_social_id ? body.user_social_id : (body.data && body.data.conversation && body.data.conversation.user_social_id ? body.data.conversation.user_social_id : ''),
          name: '',
        },
        message: body.content ? body.content : (body.data && body.data.conversation && body.data.conversation.message ? body.data.conversation.message : ' '),
        specific_message_type: body.message_type ? body.message_type : (body.data && body.data.conversation && body.data.conversation.message_type ? body.data.conversation.message_type : ' ')
      },
      lastest_user_interacted_time: body.lastest_user_interacted_time,
      resolved_time: body.resolved_time,
      social: {
        id: type === Constants.SOCIAL.FEATURE_CODE.MESSAGE ? (body.conversation_social_id ? body.conversation_social_id : body.data.conversation.conversation_social_id) :
          (type === Constants.SOCIAL.FEATURE_CODE.COMMENT ? body.topic_social_id : (type === Constants.SOCIAL.FEATURE_CODE.RATE) ? body.rating_social_id : ''),
        title: body.topic_title || body.content,
        parent_id: body.parent_id || '',
        parent_title: body.parent_title || '',
      },
      state: body.state,
      status: body.status,
      topic_id: body.topic_id,
      topic_social_id: body.topic_social_id,
      topic_title: body.topic_title,
      title: body.title,
      specific_status_message: 0,
      type: type,
      unread_number: body.unread_number || 0,
      updated_time: body.updated_time,
      unreply_time: body.unreply_time ? body.unreply_time : (body.data && body.data.conversation && body.data.conversation.unreply_time ? body.data.conversation.unreply_time : moment()),
      page_social_id: body.page_social_id,
      comment_image: body.comment_image ? body.comment_image : 0,
      specific_message_social_id: body.message_social_id || body.data && body.data.message_social_id,
      specific_detect_message_id: body.detect_message_id,
      specific_attachments: body.attachments || [],
      specific_send_time: body.send_time,
      seen_time: body.seen_time,
      specific_tag_ids: body.tag_ids,
      is_display_hold: body.is_display_hold,
      is_hold: body.is_hold || false,
      pin_order: body.pin_order,
      social_type: body.social_type,
      token_name: body.token_name,
      socket_type: body.socket_type,
      page_id: body.id,
      specific_notification_id: body.specific_notification_id,
      specific_notification_is_read: body.specific_notification_is_read,
      specific_message_error: body.message_error,
      specific_message_quote: body.message_quote
    };

    switch (body.socket_type) {
      case 'RESOLVED_CONVERSATION_SOCKET':
        newAssignmentment.last_message.from.id = body.data.assign.assignee_id;
        newAssignmentment.resolved_time = body.resolved_time;
        newAssignmentment.resolved_user = body.resolved_user;
    }

    switch (body.send_status) {
      case 'DELIVERED':
        newAssignmentment.specific_status_message = Constants.SOCIAL.STATE_SEND_DATA_TO_SERVER.MESSAGE_DELIVERED;
        newAssignmentment.last_message.created_time = moment.unix(body.send_time);
        newAssignmentment.specific_send_time = body.send_time;
        newAssignmentment.is_reply = 1;
        break;
      case 'SEND_ERROR':
        newAssignmentment.specific_status_message = Constants.SOCIAL.STATE_SEND_DATA_TO_SERVER.MESSAGE_FAIL;
        break;
      case 'USER_DISALLOW_APP':
        newAssignmentment.specific_status_message = Constants.SOCIAL.STATE_SEND_DATA_TO_SERVER.MESSAGE_USER_DISALLOW_APP;
        break;
      case 'SEND_FACEBOOK_ERROR':
        newAssignmentment.specific_status_message = Constants.SOCIAL.STATE_SEND_DATA_TO_SERVER.MESSAGE_SEND_FACEBOOK_FAIL;
        break;
      case 'SEND_ZALO_ERROR':
        newAssignmentment.specific_status_message = Constants.SOCIAL.STATE_SEND_DATA_TO_SERVER.MESSAGE_SEND_ZALO_FAIL;
        break;
    }
    return newAssignmentment;
  }

  public getDefaultUserAssign(social: IAssignmentItemSocial, from: IAssignmentItemLastMessageFrom): IAssignmentItem {
    return {
      assignees: [
        {
          assignee_id: '',
          conversation_id: '',
          created_time: moment().format(),
          created_user: null,
        }
      ],
      id: '',
      last_message: { from: from },
      social: social,
      tags: [],
      type: 2,
      specific_conversations: [],
      lastest_user_interacted_time: moment().format(),
      specific_username: '—',
      specific_avatar: ''
    };
  }

  public buildMessageFromConversation(assignment: IAssignmentItem): IUsersAssignConversationItem {
    return {
      attachments: assignment.specific_attachments,
      created_time: moment(assignment.updated_time).unix(),
      created_user: assignment.created_user,
      resolved_user: assignment.resolved_user,
      from_id: assignment.is_reply === 1 ? assignment.page_social_id : assignment.last_message.from.id,
      id: assignment.last_message.from.id,
      page_social_id: assignment.page_social_id,
      message: assignment.last_message.message,
      message_social_id: assignment.status === 2 ? uid(32) : assignment.specific_message_social_id,
      specific_detect_message_id: assignment.specific_detect_message_id,
      message_type: assignment.resolved_time ? 3 : (assignment.specific_attachments && assignment.specific_attachments.length && assignment.last_message) ? assignment.last_message.specific_message_type : 1,
      // dùng resolved_time thay cho status để phân biệt tin nhắn hoàn tất do khi nhân viên chủ động gửi tin nhắn sau khi hoàn tất hội thoại socket đang trả về status = 2
      updated_time: moment(assignment.updated_time).unix(),
      resolved_time: moment(assignment.resolved_time).unix(),
      send_time: assignment.specific_send_time,
      specific_status_message: assignment.specific_status_message,
      message_error: assignment.specific_message_error,
      message_quote: assignment.specific_message_quote
    };

  }

  createNewReplyMessageOfConversation(page, data, detect_id, fileUpload) {
    const staff = JwtHelper.decodeToken();
    const newMessage: IUsersAssignConversationItem = {
      attachments: fileUpload ? [fileUpload] : [],
      created_time: moment().unix(),
      created_user: staff.id,
      from_id: page.page_social_id,
      id: '',
      merchant_id: staff.merchantID,
      message: data,
      message_social_id: '',
      message_type: fileUpload ? 2 : 1,
      page_social_id: page.page_social_id,
      social_type: page.social_type,
      specific_status_message: Constants.SOCIAL.STATE_SEND_DATA_TO_SERVER.MESSAGE_SENDING,
      specific_detect_message_id: detect_id
    };
    return newMessage;
  }

  public processMessageConversation(currentList: Array<IUsersAssignConversationItem>, newList: Array<IUsersAssignConversationItem>, page?: IPageAssign) {
    if (!newList) {
      return;
    }
    const listMerge = [...newList];
    if (currentList && currentList.length) {
      listMerge.push(currentList[0]);
    }
    let index = 0;
    for (const currentItem of listMerge) {
      currentItem.specific_message_for_page = currentItem.from_id === currentItem.page_social_id;
      currentItem.specific_show_avatar = true;
      const preItem = listMerge[index - 1];

      if (currentItem.specific_message_for_page) {
        currentItem.specific_show_staff_reply = false;
        currentItem.specific_sucking_point = false;
        if (!preItem || preItem.from_id !== preItem.page_social_id || currentItem.created_user !== preItem.created_user) {
          currentItem.specific_show_staff_reply = true;
          currentItem.specific_sucking_point = true;
        }
        index++;
        continue;
      } else {
        this.convertsocialAttachment(currentItem, page);
      }

      if (index === listMerge.length - 1) {
        index++;
        continue;
      }
      const nextItem = listMerge[index + 1];
      if (nextItem.message_type === 3) {
        index++;
        continue;
      }
      if (!nextItem || nextItem.from_id !== nextItem.page_social_id) {
        currentItem.specific_show_avatar = false;
      }
      index++;
    }
  }

  public mergeAssignment(newAssignment: IAssignmentItem, originAssignment: IAssignmentItem, itemSelected: IAssignmentItem) {
    if (originAssignment.updated_time && ((newAssignment.is_reply && !newAssignment.specific_send_time && (newAssignment.specific_send_time - moment(originAssignment.updated_time).unix() < 0)) ||
      (!newAssignment.is_reply && newAssignment.updated_time && moment(newAssignment.updated_time).unix() - moment(originAssignment.updated_time).unix() < 0))) {
      console.log('-------------start--------------');
      console.log(newAssignment);
      console.log(originAssignment);
      console.log('-------------end--------------');
      return;
    }
    originAssignment.unread_number = newAssignment.unread_number;
    if (!originAssignment.specific_page_container && newAssignment.specific_page_container) {
      originAssignment.specific_page_container = newAssignment.specific_page_container;
    }
    if (newAssignment.tags) {
      originAssignment.tags = newAssignment.tags;
    }
    if (!newAssignment.is_reply) {
      originAssignment.specific_detect_message_id = '';
      originAssignment.specific_status_message = newAssignment.specific_status_message;
    }
    if (newAssignment.specific_status_message < 0) {
      if (originAssignment.specific_detect_message_id && originAssignment.specific_detect_message_id === newAssignment.specific_detect_message_id) {
        originAssignment.specific_status_message = newAssignment.specific_status_message;
        originAssignment.specific_detect_message_id = '';
      }
      this.pushMessageOfConversation(newAssignment, originAssignment);
      return;
    }
    if (!newAssignment.specific_detect_message_id || !originAssignment.specific_detect_message_id
      || (newAssignment.specific_detect_message_id === originAssignment.specific_detect_message_id)) {
      originAssignment.last_message = newAssignment.last_message;
      originAssignment.specific_status_message = newAssignment.specific_status_message;
      if (originAssignment.specific_status_message > 0) {
        originAssignment.specific_detect_message_id = '';
      }
    }
    originAssignment.is_display_hold = newAssignment.is_display_hold;
    originAssignment.is_hold = newAssignment.is_hold;
    originAssignment.pin_order = newAssignment.pin_order;
    originAssignment.status = newAssignment.status;
    originAssignment.is_reply = newAssignment.is_reply;
    originAssignment.resolved_user = newAssignment.resolved_user || originAssignment.resolved_user;
    originAssignment.resolved_time = newAssignment.resolved_time || originAssignment.resolved_time;
    if (newAssignment.seen_time) {
      originAssignment.seen_time = newAssignment.seen_time;
    }
    if (!originAssignment.is_reply && (!originAssignment.seen_time || moment(originAssignment.seen_time).unix() - moment(newAssignment.last_message.created_time).unix() < 0)) {
      originAssignment.seen_time = newAssignment.last_message.created_time;
    }
    if (newAssignment.updated_time) {
      originAssignment.updated_time = newAssignment.updated_time;
    }
    if (newAssignment.specific_send_time) {
      originAssignment.specific_send_time = newAssignment.specific_send_time;
    }
    if (newAssignment.unreply_time) {
      originAssignment.unreply_time = newAssignment.unreply_time;
    }
    if (newAssignment.updated_time && !newAssignment.is_reply) {
      originAssignment.lastest_user_interacted_time = newAssignment.updated_time;
    }
    if (newAssignment.lastest_user_interacted_time) {
      originAssignment.lastest_user_interacted_time = newAssignment.lastest_user_interacted_time;
    }
    if (this.mergeAssigneesAndHasBreak(originAssignment, newAssignment)) {
      return;
    }
    if (!originAssignment.specific_conversations || !originAssignment.specific_conversations.length) {
      return;
    }
    const isViewItemSelected = itemSelected && itemSelected.id === originAssignment.id;
    if (originAssignment.specific_key_search) {
      if (isViewItemSelected) {
        originAssignment.specific_show_icon_new_message = true;
      }
      return;
    }
    this.pushMessageOfConversation(newAssignment, originAssignment);
    if (isViewItemSelected) {
      // itemSelected.specific_event.emit({ code: 'scroll-bottom', data: originAssignment });
    }
  }

  public pushHistoryAssign(originAssign: any, assignees) {
    if (!originAssign.specific_history_assign || !originAssign.specific_history_assign.history) {
      return;
    }
    const history = {
      assign_time: moment(assignees.created_time).unix(),
      assignee_id: assignees.assignee_id,
      from_staff_id: assignees.created_user
    }
    originAssign.specific_history_assign.history.unshift(history);
    originAssign.specific_update_view_history_assign && originAssign.specific_update_view_history_assign();

  }

  private updateAssigness(originAssignment, newAssignment) {
    this.pushHistoryAssign(originAssignment, newAssignment.assignees[0]);
    originAssignment.assignees = newAssignment.assignees;
    originAssignment.specific_update_action_menu && originAssignment.specific_update_action_menu();
  }

  private mergeAssigneesAndHasBreak(originAssignment, newAssignment) {
    if (!originAssignment.assignees || !newAssignment.assignees || (!originAssignment.assignees.length && !newAssignment.assignees.length)) {
      return false;
    }
    if (!originAssignment.assignees.length && newAssignment.assignees.length) {
      this.updateAssigness(originAssignment, newAssignment);
      return true;
    }
    if (originAssignment.assignees[0].assignee_id !== newAssignment.assignees[0].assignee_id) {
      this.updateAssigness(originAssignment, newAssignment);
      return true;
    }
    if (originAssignment.assignees[0].assignee_id === newAssignment.assignees[0].assignee_id
      && originAssignment.assignees[0].assign_tag_activity_status !== newAssignment.assignees[0].assign_tag_activity_status) {
      this.updateAssigness(originAssignment, newAssignment);
      return true;
    }
    if (originAssignment.assignees[0].created_time !== newAssignment.assignees[0].created_time) {
      this.updateAssigness(originAssignment, newAssignment);
      return false;
    }
    return false;
  }

  public pushMessageOfConversation(newAssignment: IAssignmentItem, originAssignment: IAssignmentItem) {
    const conversations = originAssignment.specific_conversations;
    if (!conversations) {
      return;
    }
    const newMessage = this.buildMessageFromConversation(newAssignment);
    for (const message of conversations) {
      if ((message.message_social_id && message.message_social_id === newMessage.message_social_id) || (message.specific_detect_message_id && message.specific_detect_message_id === newMessage.specific_detect_message_id)) {
        this.mergeMessageOfConversation(message, newMessage);
        if (message.specific_detect_message_id) {
          originAssignment.specific_update_view_exist_message && originAssignment.specific_update_view_exist_message(message, 'specific_detect_message_id');
          return;
        }
        originAssignment.specific_update_view_exist_message && originAssignment.specific_update_view_exist_message(message);
        return;
      }
    }
    if (newAssignment.specific_ignore_push_conversation) {
      return;
    }
    if (newMessage.message_social_id) {
      this.processMessageConversation(originAssignment.specific_conversations, [newMessage]);
      originAssignment.specific_conversations.unshift(newMessage);
      originAssignment.specific_update_view_detail_screen && originAssignment.specific_update_view_detail_screen(originAssignment);
    }
  }

  public mergeMessageOfConversation(currentMessage, newMessage) {
    currentMessage.specific_status_message = newMessage.specific_status_message;
    if (newMessage.specific_status_message < 0) {
      return;
    }
    currentMessage.id = newMessage.id;
    currentMessage.created_time = newMessage.created_time;
    currentMessage.resolved_time = newMessage.resolved_time;
    currentMessage.resolved_user = newMessage.resolved_user;
    currentMessage.send_time = newMessage.send_time;
    currentMessage.updated_time = newMessage.updated_time;
    currentMessage.message_social_id = newMessage.message_social_id || currentMessage.message_social_id;
    currentMessage.specific_send_data = undefined;
  }

  updateStatusMessageOfConversation(assignment: IAssignmentItem, newMessage: IUsersAssignConversationItem, status: number) {
    if (assignment.specific_status_message && assignment.specific_status_message === Constants.SOCIAL.STATE_SEND_DATA_TO_SERVER.MESSAGE_SENDING) {
      assignment.specific_status_message = status;
    }
    if (assignment.specific_status_message && newMessage.specific_status_message === Constants.SOCIAL.STATE_SEND_DATA_TO_SERVER.MESSAGE_SENDING) {
      newMessage.specific_status_message = status;
    }
  }

  public isRevokeAssignment(assignment: IAssignmentItem, timeRevoke: number, ignoreRevoke: boolean) {
    if (assignment.status === 2 || assignment.is_reply || assignment.is_hold || ignoreRevoke) {
      return false;
    }
    const time = this.noResponseTime(assignment);
    if (!time) {
      return true;
    }
    const diffMoment = moment().unix() - moment(time).unix();
    if (!timeRevoke || diffMoment * 1000 < timeRevoke) {
      return false;
    }
    return true;
  }

  private noResponseTime(assign: IAssignmentItem) {
    if (!assign || !assign.assignees || !assign.assignees.length) {
      return;
    }
    return moment(assign.unreply_time).unix() - moment(assign.assignees[0].created_time).unix() >= 0 ? assign.unreply_time : assign.assignees[0].created_time;
  }
  // =================================PROCESSING FUNCTION OF NEWS=====================================
  createNewCommentByFB(commentData: any, userAssignItem: IAssignmentItem, page: IPageAssign, feature_type: any) {
    return new Promise(async resolve => {
      const comment = {
        id: commentData ? commentData.id : '',
        from: commentData ? commentData.from : { id: '', name: '' },
        message: commentData ? commentData.message : '',
        attachments: {
          data: commentData.attachment ? [commentData.attachment] : [],
        },
        created_time: commentData ? commentData.created_time : '',
        is_hidden: commentData ? commentData.is_hidden : false,
        can_hide: commentData ? commentData.can_hide : false,
        like_count: commentData ? commentData.like_count : 0,
        user_likes: commentData ? commentData.user_likes : false,
        specific_social_type: page ? page.social_type : 0,
        specific_mobio_comment_id: userAssignItem ? userAssignItem.id : '',
        specific_is_conversation: userAssignItem ? userAssignItem.is_conversation : 0,
        specific_assignees: userAssignItem ? userAssignItem.assignees : [],
        specific_classify: userAssignItem ? userAssignItem.classify : -1,
        specific_comment_image: userAssignItem ? userAssignItem.comment_image : 0,
        specific_created_time: userAssignItem ? userAssignItem.specific_send_time : '',
        specific_created_user: userAssignItem ? userAssignItem.created_user : '',
        specific_is_reply: userAssignItem ? userAssignItem.is_reply : 0,
        specific_username: userAssignItem ? userAssignItem.specific_username : '',
        specific_avatar: commentData && commentData.from && page ? await this.setAvatarComment(commentData.from.id, page) : userAssignItem ? await this.setAvatarComment(userAssignItem.created_user, page) : '',
        specific_is_page: page && commentData.from ? commentData.from.id === page.page_social_id : false,
        specific_buttons: DEFAULT_ACTION_SOCIAL(page.social_type, feature_type),
        specific_feature: feature_type,
        specific_ignore_labels: 'label_send_message'
      }
      return resolve(comment);
    })
  }

  updateSyncComment = async (commentData: any, synData: any) => {
    if (!commentData || !synData) {
      return;
    }
    commentData.specific_mobio_comment_id = synData.id;
    commentData.specific_assignees = synData.assignees;
    commentData.specific_classify = synData.classify;
    commentData.specific_comment_image = synData.comment_image;
    commentData.specific_created_time = synData.created_time;
    commentData.specific_created_user = synData.created_user;
    if (!commentData.specific_avatar) {
      commentData.specific_avatar = await this.setAvatarComment(synData.created_user);
    }
    if (synData.is_conversation) {
      commentData.specific_is_conversation = synData.is_conversation;
    }
    if (synData.is_message) {
      commentData.specific_is_message = synData.is_message;
    }
    commentData.specific_is_reply = synData.is_reply;
    commentData.specific_status_sending = Constants.SOCIAL.STATE_SEND_DATA_TO_SERVER.MESSAGE_DELIVERED;
  }

  createNewCommentBySocket = async (commentData: any, userAssignItem: IAssignmentItem, page: IPageAssign, feature_type: any) => {
    return new Promise(async resolve => {
      const comment = {
        id: commentData ? commentData.id : '',
        from: commentData ? { id: '', name: commentData.username } : { id: '', name: '' },
        message: commentData ? commentData.text : '',
        attachments: {
          data: commentData.attachment ? [commentData.attachment] : [],
        },
        created_time: commentData ? commentData.timestamp : '',
        is_hidden: commentData ? commentData.hidden : false,
        can_hide: commentData ? commentData.can_hide : false,
        like_count: commentData ? commentData.like_count : 0,
        user_likes: commentData ? commentData.user_likes : false,
        specific_social_type: page ? page.social_type : 0,
        specific_mobio_comment_id: userAssignItem ? userAssignItem.id : '',
        // specific_is_conversation: userAssignItem ? userAssignItem.is_conversation : 0,
        specific_assignees: userAssignItem ? userAssignItem.assignees : [],
        specific_classify: userAssignItem ? userAssignItem.classify : -1,
        specific_comment_image: userAssignItem ? userAssignItem.comment_image : 0,
        specific_created_time: userAssignItem ? userAssignItem.specific_send_time : '',
        specific_created_user: userAssignItem ? userAssignItem.created_user : '',
        specific_is_reply: userAssignItem ? userAssignItem.is_reply : 0,
        specific_username: userAssignItem ? userAssignItem.specific_username : '',
        specific_avatar: commentData && commentData.user && page ? await this.setAvatarComment(commentData.user.id, page) : userAssignItem ? await this.setAvatarComment(userAssignItem.created_user, page) : '',
        specific_is_page: page && commentData.user ? commentData.user.id === page.page_social_id : false,
        // specific_buttons: DEFAULT_ACTION_SOCIAL(page.social_type, feature_type),
        specific_feature: feature_type,
      }
      return resolve(comment);
    });
  }

  // =================================PROCESSING FUNCTION OF RATE=====================================


  // =================================PROCESSING FUNCTION COMMON=====================================

  public getFeatureTypeBySocialTypeSocket(socketType: string) {
    switch (socketType) {
      case 'REPLY_MESSAGE_SOCKET':
      case 'NEW_MESSAGE_SOCKET':
      case 'RESOLVED_CONVERSATION_SOCKET':
      case 'ASSIGN_CONVERSATION_SOCKET':
      case 'ASSIGN_TAG_CONVERSATION_SOCKET':
      case 'REVOKE_CONVERSATION_ASSIGN_SOCKET':
      case 'SEEN_CONVERSATION_SOCKET':
      case 'VISITOR_CHANGE_STATUS':
      case 'UPDATE_CONVERSATION_ASSIGN_TAG_ACTIVITY_STATUS_SOCKET':
      case 'MARK_CONVERSATION_AS_READ':
        return Constants.SOCIAL.FEATURE_CODE.MESSAGE;
      case 'REPLY_COMMENT_TOPIC_SOCKET':
      case 'POST_SUB_COMMENT_SOCKET':
      case 'RESOLVED_COMMENT_SOCKET':
      case 'ASSIGN_COMMENT_SOCKET':
      case 'CLASSIFY_COMMENT_SOCKET':
      case 'DISLIKE_COMMENT_SOCKET':
      case 'LIKE_COMMENT_SOCKET':
      case 'EDIT_COMMENT_TOPIC_SOCKET':
      case 'DELETE_COMMENT_TOPIC_SOCKET':
      case 'ASSIGN_TAG_COMMENT_SOCKET':
      case 'UNHIDE_COMMENT_TOPIC_SOCKET':
      case 'HIDE_COMMENT_TOPIC_SOCKET':
      case 'NEW_COMMENT_SOCKET':
      case 'REVOKE_COMMENT_ASSIGN_SOCKET':
      case 'UPDATE_COMMENT_ASSIGN_TAG_ACTIVITY_STATUS_SOCKET':
      case 'MARK_COMMENT_AS_READ':
        return Constants.SOCIAL.FEATURE_CODE.COMMENT;
      case 'REPLY_COMMENT_RATING_SOCKET':
      case 'RESOLVED_RATING_SOCKET':
      case 'ASSIGN_RATING_SOCKET':
      case 'CLASSIFY_RATING_SOCKET':
      case 'ASSIGN_TAG_RATING_SOCKET':
      case 'NEW_RATING_SOCKET':
      case 'REVOKE_RATING_ASSIGN_SOCKET':
      case 'UPDATE_RATING_ASSIGN_TAG_ACTIVITY_STATUS_SOCKET':
        return Constants.SOCIAL.FEATURE_CODE.RATE;
      default:
        return undefined;
    }
  }

  getInfoUserYoutube = (token_auth: string, idUser: string) => {
    return new Promise(resolve => {
      YoutubeService.getInfoUserById(token_auth, idUser).then((result: any) => {
        if (!result || !result.items || !result.items.length) {
          return resolve('');
        }
        const user = result.items.find(item => item.id === idUser);
        if (!user) {
          return resolve('');
        }
        return resolve(user.snippet && user.snippet.thumbnails && user.snippet.thumbnails.default && user.snippet.thumbnails.default.url || '');
      });
    })
  }

  getInfoUserSocial = (social_type: number, page_id: string, idUser: string) => {
    return new Promise((resolve) => {
      this.getInfoBySocialIds(social_type, page_id, idUser).then(result => {
        if (!result || !result.data || !result.data.length) {
          return resolve('');
        }
        const userInfo = result.data.find(item => item.user_social_id === idUser);
        if (!userInfo) {
          return resolve('');
        }
        return resolve(userInfo.user_social_avatar || '');
      }, () => { return resolve('') });
    })
  }

  async setAvatarComment(idUser: any, page?: IPageAssign) {
    const domain = await DOMAIN_GET_SOURCES_STATIC();
    if (!idUser || !page) {
      return `${domain}avatar.png`;
    }
    if (page && idUser === page.page_social_id) {
      return page.icon;
    }
    let avatar: any = `${domain}avatar.png`;
    const pathSocial = await PATH_SOCIAL();
    switch (page.social_type) {
      case Constants.SOCIAL.TYPE.FACEBOOK:
        avatar = `${pathSocial}/static/user/${idUser}`;
        break;
      case Constants.SOCIAL.TYPE.INSTAGRAM:
        avatar = `${pathSocial}/static/user/${idUser}`;
        break;
      case Constants.SOCIAL.TYPE.YOUTUBE:
        avatar = await this.getInfoUserYoutube(page.token_auth, idUser);
        break;
      case Constants.SOCIAL.TYPE.ZALO:
      case Constants.SOCIAL.TYPE.LINE:
        avatar = await this.getInfoUserSocial(page.social_type, page.id, idUser);
        break;
      case Constants.SOCIAL.TYPE.WEB_LIVE_CHAT:
        break;
    }
    return avatar;
  }

  public convertsocialAttachment(item: any, page: IPageAssign, field: string = 'attachments') {
    if (!page || !page.social_type || !item || !item[field] || !item[field].length) {
      return;
    }
    item[field].forEach(attachment => {
      if (!attachment) {
        return;
      }
      switch (page.social_type) {
        case Constants.SOCIAL.TYPE.LINE:
          attachment.href = `${HOST_SOCIAL()}socials/${Constants.SOCIAL.TYPE.LINE}/pages/${page.id}/display-attachment?url=${attachment.href}`;
          break;
        default:
          break;
      }
    });
  }

  private convertCountTime(assignment: any, feature_code) {
    assignment.specific_label_time_unreply = feature_code === Constants.SOCIAL.FEATURE_CODE.MESSAGE ? 'Tin nhắn mới' : 'Bình luận mới';
    let time = moment().unix() - moment(assignment.unreply_time).unix();
    time = time * 1000;
    let newTime = 0;
    if (time < 60000) {
      return;
    }
    newTime = Math.floor(time / 60000);
    if (newTime < 60) {
      assignment.specific_label_time_unreply = `chưa trả lời ${newTime} phút`;
      return;
    }
    newTime = Math.floor(newTime / 60);
    if (newTime < 24) {
      assignment.specific_label_time_unreply = `chưa trả lời ${newTime} giờ`;
      return;
    }
    newTime = Math.floor(newTime / 24);
    assignment.specific_label_time_unreply = `chưa trả lời ${newTime} ngày`;
    return;
  }

  runTimeProcess(assignment: any, feature_code, detectChanges, isChangeVisitorOnline?: boolean) {
    if (isChangeVisitorOnline) {
      detectChanges && detectChanges(assignment);
      return;
    }
    if (assignment.is_reply) {
      assignment.specific_label_time_unreply = '';
      detectChanges && detectChanges(assignment);
      return;
    }
    if (!assignment.unreply_time) {
      assignment.unreply_time = assignment.updated_time;
    }
    this.convertCountTime(assignment, feature_code);
    detectChanges && detectChanges(assignment);
  }

  chatToolGetStatusOnline = (assignment, socialId: string) => {
    return new Promise(resolve => {
      ChattoolService.getStatusOnline([socialId]).then(result => {
        if (!result || !result.data || !result.data.length) {
          return resolve(true);
        }
        const item_result = result && result.data && result.data.find(item => item.visitor_id === socialId);
        if (item_result) {
          assignment.specific_status_online = item_result.status;
        }
        return resolve(true);
      }).catch(_ => {
        assignment.specific_status_online = 'OFFLINE';
        return resolve(true);
      });
    })
  }

  buildAvatarAndName = (assignment: any) => {
    return new Promise(async resolve => {
      if (assignment.specific_username && assignment.specific_avatar && assignment.specific_username !== '—') {
        return resolve('');
      }
      assignment.specific_username = '—';
      const domainGetSourcesStatic = await DOMAIN_GET_SOURCES_STATIC();
      assignment.specific_avatar = `${domainGetSourcesStatic}avatar.png`;
      const socialId = assignment.last_message.from.id;
      const page = assignment.specific_page_container;
      const pageId = page.id;
      const pageToken = page.token_auth;
      const socialType = page.social_type;
      switch (socialType) {
        case Constants.SOCIAL.TYPE.FACEBOOK:
          const pathSocial = await PATH_SOCIAL();
          assignment.specific_avatar = `${pathSocial}/static/user/${socialId}`;
          FacebookService.getInfoPageOrUserById(socialId, pageToken).then((result: any) => {
            assignment.specific_username = result.name || '—';
            return resolve('');
          }).catch(() => {
            return resolve('');
          });
          break;
        case Constants.SOCIAL.TYPE.INSTAGRAM:
          assignment.specific_avatar = `${PATH_SOCIAL()}/static/user/${socialId}`;
          assignment.specific_username = socialId;
          return resolve('');
        case Constants.SOCIAL.TYPE.YOUTUBE:
          YoutubeService.getInfoUserById(pageToken, socialId).then((result: any) => {
            if (!result || !result.items || !result.items.length) {
              return resolve('');
            }
            const user = result.items.find(item => item.id === socialId);
            if (!user) {
              return resolve('');
            }
            assignment.specific_avatar = user.snippet && user.snippet.thumbnails && user.snippet.thumbnails.default && user.snippet.thumbnails.default.url;
            assignment.specific_username = user.snippet && user.snippet.title;
            return resolve('');
          });
          break;
        case Constants.SOCIAL.TYPE.ZALO:
        case Constants.SOCIAL.TYPE.LINE:
          this.getInfoBySocialIds(socialType, pageId, socialId).then(result => {
            if (!result || !result.data || !result.data.length) {
              return resolve('');
            }
            const userInfo = result.data.find(item => item.user_social_id === socialId);
            if (!userInfo) {
              return resolve('');
            }
            if (userInfo.user_social_avatar) {
              assignment.specific_avatar = userInfo.user_social_avatar;
            }
            if (userInfo.user_social_name) {
              assignment.specific_username = userInfo.user_social_name;
            }
            return resolve('');
          }).catch(() => {
            return resolve('');
          });
          break;
        case Constants.SOCIAL.TYPE.WEB_LIVE_CHAT:
          assignment.specific_username = socialId;
          return resolve('');
        default:
          return resolve('');

      }
    })

  }

  buildInfo = async (assignment: any, social_type, feature_code, detectChanges) => {
    if (assignment.specific_username && assignment.specific_avatar && assignment.specific_username !== '—') {
      return;
    }
    assignment.specific_username = '—';
    detectChanges && detectChanges(assignment);
    const domainGetSourcesStatic = await DOMAIN_GET_SOURCES_STATIC();
    assignment.specific_avatar = `${domainGetSourcesStatic}avatar.png`;
    const socialId = assignment.last_message.from.id;
    const page = assignment.specific_page_container;
    const pageId = page.id;
    const pageToken = page.token_auth;
    const socialType = page.social_type;
    switch (socialType) {
      case Constants.SOCIAL.TYPE.FACEBOOK:
        const pathSocial = await PATH_SOCIAL();
        assignment.specific_avatar = `${pathSocial}/static/user/${socialId}`;
        FacebookService.getInfoPageOrUserById(socialId, pageToken).then((result: any) => {
          assignment.specific_username = result.name || '—';
          detectChanges && detectChanges(assignment);
        });
        break;
      case Constants.SOCIAL.TYPE.INSTAGRAM:
        assignment.specific_avatar = `${PATH_SOCIAL()}/static/user/${socialId}`;
        assignment.specific_username = socialId;
        break;
      case Constants.SOCIAL.TYPE.YOUTUBE:
        YoutubeService.getInfoUserById(pageToken, socialId).then((result: any) => {
          if (!result || !result.items || !result.items.length) {
            return;
          }
          const user = result.items.find(item => item.id === socialId);
          if (!user) {
            return;
          }
          assignment.specific_avatar = user.snippet && user.snippet.thumbnails && user.snippet.thumbnails.default && user.snippet.thumbnails.default.url;
          assignment.specific_username = user.snippet && user.snippet.title;
          detectChanges && detectChanges(assignment);
        });
        break;
      case Constants.SOCIAL.TYPE.ZALO:
      case Constants.SOCIAL.TYPE.LINE:
        this.getInfoBySocialIds(socialType, pageId, socialId).then(result => {

          if (!result || !result.data || !result.data.length) {
            return;
          }
          const userInfo = result.data.find(item => item.user_social_id === socialId);
          if (!userInfo) {
            return;
          }
          if (userInfo.user_social_avatar) {
            assignment.specific_avatar = userInfo.user_social_avatar;
          }
          if (userInfo.user_social_name) {
            assignment.specific_username = userInfo.user_social_name;
          }
          detectChanges && detectChanges(assignment);
        });
        break;
      case Constants.SOCIAL.TYPE.WEB_LIVE_CHAT:
        assignment.specific_username = socialId;
        await this.chatToolGetStatusOnline(assignment, socialId);
        detectChanges && detectChanges(assignment);
        break;
    }
    this.runTimeProcess(assignment, feature_code, undefined);
    await this.getTagsAssignByIds(assignment, social_type, feature_code);
    this.getProfileBySocialIds(socialType, [assignment], detectChanges);
  }

  getTagsAssignByIds(assignment, social_type, feature_code) {
    return new Promise(resolve => {
      if (!assignment || !assignment.specific_page_container) {
        return resolve('');
      }
      const page = assignment.specific_page_container;
      if (assignment.tags || !assignment.specific_tag_ids || !assignment.specific_tag_ids.length) {
        return resolve('');
      }
      this.getAssignById(social_type, page.id, assignment.id, feature_code, assignment.assignees[0].assignee_id).then(result => {
        if (!result || !result.code || result.code !== '001' || !result.data || !result.data.length) {
          return resolve('');
        }
        assignment.tags = result.data[0].tags;
        return resolve('');
      });
    })
  }

  readAssignAssignment = (feature: any, assignment: IAssignmentItem, detectChanges: any) => {
    if (!feature || !assignment) {
      return;
    }
    const page = assignment.specific_page_container;
    feature.itemSelected = assignment;
    if (!assignment.unread_number || (assignment.assignees && assignment.assignees[0].assignee_id !== JwtHelper.decodeToken().id) || !page) {
      return;
    }
    this.readAssignment({ page_social_id: page.page_social_id, object_id: assignment.id, social_type: page.social_type, object_type: Constants.SOCIAL.TEXT_BY_CODE_FEATURE[feature.code] }).then(result => {
      if (!result || !result.code || result.code !== '001') {
        return;
      }
      assignment.unread_number = 0;
      feature.isReCallTabCount = true;
      DeviceEventEmitter.emit(Constants.EmitCode.SOCIAL_NOTIFICATION, { body: { socket_type: 'SPECIFIC_EVENT_FECTH_RED_BAGE_NAV_SOCIAL' } });
      let socketType = '';
      switch (feature.code) {
        case Constants.SOCIAL.FEATURE_CODE.MESSAGE:
          socketType = 'MARK_CONVERSATION_AS_READ'
          break;
          case Constants.SOCIAL.FEATURE_CODE.COMMENT:
          socketType = 'MARK_COMMENT_AS_READ'
          break;
      
        default:
          break;
      }
      const body = {
        socket_type: socketType,
        social_type: feature && feature.tabOrigin && feature.tabOrigin.social_type,
        assignment
      }
      DeviceEventEmitter.emit(Constants.EmitCode.SOCIAL_NOTIFICATION, { body });
      detectChanges && detectChanges(assignment);
    });
  }

  convertUserAssignFromSocket(body: any, type: number): IUsersAssignConversationItem {
    const newUserAssign = {
      assignees: body.assign,
      classify: body.classify,
      comment_social_id: body.comment_social_id,
      conversation_social_id: body.conversation_social_id,
      rating_social_id: body.rating_social_id,
      resolved_user: body.resolved_user,
      created_user: body.created_user || (body.data && body.data.created_user),
      id: body.comment_id ? body.comment_id : (body.rating_id ? body.rating_id : (body.conversation_id ? body.conversation_id : (body.data && body.data.conversation ? body.data.conversation.id : ''))),
      is_reply: body.is_reply !== undefined ? body.is_reply : (body.data && body.data.conversation && body.data.conversation.is_reply ? body.data.conversation.is_reply : 0),
      last_message: {
        created_time: body.created_time ? body.created_time : (body.data && body.data.conversation && body.data.conversation.created_date ? body.data.conversation.created_date : moment().format()),
        from: {
          id: body.user_social_id ? body.user_social_id : (body.data && body.data.conversation && body.data.conversation.user_social_id ? body.data.conversation.user_social_id : ''),
          name: '',
        },
        message: body.content ? body.content : (body.data && body.data.conversation && body.data.conversation.message ? body.data.conversation.message : ' '),
      },
      lastest_user_interacted_time: body.lastest_user_interacted_time || moment().format(),
      resolved_time: body.resolved_time,
      social: {
        id: type === Constants.SOCIAL.FEATURE_CODE.MESSAGE ? (body.conversation_social_id ? body.conversation_social_id : body.data.conversation.conversation_social_id) :
          (type === Constants.SOCIAL.FEATURE_CODE.COMMENT ? body.topic_social_id : (type === Constants.SOCIAL.FEATURE_CODE.RATE ? body.rating_social_id : '')),
        title: body.topic_title || body.content,
        parent_id: body.parent_id || '',
        parent_title: body.parent_title || '',
      },
      state: body.state,
      status: body.status,
      topic_id: body.topic_id,
      topic_social_id: body.topic_social_id,
      topic_title: body.topic_title,
      title: body.title,
      specific_status_message: 0,
      type: type,
      unread_number: body.unread_number || 0,
      updated_time: body.updated_time,
      unreply_time: body.unreply_time ? body.unreply_time : (body.data && body.data.conversation && body.data.conversation.unreply_time ? body.data.conversation.unreply_time : moment()),
      page_social_id: body.page_social_id,
      comment_image: body.comment_image ? body.comment_image : 0,
      specific_message_social_id: body.message_social_id || body.data && body.data.message_social_id,
      specific_detect_message_id: body.detect_message_id,
      specific_attachments: body.attachments || [],
      specific_send_time: body.send_time,
      seen_time: body.seen_time,
      specific_tag_ids: body.tag_ids,
      is_display_hold: body.is_display_hold,
      is_hold: body.is_hold || false,
      pin_order: body.pin_order,
      social_type: body.social_type,
      token_name: body.token_name,
      socket_type: body.socket_type,
      page_id: body.id,
      specific_notification_id: body.specific_notification_id,
      specific_notification_is_read: body.specific_notification_is_read,
      specific_message_error: body.message_error,
      specific_message_quote: body.message_quote
    };

    switch (body.socket_type) {
      case 'RESOLVED_CONVERSATION_SOCKET':
        newUserAssign.last_message.from.id = body.data.assign.assignee_id;
        newUserAssign.resolved_time = body.resolved_time;
        newUserAssign.resolved_user = body.resolved_user;
    }

    switch (body.send_status) {
      case 'DELIVERED':
        newUserAssign.specific_status_message = Constants.SOCIAL.STATE_SEND_DATA_TO_SERVER.MESSAGE_DELIVERED;
        newUserAssign.last_message.created_time = moment.unix(body.send_time);
        newUserAssign.specific_send_time = body.send_time;
        newUserAssign.is_reply = 1;
        break;
      case 'SEND_ERROR':
        newUserAssign.specific_status_message = Constants.SOCIAL.STATE_SEND_DATA_TO_SERVER.MESSAGE_FAIL;
        break;
      case 'USER_DISALLOW_APP':
        newUserAssign.specific_status_message = Constants.SOCIAL.STATE_SEND_DATA_TO_SERVER.MESSAGE_USER_DISALLOW_APP;
        break;
      case 'SEND_FACEBOOK_ERROR':
        newUserAssign.specific_status_message = Constants.SOCIAL.STATE_SEND_DATA_TO_SERVER.MESSAGE_FAIL;
        break;
      case 'SEND_ZALO_ERROR':
        newUserAssign.specific_status_message = Constants.SOCIAL.STATE_SEND_DATA_TO_SERVER.MESSAGE_SEND_ZALO_FAIL;
        break;
    }
    return newUserAssign;
  }

  validAssignmentWithFilter(assignment: IAssignmentItem, filter: any, ignoreCheck: boolean = false) {
    if (ignoreCheck) {
      return false;
    }
    if (!assignment || !filter) {
      return false;
    }
    const assignee = assignment.assignees && assignment.assignees[0];
    if (!assignee) {
      return false;
    }

    if (filter.page_social_ids && filter.page_social_ids.length && !filter.page_social_ids.includes(assignment.page_social_id)) {
      return false;
    }

    if (filter.assignee && filter.assignee.search(assignee.assignee_id) === -1) {
      return false;
    }
    if (`${filter.status}` !== `${assignment.status}`) {
      return false;
    }
    if (filter.reply_status && filter.reply_status.length && !filter.reply_status.includes(assignment.is_reply)) {
      return false;
    }
    if (filter.classify && filter.classify.length && !filter.classify.includes(assignment.classify)) {
      return false;
    }
    if (filter.user_social_ids && filter.user_social_ids !== assignment.last_message.from.id) {
      return false;
    }
    if (filter.message && !assignment.specific_is_assignment_correct_content_search &&
      (assignment.type !== 4 && (!assignment.last_message || !assignment.last_message.message || Utils.removeSign(assignment.last_message.message).search(Utils.removeSign(filter.message)) === -1)) ||
      (assignment.type === 4 && (!assignment.social || !assignment.social.title || Utils.removeSign(assignment.social.title).search(Utils.removeSign(filter.message)) === -1))
    ) {
      return false;
    }
    const page = assignment.specific_page_container;
    const reAssignTime = page.reAssignTime;
    const ignoreRevoke = page.currentStaff && page.currentStaff.isAdmin === 1;
    if (this.isRevokeAssignment(assignment, reAssignTime, ignoreRevoke)) {
      return false;
    }
    if (!filter.tags || !filter.tags.length) {
      return true;
    }
    if (assignment.tags) {
      assignment.specific_tag_ids = assignment.tags.map(tag => tag.id);
    }
    if (!assignment.specific_tag_ids || !assignment.specific_tag_ids.length) {
      return false;
    }
    for (const tag of filter.tags) {
      if (assignment.specific_tag_ids.find(id => id === tag.id)) {
        return true;
      }
    }
    return false;
  }

}

export default new SocialService();

export const DEFAULT_ACTION_SOCIAL: Function = (social_type: number, feature_type: number): Array<any> => {
  let actions = [];
  const actionsSocial = [
    {
      key: 'like',
      label: 'Thích',
      classValues: {
        'false': 'like',
        'true': 'liked',
      },
      fieldBind: 'user_likes',
      disable: false,
      typeSocial: [Constants.SOCIAL.TYPE.FACEBOOK],
      typeFeature: [Constants.SOCIAL.FEATURE_CODE.COMMENT, Constants.SOCIAL.FEATURE_CODE.TOPIC]
      // ECodeFeatureAssign.RATE  -- FB chua ho tro api like Rating

    },
    {
      key: 'send_message',
      label: 'Gửi tin nhắn',
      classValues: {
        '1': 'send_personal_message',
        '0': 'send_personal_message',
      },
      fieldBind: 'specific_is_conversation',
      disable: false,
      typeSocial: [1],
      typeFeature: [Constants.SOCIAL.FEATURE_CODE.COMMENT, Constants.SOCIAL.FEATURE_CODE.TOPIC, Constants.SOCIAL.FEATURE_CODE.RATE]
    },
    // {
    //   key: 'like',
    //   label: 'Thích',
    //   classValues: {
    //     'false': 'like',
    //     'true': 'liked',
    //   },
    //   fieldBind: 'user_likes',
    //   disable: false,
    //   typeSocial: [Constants.SOCIAL.TYPE.INSTAGRAM],
    //   typeFeature: [Constants.SOCIAL.FEATURE_CODE.COMMENT, Constants.SOCIAL.FEATURE_CODE.TOPIC]
    //   // ECodeFeatureAssign.RATE  -- FB chua ho tro api like Rating
    // }
  ];
  actions = actionsSocial.filter(item => item.typeSocial.includes(social_type) && item.typeFeature.includes(feature_type));
  return actions;
};

export const GET_DEFAULT_FILTER: Function = (assignType: number): any => {
  const userInfo = JwtHelper.decodeToken();
  const filter = {
    assign_type: assignType,
    assignee: userInfo.id,
    classify: [],
    status: '1',
    tags: [],
    reply_status: [],
    sort_field: assignType === Constants.SOCIAL.FEATURE_CODE.RATE ? '' : 'unreply_time',
    sort_type: Constants.SORT.ASC,
    user_social_ids: '',
    message: '',
    page_social_ids: []
  };
  return filter;
};

export interface IAssignmentItem {
  assignees?: Array<IAssignmentItemAssignee>;
  classify?: number;
  id?: string;
  social_type?: number;// giá trị của socket trả về
  token_name?: string;// giá trị của socket trả về
  socket_type?: string;// giá trị của socket trả về
  page_id?: string;// giá trị của socket trả về
  comment_social_id?: string;
  conversation_social_id?: string;
  rating_social_id?: string;
  topic?: IAssignmentItemTopic;
  topic_id?: string;
  created_user?: string;
  is_reply?: number;
  last_message?: IAssignmentItemLastMessage;
  lastest_user_interacted_time?: string;
  message_time?: string;
  resolved_time?: string;
  seen_time?: string;
  social?: IAssignmentItemSocial;
  status?: number;
  tags?: Array<IAssignmentItemTag>;
  type?: number;
  unread_number?: number;
  unreply_time?: string;
  updated_time?: string;
  resolved_user_name?: string;
  resolved_user?: string;
  state?: any;
  page_social_id?: string;
  comment_image?: number;
  rating_number?: number;
  mobio_topic_id?: string;
  is_hold?: boolean;
  is_display_hold?: boolean;
  is_conversation?: number; // sử dụng để check khách hàng đã từng gửi tin nhắn
  pin_order?: number;
  topic_social_id?: string;
  topic_title?: string;
  title?: string;

  specific_tag_ids?: Array<string>; // sử dụng lưu trữ tag phân loại công việc nhận từ socket new hoặc reply
  specific_avatar?: string;
  specific_username?: string;
  specific_key_search?: string;
  specific_conversations?: Array<any>;
  specific_post_or_feed?: IPostOrFeed;
  specific_ratings?: IRating;
  specific_total_search?: number;
  specific_index_search?: number;
  specific_after_token_search?: string;
  specific_before_token_search?: string;
  specific_loading_content?: boolean;
  specific_show_button_scroll_bottom?: boolean;
  specific_show_icon_new_message?: boolean;
  specific_query?: IAssignmentItemQuery;
  specific_focus?: boolean;
  specific_content_typing?: any;
  specific_attachments_typing?: Array<any>;
  specific_is_auto_revoke_before?: boolean;
  specific_message_social_id?: string; // sử dụng để lưu khi nhận socket
  specific_detect_message_id?: string; // id fake message nhân viên gửi
  specific_attachments?: Array<any>; // sử dụng để lưu khi nhận socket
  specific_send_time?: number; // biến được nhận từ socket
  specific_status_message?: number; // Lưu trạng thái tin nhắn cuối cùng
  specific_profile?: {
    name: string;
    phone: string;
    originCustomer: any;
  };
  specific_is_assignment_correct_content_search?: boolean;
  specific_resolving?: boolean;
  specific_message_tag?: string;  // Lưu loại message tag khi gửi
  specific_browsing_information?: IBrowsingInformation; // Thông tin duyệt web dùng cho weblivechat
  specific_notification_id?: string;// id của tin socket
  specific_notification_is_read?: number;// trạng thái đọc socket
  specific_page_container?: IPageAssign;// page mà user_assign thuộc
  specific_message_error?: string; // khi bot chat tu dong khong gui attachment reply
  specific_message_quote?: IMessageQuote;
  specific_status_online?: string;
  specific_label_time_unreply?: string;
  specific_assign_staff_name?: string;
  specific_function_get_staff_name?: Function;
  specific_status_send_data_to_server_of_assignment_item?: IAssignmentItemStatusSendDataToServer;
  specific_ignore_push_conversation?: boolean; // đánh dấu không push message vào mảng (sử dụng cho gắn tag phân loại công việc không build message)
  specific_remove_detail_screen?: () => void;
  specific_update_view_detail_screen?: (item: any) => void;
  specific_update_view_exist_message?: (conversationItem: any, fieldKey?: string, fieldKeyChange?: string) => void;
}

export interface IPageAssign {
  id: string;
  name: string;
  page_social_id: string;
  social_type: number;
  token_auth: string;
  refresh_token: string;
  token_refresh_auth?: string;
  specific_checked?: boolean; // biến sử dụng riêng lưu trạng thánh đã chọn page; giá trị sẽ được set trong pipe moLibGetDataViewSocialPipe
  specific_loadImgError?: boolean; // biến sử dụng riêng cho trường hợp load avatar page lỗi;  giá trị sẽ được set trong pipe moLibGetDataViewSocialPipe
  specific_token_expire?: boolean; // giá trị sẽ được set trong pipe moLibGetDataViewSocialPipe

  template: Array<ITemplateQuickReply>;  // danh sách mẫu câu trả lời nhanh
  specific_message_tag: Array<IMessageTag>;
  specific_config?: any; // config lấy từ api
  staffs: Array<IStaff>; // staff theo quyền user hay manager, nếu manager sẽ thấy tất cả nhân viên trong team => dành cho bộ lọc
  staffsOfPage: Array<IStaff>; // danh sách tất cả nhân viên của page => danh cho tạo deal
  currentStaff: any;
  reAssignTime?: number;
  icon?: string;
}

export interface IMessageSocialEmpty {
  tag: string;
  default: string;
}

export interface IMessageConnect {
  success: string;
  error: string;
}

export interface IMessageTag {
  message_tag?: string; // loại message tag
  name?: string; // Phuc vu cho dropdown
  restricted_words?: Array<string>;
  descriptions?: Array<IDescription>;
  message: string; // nội dung tags
  // messageTagPattern: Array<IValidPattern>;
  messageTagPattern: Array<any>;
}

export interface IDescription {
  key?: string;
  value?: string;
  type?: string;
  content?: Array<string>;
}

export interface ITemplateQuickReply {
  id?: string;
  value?: string;
  personalize?: Array<IPersonalize>;
}
export interface IPersonalize {
  key?: string;
  value?: string;
}

export interface IStaff {
  avatar?: any;
  create_time?: string;
  created_account?: string;
  email?: string;
  fullname?: string;
  id?: string;
  is_admin?: number;
  merchant_id?: string;
  phone_number?: string;
  status?: number;
  update_time?: string;
  username?: string;
}



export interface IAssignmentItemEvent {
  code: string; // scroll-bottom;
  data: any; // dữ liệu cần gửi;
}
export interface IBrowsingInformation {
  general_information?: {
    visit_page_number?: number;
    total_message?: number;
    time_on_web?: number;
    time_on_current_web?: number;
    start_time_access?: number;
    come_from?: string;
    location?: string;
  };
  device_detail?: {
    browser?: string;
    ip_address?: string;
    name_device?: string;
    os?: string;
  };
  web_browsing_info?: {
    time_on_current_page?: number;
    time_on_current_web?: number;
    current_page_title?: string;
    current_page?: string;
  };
}

export interface IAssignmentItemQuery {
  per_page: number;
  after_token?: string;
  before_token?: string;
  search?: string;
  search_index?: number;
}

export interface IAssignmentItemSocial {
  id?: string;
  title?: string;
  parent_title?: string;
  parent_id?: string;
}

export interface IAssignmentItemTopic {
  name?: string;
}


export interface IAssignmentItemAssignee {
  assignee_id?: string;
  conversation_id?: string;
  created_time?: string;
  created_user?: any;
  id?: string;
  note?: any;
  status?: number;
}

export interface IAssignmentItemLastMessage {
  created_time?: any;
  from?: IAssignmentItemLastMessageFrom;
  message?: string;
  specific_message_type?: number;
}

export interface IAssignmentItemLastMessageFrom {
  id?: string;
  name?: string;
}

export interface IAssignmentItemTag {
  id?: string;
  properties?: IAssignmentItemTagProperties;
  value?: string;
}

export interface IAssignmentItemTagProperties {
  background_color?: string;
  foreground_color?: string;
}

export interface IUsersAssignConversationItem {
  attachments?: any;
  created_time?: number;
  created_user?: string;
  resolved_user?: string;
  from_id?: string;
  id?: string;
  merchant_id?: string;
  message?: string;
  message_error?: string;
  message_quote?: IMessageQuote;
  message_social_id?: string;
  message_type?: number;
  page_social_id?: string;
  send_time?: any;
  social_type?: number;
  state?: number;
  thread_id?: string;
  to_id?: string;
  is_match?: number;
  updated_time?: number;
  resolved_time?: number;
  specific_show_avatar?: boolean;
  specific_message_for_page?: boolean;
  specific_show_staff_reply?: boolean;
  specific_sucking_point?: boolean;
  specific_status_message?: number; // trạng thái gửi tin nhắn của nhân viên
  specific_detect_message_id?: string; // id fake message nhân viên gửi
  specific_send_data?: any; // lưu thông tin của tin nhắn trước khi gửi
}

export interface IMessageQuote {
  attachments?: Array<any>;
  created_time?: number;
  created_user?: string;
  from_id?: string;
  merchant_id?: string;
  message?: string;
  message_social_id?: string;
  message_type?: number;
  page_social_id?: string;
  send_time?: number;
  social_type?: number;
  state?: number;
  thread_id?: string;
  to_id?: string;
  updated_time?: number;
  message_quote_type?: string; // 'REPLIED_PRIVATE'
}

export interface IPostOrFeed {
  id?: string;
  from?: IPostOrFeedFrom;
  message?: string;
  title?: string;
  attachments?: IPostOrFeedAttachment;
  likes?: IPostOrFeedLikes;
  created_time?: string;
  full_picture?: string;
  status_type?: string;
  comment_image?: number;
  social?: {
    id?: string;
    parent_id?: string;
    parent_title?: string;
    title?: string;
  };

  specific_video_image_youtube?: string;
  specific_video_youtube?: IPostOrFeedAttachmentData;
  specific_video_views?: number;
  specific_description?: string;
  specific_display_description?: boolean;

  specific_created_user?: string;
  specific_comments?: Array<any>;
}

export interface IRating {
  id?: string;
  reviewer?: IRatingReviewer;

  review_text?: string;
  publish_time?: string;
  recommendation_type?: string;
  rating_number?: number;

  assignees?: Array<IAssignmentItemAssignee>;
  status?: number;
  resolved_time?: any;
  resolved_user?: string;
  created_time?: any;
  tags?: Array<any>;

  rating_social_id?: string;

  specific_classify?: number;
  specific_is_message?: number;
  specific_created_user?: string;
  specific_created_time?: string;
  comments?: {
    data?: Array<any>,
    specific_temp_data?: Array<any>;
    paging?: {
      cursors?: {
        after?: string;
        before?: string;
      }
      next?: string;
      previous?: string;
    }
  };
  specific_is_page?: boolean;
  specific_avatar?: string;
  specific_username?: string;
  specific_content_typing?: string;
  specific_attachments_typing?: any;
}

export interface IRatingReviewer {
  name?: string;
  id?: string;
}

export interface IPostOrFeedFrom {
  name?: string;
  id?: string;
}

export interface IPostOrFeedAttachment {
  data?: Array<IPostOrFeedAttachmentData>;
}

export interface IPostOrFeedAttachmentData {
  description?: string;
  media?: IPostOrFeedAttachmentDataMedia;
  subattachments?: IPostOrFeedAttachment;
  target?: IPostOrFeedAttachmentDataTarget;
  title?: string;
  type?: string;
  url?: string;
}

export interface IPostOrFeedAttachmentDataMedia {
  image?: IPostOrFeedAttachmentDataMediaImage;
  source?: any;
}

export interface IPostOrFeedAttachmentDataMediaImage {
  height?: number;
  src?: string;
  width?: number;
}

export interface IPostOrFeedAttachmentDataTarget {
  id?: string;
  url?: string;
}

export interface IPostOrFeedLikes {
  data?: Array<any>;
  summary?: IPostOrFeedLikesSummary;
}

export interface IPostOrFeedLikesSummary {
  total_count?: number;
  can_like?: boolean;
  has_liked?: boolean;
}

export interface IAssignmentItemTag {
  id?: string;
  properties?: IAssignmentItemProperties;
  value?: string;
}

export interface IAssignmentItemProperties {
  background_color?: string;
  foreground_color?: string;
}

export interface IAssignmentItemStatusSendDataToServer {
  icon: string,
  message: string,
  type: string,
}
