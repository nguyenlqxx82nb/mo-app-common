import AsyncStorage from '@react-native-community/async-storage';
import { AllHtmlEntities } from 'html-entities';
import Constants from './Constants';
import Storage from '../Storage';
import StorageKeys from '../Storage/keys';
import JwtHelper from './JwtHelper';
import SocialIcon from '../Images/social';
import AppConfig from '../AppConfig';

const _ = require('lodash');

export default class Utils {

  /**
   * lay mo ta
   * @param description 
   * @param limit 
   */
  static getDescription(description: string, limit: number) {
    if (!limit) {
      limit = 50;
    }
    if (!description) {
      return '';
    }
    let desc = description.replace('<p>', '');
    desc = _.truncate(desc, { length: limit, separator: ' ' });

    return AllHtmlEntities.decode(desc);
  }

  // static getLinkVideo(content) {
  //     const regExp = /^.*((www.youtube.com\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\??v?=?))([^#&\?\/\ ]*).*/;
  //     let embedId = '';
  //     let youtubeUrl = '';

  //     URI.withinString(content, url => {
  //         const match = url.match(regExp);
  //         if (match && match[7].length === 11) {
  //             embedId = match[7];
  //             youtubeUrl = `www.youtube.com/embed/${embedId}`;
  //         }
  //     });
  //     return youtubeUrl;
  // }

  static async getFontSizePostDetail() {
    const fontSize = await AsyncStorage.getItem('@setting_fontSize');
    if (fontSize) {
      return parseInt(fontSize);
    }
    return Constants.fontText.size;
  }

  /**
   * lay avatar
   * @param avatar 
   */
  static getAvatar = (avatar: string) => {
    if (avatar) {
      const fix_avatar = Utils.fixAvatar(avatar);
      return { uri: fix_avatar };
    }
    return {};
  }

  /**
   * fix https chuoi avatar
   * @param avatar 
   */
  static fixAvatar = (avatar: string = '') => {
    if (avatar && avatar.replace) {
      return avatar.replace('http://', 'https://');
    }
    return avatar;
  }

  /**
   * Dinh dang so theo phan nghin
   * @param number 
   */
  static formatThousand = (number: number) => {
    if (number) {
      if (number < 1000) {
        return `${number}`;
      }
      const ret = String(number).replace(/(.)(?=(\d{3})+$)/g, '$1.');
      return ret;
    }
    return '0';
  };

  /**
   * Lam tron mot so sau dau phay
   * @param number 
   */
  static roundOneNumber = (number: number) => {
    return Math.round(number * 10) / 10;
  };

  /**
   * Them so 0 truoc
   * @param quantity 
   */
  static formatQuantity = (quantity: number) => {
    if (quantity < 10 && quantity > 0) {
      return `0${quantity}`;
    }
    return `${quantity}`;
  };

  /**
   * Xoa html tag
   * @param {*} desc
   */
  static removeHtmlTag(desc: string) {
    if (desc) {
      var desc = desc.trim().replace(/(<([^>]+)>)/gi, '');
      return AllHtmlEntities.decode(desc);
    }
    return '';
  }

  // static getVideoIDFromUrl(url: string) {
  //     const result = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  //     const videoIdWithParams = result[2];

  //     if (videoIdWithParams !== undefined) {
  //         const cleanVideoId = videoIdWithParams.split(/[^0-9a-z_-]/i)[0];
  //         return cleanVideoId;
  //     }

  //     return null;
  // }

