import Constants from './Common/Constants';
import { DeviceEventEmitter } from 'react-native';

export const updateSocialChatDetail = (data: any) => {
    DeviceEventEmitter.emit(Constants.EmitCode.UPDATE_SOCIAL_CHAT_DETAIL, data);
};

export const changeHeaderHeight = (height: number) => {
    if (height === Constants.HeaderHeight) {
        return;
    }
    Constants.HeaderHeight = height;
    DeviceEventEmitter.emit(Constants.EmitCode.HEADER_HEIGHT_CHANGE, Constants.HeaderHeight);
};

export const changeToastBottomHeight = (height: number) => {
    DeviceEventEmitter.emit(Constants.EmitCode.TOAST_BOTTOM_HEIGHT_CHANGE, height);
};

export const toast = (msg: string, type: 'error' | 'warning' | 'success' | 'notification' = 'error' , title: string = '', subTitle: string = '', icon: string = '', data: any = undefined) => {
    DeviceEventEmitter.emit(Constants.EmitCode.Toast, msg, type, title, subTitle, icon, data);
};

export const logout = (params: any = undefined) => {
    DeviceEventEmitter.emit(Constants.EmitCode.Logout, params);
};

export const onLogin = () => {
    DeviceEventEmitter.emit(Constants.EmitCode.Login);
};

export const checkConnection = () => {
    // if (!Constants.IsConnected) {
    //     toast(Languages.noConnection);
    //     return false;
    // }
    return true;
};

export const pushModal = (modal: any) => {
    Constants.ModalShowing = true;
    DeviceEventEmitter.emit(Constants.EmitCode.PushModal, modal);
};