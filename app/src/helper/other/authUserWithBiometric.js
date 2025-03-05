import TouchID from 'react-native-touch-id';
import Toast from '../../view/components/toast/Toast';

export const authUserWithBiometric = async message => {
  try {
    const auth = await TouchID.authenticate(message, {});
    if (!auth) {
      Toast.show('error', 'Authentication failed.');
    }
    return auth;
  } catch (error) {
    Toast.show('error', 'Authentication failed.');
    return false;
  }
};
