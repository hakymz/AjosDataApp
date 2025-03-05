import React from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS, GENERAL, IMAGES} from '../../../../conts';
import {useUser} from '../../../../hooks';

import {Icons, Text} from '../../general';
import {Image} from '../../general/image';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import {fetchRequest} from '../../../../helper';
import FastImage from 'react-native-fast-image';

export const MainHeader = ({conStyle, editPhoto}) => {
  const {data} = useUser();
  const image = data?.user?.avatar;

  const navigation = useNavigation();
  const [state, setState] = React.useState({image, uploadingImage: false});

  const getImages = async () => {
    try {
      const deviceImages = await launchImageLibrary({
        selectionLimit: 1,
        mediaType: 'photo',
        quality: 0.5,
      });

      const selectedImage = deviceImages?.assets?.[0];

      const uri =
        GENERAL.platform == 'ios'
          ? selectedImage?.uri?.replace?.('file://', '')
          : selectedImage?.uri;

      const imageObj = {
        name: selectedImage?.fileName,
        type: selectedImage?.type,
        uri: uri,
      };
      if (imageObj?.name) {
        uploadImage(imageObj);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async image => {
    let body = new FormData();
    body.append('file', image);
    // console.log(body);

    try {
      const response = await fetchRequest({
        path: '/fileupload',
        headers: {'Content-Type': 'multipart/form-data'},
        data: body,
      });

      const response2 = await fetchRequest({
        path: 'settings/upload-avatar',
        data: {avatar: response?.data},
        method: 'PATCH',
      });

      setState(prevState => ({...prevState, image: response?.data}));
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    setState(prevState => ({...prevState, image}));
  }, [image]);

  return (
    <View>
      {/* StatusBar for ios use this to change the backgroundColor */}
      <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />

      <View
        style={{
          ...styles.con,
          ...conStyle,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          <TouchableOpacity
            style={{
              borderRadius: 100,
              borderColor: '#A0A0A0',
            }}
            onPress={() => {
              navigation.navigate('ProfileScreen');
            }}
            activeOpacity={0.7}>
            {state?.uploadingImage ? (
              <View
                style={{
                  height: 46,
                  width: 46,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator color={COLORS.primary} size={'small'} />
              </View>
            ) : (
              <Image
                resizeMode={FastImage.resizeMode.cover}
                source={
                  state?.image == 'NULL' ? IMAGES.person : {uri: state?.image}
                }
                style={{
                  height: 46,
                  width: 46,
                  resizeMode: 'contain',
                  borderRadius: 100,
                }}
              />
            )}
          </TouchableOpacity>
          {editPhoto ? (
            <TouchableOpacity
              onPress={getImages}
              style={{
                height: 28,
                width: 81,
                borderWidth: 1,
                borderColor: '#231F20',
                marginLeft: 10,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text md size={12}>
                Edit Photo
              </Text>
            </TouchableOpacity>
          ) : (
            <Text
              numberOfLines={1}
              style={{paddingLeft: 10, flex: 1}}
              size={14}
              fontWeight={'500'}>
              Hello, <Text fontWeight={'700'}>{data?.user?.firstName}</Text>
            </Text>
          )}
        </View>

        <View
          style={{
            height: 47,
            width: 47,
            shadowColor: '#7F8192',
            shadowOpacity: 0.12,
            shadowRadius: 12,
            backgroundColor: COLORS.white,
            borderRadius: 15,
            shadowOffset: {height: 10},
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 20,
          }}>
          <View
            style={{
              height: 8,
              width: 8,
              backgroundColor: '#FF0013',
              borderRadius: 10,
              position: 'absolute',
              top: 10,
              right: 7,
            }}
          />
          <Icons.Bell
            size={23}
            onPress={() => {
              navigation.navigate('NotificationScreen');
            }}
          />
        </View>
      </View>
      <View style={{alignItems: 'center', marginTop: 10}}>
        <View style={{height: 1, backgroundColor: '#F4F5F9', width: 235}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    backgroundColor: COLORS.white,
    width: '100%',
    paddingHorizontal: 20,
    height: s(60),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kycPendingCon: {
    width: 122,
    height: 36,
    backgroundColor: COLORS.red,
    borderRadius: 20,
    marginHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    justifyContent: 'space-between',
  },
});
