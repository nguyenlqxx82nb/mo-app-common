
import { Dimensions, Platform } from 'react-native';
import Constants from './Constants';

const { width, height } = Dimensions.get('window');
// const deviceH = Dimensions.get('screen').height;

const isIphoneX = Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS && (height >= 812 || width >= 812);

export default {
    isIphoneX,
    ToolbarHeight: isIphoneX ? 35 : 0,
    Left: Constants.TextSize === 1 ? (width < 375 ? width * 0.085 : width * 0.115) : (width < 375 ? width * 0.045 : width * 0.095),
    ModalWidth: width < 375 ? width * 7 / 8 : width * 9 / 10
};
