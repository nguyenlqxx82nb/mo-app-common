
import { Dimensions, Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import ExtraDimensions from 'react-native-extra-dimensions-android';

const { width, height } = Dimensions.get('window');

const Constants = {
  AppConfig: undefined,
  CALL_STATUS: 'NOT AVAILABLE',
  Currency: 'VNĐ',
  appFacebookId: '296476310532564',
  PdId: '',
  Lang: 'vi',
  ProfileId: '',
  AuthDigest: '',
  AuthToken: '',
  UserId: '',
  MerchantId: '',
  StaffId: '',
  Module: '',
  Username: '',
  Password: '',
  IsCallCenterConnected: false,
  ROLE: {
    ADMIN: 'admin',
    MANAGER: 'manager',
    OWNER: 'owner',
    USER: 'user'
  },

  DefaultAccount: false,
  IsConnected: true,
  showStatusBar: false,
  ModalShowing: false,
  DisplayHistoryAssign: false,

  BarHeight: getStatusBarHeight(),
  Width: width,
  HeaderHeight: 0,
  useReactotron: true,
  // Language: Config.Lang, // vi, en. Default to set redux. Only use first time
  TextSize: 1,
  IsInCall: false,
  IsCallCenter: true,
  FingerStatus: 0,
  Dimension: {
    ScreenWidth(percent = 1) {
      return Dimensions.get('window').width * percent;
    },
    ScreenHeight(percent = 1) {
      return Dimensions.get('window').height * percent;
    },
  },

  EmitCode: {
    Toast: 'toast',
    Spinner: 'spinner',
    Logout: 'logout',
    Login: 'login',
    UpdateVersion: 'UpdateVersion',
    ModalShow: 'ModalShow',
    ModalHide: 'ModalHide',
    MainScreenShow: 'MainScreenShow',
    MainBottomBarHide: 'MainBottomBarHide',
    MainBottomBarShow: 'MainBottomBarShow',
    PushModal: 'PushModal',
    PopModal: 'PopModal',
    PushNotification: 'PushNotification',
    ShowPushNotification: 'ShowPushNotification',
    ForceUpdate: 'ForceUpdate',
    EditEmailSuccess: 'EditEmailSuccess',
    ShowNotificationModal: 'ShowTransactionModal',
    SOCIAL_NOTIFICATION: 'SOCIAL_NOTIFICATION',
    HEADER_HEIGHT_CHANGE: 'HEADER_HEIGHT_CHANGE',
    TOAST_BOTTOM_HEIGHT_CHANGE: 'TOAST_BOTTOM_HEIGHT_CHANGE',
    UPDATE_SOCIAL_CHAT_DETAIL: 'UPDATE_SOCIAL_CHAT_DETAIL',
    UPDATE_SOCIAL_CHAT_MAIN_LIST: 'UPDATE_SOCIAL_CHAT_MAIN_LIST',
    CLOSE_MODAL: 'CLOSE_MODAL'
  },

  TOAST_TYPE: {
    ERROR: 'error',
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning'
  },

  DEFAULT_TOAST_MARGIN_BOTTOM: 20,

  fontText: {
    size: 16,
  },

  Layout: {
    card: 'card',
  },
  // fontRegular: 'SFProText-Regular',
  // fontMedium: 'SFProText-Medium',
  // fontBold: 'SFProText-Semibold',
  ...Platform.select({
    ios: {
      fontRegular: 'SFProText-Regular',
      fontMedium: 'SFProText-Medium',
      fontBold: 'SFProText-Bold',
      fontSemiBold: 'SFProText-Semibold',
      Height: height,
    },
    android: {
      fontRegular: 'SF-Pro-Text-Regular',
      fontMedium: 'SF-Pro-Text-Medium',
      fontBold: 'SF-Pro-Text-Bold',
      fontSemiBold: 'SFProText-Semibold',
      Height: ExtraDimensions.getRealWindowHeight(),
    },
  }),
  // fontRegular: 'SFProText-Regular',
  // fontMedium: 'SFProText-Medium',
  // fontBold: 'SFProText-Semibold',
  productAttributeColor: 'color',

  FIR_LOG_TYPE: {
    SCREEN: 1,
    CUSTOM_EVENT: 2,
  },

  FB_PIXEL_LOG_TYPE: {
    VIEW_CONTENT: 1,
    ADD_TO_CARD: 2,
    INIT_CHECKOUT: 3,
    CONTACT: 4,
    CONFIRM: 5,
    PURCHASE: 6,
  },
  SORT: {
    ASC: 'asc',
    DESC: 'desc',
    DEFAULT: 'default'
  },

  TAG: {
    KEY_UPDATE_TAG_PHONE_NUMBER: 'tag-for-phone',
    KEY_UPDATE_TAG_PROFILE_ID: 'tag-profile-id',
    KEY_UPDATE_TAG_SOCIAL: 'tag-social',
  },

  SOCIAL: {
    TYPE: {
      FACEBOOK: 1,
      ZALO: 2,
      INSTAGRAM: 3,
      YOUTUBE: 4,
      MOBILE_APP: 5,
      LINE: 6,
      WEB_LIVE_CHAT: 7
    },
    MULTIPLIER_OF_UNIT: {
      minute: 60000,
      hours: 3600000,
      day: 86400000
    },
    FEATURE_CODE: {
      TOPIC: 1,
      MESSAGE: 2,
      COMMENT: 3,
      RATE: 4
    },
    TEXT_BY_CODE_FEATURE: {
      2: 'conversation',
      3: 'comment',
      4: 'rating'
    },
    RANGE_TIME_REVOKE_BEFORE: 15000,
    COMMENT_STATUS_DELIVERED: 3,
    COMMENT_STATUS_SENDING: 2,
    STATE_SEND_DATA_TO_SERVER: {
      COMMENT_SEND_INSTAGRAM_FAIL: -7,
      COMMENT_SEND_FACEBOOK_FAIL: -6,
      MESSAGE_SEND_ZALO_FAIL: -5,
      MESSAGE_USER_DISALLOW_APP: -4,
      MESSAGE_SEND_MOBIO_FAIL: -3,
      MESSAGE_SEND_FACEBOOK_FAIL: -2,
      MESSAGE_FAIL: -1,
      MESSAGE_SENT: 1,
      MESSAGE_SENDING: 2,
      MESSAGE_DELIVERED: 3,
      MESSAGE_READ: 4
    },
    SOCKET_RECALL_TAB_COUNT: [
      'REPLY_MESSAGE_SOCKET', 'NEW_MESSAGE_SOCKET', 'NEW_COMMENT_SOCKET', 'ASSIGN_CONVERSATION_SOCKET', 'RESOLVED_CONVERSATION_SOCKET',
      'REVOKE_CONVERSATION_ASSIGN_SOCKET', 'REPLY_COMMENT_TOPIC_SOCKET', 'ASSIGN_COMMENT_SOCKET', 'RESOLVED_COMMENT_SOCKET',
      'REVOKE_COMMENT_ASSIGN_SOCKET', 'REPLY_COMMENT_RATING_SOCKET', 'NEW_RATING_SOCKET', 'RESOLVED_RATING_SOCKET', 'REVOKE_RATING_ASSIGN_SOCKET'
    ],
    MESSAGE_TYPE: {
      MESSAGE_ONLY: 1,
      INCLUDE_ATTACHMENTS: 2
    },
    STATUS: {
      COMPLETED: 2
    },
    ASSIGN_ACTIVE: 'STAFF_AVAILABLE',
    CLASSIFY: {
      NEGATIVE: 0,
      NEUTRAL: 1,
      POSITIVE: 2,
    }
  }
};

export default Constants;
