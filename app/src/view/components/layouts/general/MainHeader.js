import React from 'react';
import {View, StatusBar, TouchableOpacity, StyleSheet} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS, GENERAL, IMAGES} from '../../../../conts';
import {useUser} from '../../../../hooks';

import {Icons, Text} from '../../general';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import {fetchRequest} from '../../../../helper';

export const MainHeader = ({
  title,
  conStyle,
  nav,
  icon,
  backgroundColor = COLORS.backgroundColor,
}) => {
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
          backgroundColor: backgroundColor,
          ...conStyle,
        }}>
        {nav && (
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{...styles.headerBtn, borderColor: '#B8D2FF'}}>
            <Icons.ArrowLeft
              size={17}
              onPress={() => {
                navigation.goBack();
              }}
            />
          </TouchableOpacity>
        )}

        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          <Text
            semiBold
            numberOfLines={1}
            style={{paddingLeft: 10, flex: 1}}
            size={18}>
            {title || `Hi, ${data?.user?.firstName}`}
          </Text>
        </View>

        {icon ? (
          icon
        ) : (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{...styles.headerBtn, marginRight: 5}}>
              <Icons.NoteRedDot
                size={17}
                onPress={() => {
                  navigation.navigate('NotificationScreen');
                }}
              />
            </View>

            <View style={{...styles.headerBtn}}>
              <Icons.Bell
                size={17}
                onPress={() => {
                  navigation.navigate('NotificationScreen');
                }}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    backgroundColor: COLORS.backgroundColor,
    width: '100%',
    paddingHorizontal: 20,
    height: s(60),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
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

  headerBtn: {
    height: 45,
    width: 45,
    // backgroundColor: COLORS.white,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#848A94',
  },
});
