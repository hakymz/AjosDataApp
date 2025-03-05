import RNFetchBlob from 'rn-fetch-blob';
import {API_KEY, HASH, TIME_STAMP} from '../../conts/api';
import base64 from 'base-64';
import ImgToBase64 from 'react-native-image-base64';

export const uploadImageRequest = async ({url, method, image}) => {
  console.log(image);
  console.log(method);
  //   const base64Image = base64.encode(image);

  try {
    const base64Image = await ImgToBase64.getBase64String(image);

    const response = await RNFetchBlob.fetch(
      method,
      url,
      {
        'Content-Type': 'application/octet-stream',
        'X-SHAP-API-KEY': API_KEY,
        'X-SHAP-REQUEST-HASH': HASH,
        'X-SHAP-REQUEST-TIMESTAMP': TIME_STAMP,
      },
      base64Image,
    );

    return response.text();
  } catch (error) {
    throw error;
  }
};
