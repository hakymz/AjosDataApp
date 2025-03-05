import {Linking} from 'react-native';
import Toast from '../../view/components/toast/Toast';

export const openLink = async url => {
  console.log('okkk');

  try {
    const supported = await Linking.canOpenURL(url);

    console.log('okk noow');
    if (supported) {
      console.log('yess');
      await Linking.openURL(url);
    } else {
      console.log('noooo');
      Toast.show('error', `Don't know how to open this URL: ${url}`);
    }
  } catch (error) {
    console.log(error);
  }
};
