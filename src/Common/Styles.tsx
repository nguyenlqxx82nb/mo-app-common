
import { StyleSheet } from 'react-native';

import Constants from './Constants';
import Color from './Color';
import Device from './Device';

const Styles = StyleSheet.create({

  Shadow: {
    shadowColor: '#4e4e4e',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  
  Header: {
    height: 49, 
    marginTop: Constants.BarHeight, 
    borderBottomColor: Color.border, 
    borderBottomWidth: 0.5, 
    paddingHorizontal: 16, 
    justifyContent:'space-between', 
    flexDirection: 'row', 
    alignItems: 'center'
  },

  RowOnly: {
    flexDirection: 'row'
  },

  Row: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  RowCenter: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  Flex: {
    flex: 1
  },

  FlexGrow: {
    flexGrow: 1
  },

  ButtonIcon: {
    width: 30,
    height: 30
  },
  container: {
    flex:1,
    backgroundColor: Color.background
  },

  SafeView: {
    paddingBottom: Device.isIphoneX ? 35 : 0
  },

  Divider: {
    borderBottomColor: Color.border,
    borderBottomWidth: 0.5
  },

  Inner: {
    paddingHorizontal: 16,
    paddingVertical: 20
  },

  Border: {
    borderColor: Color.border,
    borderWidth: 1,
    borderRadius: 4
  },

  JustifyBetween: {
    justifyContent: 'space-between'
  },

  JustifyStart: {
    justifyContent: 'flex-start'
  },

  JustifyEnd: {
    justifyContent: 'flex-end'
  },

  JustifyCenter: {
    justifyContent: 'center'
  },

  CenterItem : {
    justifyContent: 'center',
    alignItems: 'center'
  },

  AlignCenter: {
    alignItems: 'center'
  },

  AlignStart: {
    alignItems: 'flex-start'
  },

  AlignEnd: {
    alignItems: 'flex-end'
  },
  
  // Text Regular Size
  Text_TS_R: {
    fontFamily: Constants.fontRegular,
    fontSize: 8,
    color: Color.text
  },

  Text_T_R: {
    fontFamily: Constants.fontRegular,
    fontSize: 10,
    lineHeight: 12,
    color: Color.text
  },

  Text_S_R: {
    fontFamily: Constants.fontRegular,
    fontSize: 12,
    lineHeight: 18,
    color: Color.text
  },

  Text_M_R: {
    fontFamily: Constants.fontRegular,
    fontSize: 14,
    lineHeight: 18,
    color: Color.text
  },

  Text_L_R: {
    fontFamily: Constants.fontRegular,
    fontSize: 16,
    lineHeight: 20,
    color: Color.text
  },

  Text_XL_R: {
    fontFamily: Constants.fontRegular,
    fontSize: 18,
    lineHeight: 24,
    color: Color.text
  },

  Text_XXL_R: {
    fontFamily: Constants.fontRegular,
    fontSize: 20,
    lineHeight: 26,
    color: Color.text
  },

  // Text Medium
  Text_TS_M: {
    fontFamily: Constants.fontMedium,
    fontSize: 8,
    color: Color.text
  },

  Text_T_M: {
    fontFamily: Constants.fontMedium,
    fontSize: 10,
    lineHeight: 12,
    color: Color.text
  },

  Text_S_M: {
    fontFamily: Constants.fontMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Color.text
  },

  Text_M_M: {
    fontFamily: Constants.fontMedium,
    fontSize: 14,
    lineHeight: 18,
    color: Color.text
  },

  Text_L_M: {
    fontFamily: Constants.fontMedium,
    fontSize: 16,
    lineHeight: 20,
    color: Color.text
  },

  Text_XL_M: {
    fontFamily: Constants.fontMedium,
    fontSize: 18,
    lineHeight: 24,
    color: Color.text
  },

  Text_XXL_M: {
    fontFamily: Constants.fontMedium,
    fontSize: 20,
    lineHeight: 26,
    color: Color.text
  },

  // Text Bold
  Text_TS_B: {
    fontFamily: Constants.fontBold,
    fontSize: 8,
    color: Color.text
  },

  Text_T_B: {
    fontFamily: Constants.fontBold,
    fontSize: 10,
    lineHeight: 12,
    color: Color.text
  },

  Text_S_B: {
    fontFamily: Constants.fontBold,
    fontSize: 12,
    lineHeight: 16,
    color: Color.text
  },

  Text_M_B: {
    fontFamily: Constants.fontBold,
    fontSize: 14,
    lineHeight: 18,
    color: Color.text
  },

  Text_L_B: {
    fontFamily: Constants.fontBold,
    fontSize: 16,
    lineHeight: 22,
    color: Color.text
  },

  Text_XL_B: {
    fontFamily: Constants.fontBold,
    fontSize: 18,
    lineHeight: 26,
    color: Color.text
  },

  Text_XXL_B: {
    fontFamily: Constants.fontBold,
    fontSize: 20,
    lineHeight: 26,
    color: Color.text
  },

  // Text SemiBold
  Text_TS_SB: {
    fontFamily: Constants.fontSemiBold,
    fontSize: 8,
    color: Color.text
  },

  Text_T_SB: {
    fontFamily: Constants.fontSemiBold,
    fontSize: 10,
    lineHeight: 12,
    color: Color.text
  },

  Text_S_SB: {
    fontFamily: Constants.fontSemiBold,
    fontSize: 12,
    lineHeight: 16,
    color: Color.text
  },

  Text_M_SB: {
    fontFamily: Constants.fontSemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: Color.text
  },

  Text_L_SB: {
    fontFamily: Constants.fontSemiBold,
    fontSize: 16,
    lineHeight: 20,
    color: Color.text
  },

  Text_XL_SB: {
    fontFamily: Constants.fontSemiBold,
    fontSize: 18,
    lineHeight: 24,
    color: Color.text
  },

  Text_XXL_SB: {
    fontFamily: Constants.fontSemiBold,
    fontSize: 20,
    lineHeight: 26,
    color: Color.text
  },

  ModalContainer: {
    width: Constants.Width,
    height: Constants.Height - Constants.BarHeight - 30,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: '#fff'
  },

  ModalBottom: {
    width: Constants.Width,
    paddingBottom: Device.ToolbarHeight + 20,
    paddingTop: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    backgroundColor: '#fff'
  },

  ModalHeader: {
    width: Constants.Width,
    height: 60,
    borderBottomColor: Color.border,
    borderBottomWidth: 1,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 5
  },

  ModalItemContainer: {
    paddingTop:16,
    paddingBottom: 16,
    width: Constants.Width,
    borderBottomWidth: 1,
    borderBottomColor: Color.border
  },

  ModalItemTitle: {
    paddingBottom: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  CbItem: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: Constants.Width
  },

  CbLabelItem: {
    fontFamily: Constants.fontRegular,
    fontSize: 12,
    lineHeight: 18,
    color: Color.text,
    maxWidth: 280
  },

  MoreText: {
    fontFamily: Constants.fontMedium,
    fontSize: 14,
    lineHeight: 18,
    color: Color.primary,
    paddingHorizontal: 10,
    paddingVertical: 5
  }

});

export default Styles;
