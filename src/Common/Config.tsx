import Constants from "./Constants";

export default class Config {
  static TAG_CONFIG_API() {
    return [
      {
        key: Constants.TAG.KEY_UPDATE_TAG_PHONE_NUMBER,
        data: {
          method: 'post',
          path: 'tags/update_list/for_phone',
          body: null,
          returnResponseServer: true,
        }
      },
      {
        key: Constants.TAG.KEY_UPDATE_TAG_PROFILE_ID,
        data: {
          method: 'post',
          path: 'tags/update_list',
          body: null,
          returnResponseServer: true,
        }
      },
      {
        key: Constants.TAG.KEY_UPDATE_TAG_SOCIAL,
        data: {
          method: 'post',
          path: 'tags/update_list/for_social',
          body: null,
          returnResponseServer: true,
        }
      },
    ]
  };
}


