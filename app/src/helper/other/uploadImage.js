import React from 'react';
import {fetchRequest} from './fetchRequest';
import axios from 'axios';
import {Preloader} from '../../view/components/loaders';

const getCloudDetails = async () => {
  try {
    const response = await fetchRequest({
      path: 'settings/cloudinary-config?path=avatar',
      method: 'GET',
      showLoader: false,
    });

    return response?.data;
  } catch (error) {
    throw error;
  }
};
export const uploadImage = async files => {
  console.log(files);
  const details = await getCloudDetails();
  const imagesUrl = [];

  const {api_key, cloud_name} = details || {};

  for (let i = 0; i < files?.length; i++) {
    const formData = new FormData();
    formData.append('file', files[i]);
    formData.append('api_key', api_key);
    formData.append('cloud_name', cloud_name);
    formData.append('upload_preset', 'snapi_files');
    formData.append('timestamp', new Date()?.getTime());

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        formData,
        {headers: {'Content-Type': 'multipart/form-data'}},
      );
      imagesUrl.push(response?.data?.secure_url);
    } catch (error) {
      console.log(error);
    }
  }

  return imagesUrl;
};
