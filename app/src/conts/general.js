import {Dimensions, Platform} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
const {width, height} = Dimensions.get('window');

const GENERAL = {
  statusBarHeight: getStatusBarHeight(),
  platform: Platform.OS,
  space: 20,
  horizontalSpace: 20,
  screenWidth: width,
  screenHeight: height,
  landScape: 'landscape',
  portrait: 'portrait',
  nairaSign: '₦',
  dollarSign: '$',
  USD: 'USD',
  NGN: 'NGN',
  appsLinkToStore: {
    ios: 'https://apps.apple.com/ng/app/data-resell/id6651851066',
    android: 'https://play.google.com/store/apps/details?id=com.dataresell',
  },
};

export default GENERAL;