  /**
   * In hoa chu cai dau
   * @param str
   */
  static capitalize(str: string) {
    if (!str || typeof str !== 'string' || str.trim() === '') {
      return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static convertCitationVietnameseUnsigned(words: string) {
    if (!words || !words.trim()) {
      return '';
    }

    const wordsSplit = words.split(' ');
    const citationConvert = new Array();
    wordsSplit.forEach(word => {
      citationConvert.push(this.removeSign(word));
    });

    return citationConvert.join(' ');
  }

  /**
   * Xoa dau tu tieng viet
   * @param str 
   */
  static removeSign(str: string) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    return str;
  }

  static exportInterface(name: string, object: any): void {
    const fields = Object.keys(object);
    let interfaceExport = `export interface I${name}{`;
    fields.forEach(item => {
      switch (typeof object[item]) {
        case 'string':
          interfaceExport = `${interfaceExport}\n${item}?: string;`;
          break;
        case 'number':
          interfaceExport = `${interfaceExport}\n${item}?: number;`;
          break;
        case 'boolean':
          interfaceExport = `${interfaceExport}\n${item}?: boolean;`;
          break;
        case 'function':
          interfaceExport = `${interfaceExport}\n${item}?: Function;`;
          break;
        case 'object':
          if (object[item] === null || object[item] === undefined) {
            interfaceExport = `${interfaceExport}\n${item}?: any;`;
            break;
          }

          if (Array.isArray(object[item])) {
            interfaceExport = `${interfaceExport}\n${item}?: Array<any>;`;
            break;
          }
          interfaceExport = `${interfaceExport}\n${item}?: object;`;
          break;
        default:
          interfaceExport = `${interfaceExport}\n${item}?: any;`;
      }
    });
    interfaceExport = `${interfaceExport}\n}`;
    console.log(interfaceExport);
  }

  static initGlobalData = async (token: string = undefined) => {
    if (Constants.MerchantId) {
      return;
    }
    // fix text size
		Constants.TextSize = 2;
    if (token) {
      Constants.AuthToken = token;
      await Storage.setItem(StorageKeys.AuthToken, token);
    } else {
      Constants.AuthToken = await Storage.getItem(StorageKeys.AuthToken);
    }

    Constants.FingerStatus = await Storage.getItem(StorageKeys.FINGER_STATUS);
    Constants.Username = await Storage.getItem(StorageKeys.USER_NAME);
    Constants.Password = await Storage.getItem(StorageKeys.PASSWORD);

    if (Constants.AuthToken) {
      const userInfo = JwtHelper.decodeToken();

      if (userInfo) {
        Constants.MerchantId = userInfo.merchantID;
        Constants.StaffId = userInfo.id;
        Constants.UserId = userInfo.id;
      }
    }
  }

  static validateEmail = (email: string) => {
    const re = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
  }

  /**
   * validate phone number
   * @param phone 
   * @returns 
   */
  static validatePhone = (phone: string) => {
    if (!phone) {
      return false;
    }
    let newPhone = phone.replace('+84', '0');
    const code = newPhone.substring(0,2);
    if (code === '84') {
      newPhone = '0' + newPhone.substring(2);
    }
    if (!/^[0-9\b]+$/.test(newPhone)) {
      return false;
    }
    const valid = /(03|05|07|08|09|01[0|1|2|3|4|5|6|7|8|9]|02[0|1|2|3|4|5|6|7|8|9])+([0-9]{8,9})\b/.test(newPhone);
    const valid1 = /(19|18)+([0-9]{6,9})\b/.test(newPhone);
    return valid || valid1;
  }

  /**
   * validate number
   * @param  phone 
   * @returns 
   */
  static validateNumber = (phone: string) => {
    if (!phone) {
      return false;
    }
    let newPhone = phone.replace('+84', '0');
    const code = newPhone.substring(0,2);
    if (code === '84') {
      newPhone = '0' + newPhone.substring(2);
    }
    if (!/^[0-9\b]+$/.test(newPhone)) {
      return false;
    }
    return true;
  }

  static encryptPhone = (phone: string, isShow: boolean = false) => {
    let newPhone = phone.replace('+84', '0');
    if (!Utils.validatePhone(newPhone)) {
      return newPhone;
    }
    if (isShow) {
      return newPhone;
    }
    for (let i = 3; i < 7; i++) {
      newPhone = Utils.setCharAt(newPhone, i, '*');
    }
    return newPhone;
  }

  static setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
  }

  static standardizePhoneNumber(phoneNumber: string): string {
    let output = '';
    if (!phoneNumber) {
      return output;
    }
    if (phoneNumber.length === 0) {
      return output;
    }

    output = phoneNumber;
    if (output.startsWith('+')) {
      output = output.substring(1);
    }
    if (output.startsWith('0')) {
      output = '84' + output.substring(1);
    }
    return output;
  }

