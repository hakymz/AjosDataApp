// const STAGING_API =
//   'http://snapibackend-env.eba-zstpzc8p.eu-north-1.elasticbeanstalk.com/api/v1/';

const STAGING_API = 'https://business.ajeboplug.com/api/';
// const LIVE_API = 'https://0e6qi2it6h.execute-api.us-east-2.amazonaws.com/';
import store from '../redux/store';

const getToken = async () => {
  try {
    const savedUserData = store.getState()?.userData;

    if (savedUserData) {
      return savedUserData?.data?.token;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

const API = STAGING_API;

export {API, getToken};
