import Clipboard from '@react-native-clipboard/clipboard';
import Toast from '../../view/components/toast/Toast';

export const Copy = (text, message = 'Copied') => {
  Clipboard.setString(text);
  Toast.show('success', message);
};