  static formatPhone(phone: string) {
    let output = phone.replace('+84', '0'); 
    if (!Utils.validatePhone(output)) {
      return output;
    }

    if (output.length < 8) {
      return output;
    }
    
    if (output.length === 8) {
      return Utils.splice(output, 4, 0, ' ');
    }

    return output.slice(0, 3) + ' ' + output.slice(3, 6) + ' ' + output.slice(6);
  }

  static splice(str, idx, rem, re) {
    if (!str) {
      return str;
    }
    if (str.length < idx + rem) {
      return str;
    }
    return str.slice(0, idx) + re + str.slice(idx + Math.abs(rem));
  }

  static getSocialItem(socialType: number) {
    const item = {
      icon: SocialIcon.FACEBOOK
    };
    switch (socialType) {
      case Constants.SOCIAL.TYPE.FACEBOOK:
        break;
      case Constants.SOCIAL.TYPE.INSTAGRAM:
        item.icon = SocialIcon.INSTAGRAM;
        break;
      case Constants.SOCIAL.TYPE.MOBILE_APP:
        item.icon = SocialIcon.MOBILE_APP;
        break;
      case Constants.SOCIAL.TYPE.LINE:
        item.icon = SocialIcon.LINE;
        break;
      case Constants.SOCIAL.TYPE.WEB_LIVE_CHAT:
        item.icon = SocialIcon.WEB_LIVE_CHAT;
        break;
      case Constants.SOCIAL.TYPE.YOUTUBE:
        item.icon = SocialIcon.YOUTUBE;
        break;
      case Constants.SOCIAL.TYPE.ZALO:
        item.icon = SocialIcon.ZALO;
        break;
    }
    return item;
  }

  static compareVersion(ver1: string, ver2: string) {
    if (!ver1 || !ver2) {
      return false;
    }

    return (parseFloat(ver1) >= parseFloat(ver2)) ? true : false;
  }

  /**
   * Kiem tra version co can update hay khong
   * @param os android or ios
   * @returns 
   * 0 - khong update
   * 1 - nen update
   * 2 - phai update
   */
  static checkIfNeedUpdateVersion(os: string) {

    try {
      const currVer: string = (os === 'android') ? AppConfig.AndroidVersion : AppConfig.IosVersion;
      const newVer: string = (os === 'android') ? Constants.AppConfig.version.android.pbpm : Constants.AppConfig.version.ios.pbpm;
      const minVer: string = (os === 'android') ? Constants.AppConfig.version.android.ver_min_update : Constants.AppConfig.version.ios.ver_min_update;
      const validUpdate: boolean = (os === 'android') ? Constants.AppConfig.version.android.valid_update : Constants.AppConfig.version.ios.valid_update;
      const listUpdate: string[] = (os === 'android') ? Constants.AppConfig.version.android.list_ver_update : Constants.AppConfig.version.ios.list_ver_update;

      console.log('checkIfNeedUpdateVersion os=',os, 'newVer=', newVer, ' currVer=',currVer, ' minVer= ',minVer, ' validUpdate=', validUpdate, ' listUpdate=',listUpdate);
      // khong update 
      if (!validUpdate) {
        return 0;
      }
      // neu version la moi nhat -> khong update
      if (Utils.compareVersion(currVer, newVer)) {
        return 0;
      }
      // neu be hon version min -> phai update
      if (!Utils.compareVersion(currVer, minVer)) {
        return 2;
      }
      // neu thuoc trong list update -> phai updae
      if (listUpdate.includes(currVer)) {
        return 2;
      }
      // nen update
      return 1;

    } catch(ex) {
      return 0
    }
    
  }

  static checkDiffArray(arr1: any[], arr2: any[]) {
    if ((!arr1 && arr2) || (arr1 && !arr2) ) {
      return true;
    }
    if ((!arr1 && !arr1) || (!arr1.length && !arr2.length)){
      return false;
    }
    if (arr1.length !== arr2.length) {
      return true;
    }
    let isDiff = false;
    for (let i=0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        isDiff = true;
        return isDiff;
      }
    }
    
    return isDiff;
  }

}

