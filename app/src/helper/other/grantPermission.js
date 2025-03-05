import {Alert} from 'react-native';
import {
  check,
  request,
  requestMultiple,
  checkMultiple,
  RESULTS,
} from 'react-native-permissions';
import Toast from '../../view/components/toast/Toast';

const requestPermission = async permision => {
  if (Array.isArray(permision)) {
    try {
      let allGranted = false;
      const grantPermission = await requestMultiple(permision);
      permision.forEach((_, index) => {
        if (grantPermission[permision[index]] == RESULTS.GRANTED) {
          allGranted = true;
        } else {
          allGranted = false;
        }
      });
      if (allGranted) {
        return true;
      } else {
        Toast.show('error', 'Permission was not granted');

        return false;
      }
    } catch (error) {
      Toast.show('error', 'Permission was not granted');

      return false;
    }
  } else {
    try {
      const grantPermission = await request(permision);

      if (grantPermission == RESULTS.GRANTED) {
        return true;
      } else {
        Toast.show('error', 'Permission was not granted');
        return false;
      }
    } catch (error) {
      console.log(error);
      Toast.show('error', 'Permission was not granted');
      return false;
    }
  }
};

const checkPermission = async permision => {
  if (Array.isArray(permision)) {
    try {
      const grantPermission = await checkMultiple(permision);
      if (
        grantPermission[permision[0]] == RESULTS.GRANTED &&
        grantPermission[permision[1]] == RESULTS.GRANTED
      ) {
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  } else {
    try {
      const grantPermission = await check(permision);
      if (grantPermission == RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
};
const grantPermission = async (permission, message) => {
  try {
    const alreadyGranted = await checkPermission(permission);
    if (alreadyGranted) {
      return true;
    } else {
      const permissionGranted = await requestPermission(permission);

      if (permissionGranted) {
        return true;
      } else {
        Toast.show('error', 'Permission was not granted');
        return false;
      }
    }
  } catch (error) {
    Toast.show('error', 'Permission was not granted');
    return false;
  }
};

export default grantPermission;
