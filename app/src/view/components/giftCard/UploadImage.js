import React from 'react';
import {s} from 'react-native-size-matters';
import {View, TouchableOpacity, ScrollView} from 'react-native';
import {COLORS, FONTS} from '../../../conts';
import {Icons, MyIcons, Text} from '../general';
import {PreviewImage} from './PreviewImage';
import {launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import Toast from '../toast/Toast';
import {Image} from '../general/image';
import FastImage from 'react-native-fast-image';

const MAX_IMAGES = 20;

const ImageButton = ({number = 1, onPress, select, removeImage, item}) => {
  return select ? (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}>
      <View
        style={{
          backgroundColor: '#F2F0FA',
          height: 50,
          width: 50,
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          style={{height: 33, width: 33}}
          source={require('../../../assets/images/others/album.png')}
        />
      </View>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      style={{
        paddingRight: 10,
        height: 50,
        width: 50,
        alignItems: 'center',
        marginRight: 7,
        overflow: 'visible',
        borderRadius: 12,
      }}
      activeOpacity={0.7}
      onPress={onPress}>
      <View
        style={{
          position: 'absolute',
          right: 0,
          zIndex: 2000,
          marginTop: -2,
        }}>
        <Icons.DeletePen
          size={20}
          onPress={() => {
            removeImage(item?.uri);
          }}
        />
      </View>

      <Image
        resizeMode={FastImage.resizeMode.cover}
        style={{height: 50, width: 50, borderRadius: 12}}
        source={{uri: item?.uri}}
      />
    </TouchableOpacity>
  );
};
export const UploadImage = ({
  selectedImages,
  updateImages = () => {},
  title = 'Upload card',
}) => {
  const navigation = useNavigation();
  const [state, setState] = React.useState({
    showImagePreview: false,
    imagePreview: '',
    includeBase64: true,
  });

  const getImages = async () => {
    try {
      // const selectionLimit = MAX_IMAGES - selectedImages.length;
      const selectionLimit = MAX_IMAGES;

      const deviceImages = await launchImageLibrary({
        selectionLimit,
        mediaType: 'photo',
        quality: 0.5,
      });

      const filteredImage = (deviceImages?.assets ?? []).filter(
        (item, index) => {
          if (item?.fileSize > 5000000) {
            Toast.show('error', 'File too big, Max of 5MB');
            return false;
          } else {
            return index < MAX_IMAGES;
          }
        },
      );

      if (filteredImage?.length + selectedImages?.length > MAX_IMAGES) {
        const removeIndex =
          filteredImage?.length + selectedImages?.length - MAX_IMAGES;
        const oldImages = selectedImages.filter(
          (_, index) => index > removeIndex - 1,
        );
        updateImages([...oldImages, ...filteredImage]);
      } else {
        updateImages([...selectedImages, ...filteredImage]);
      }
    } catch (error) {
      console.log(error, 'error ....');
    }
  };

  const removeImage = uri => {
    const newImages = selectedImages.filter(item => uri != item.uri);
    updateImages(newImages);
  };
  return (
    <View
      style={{
        borderRadius: 20,
        justifyContent: 'center',
      }}>
      <View
        style={{
          // paddingVertical: 20,
          paddingHorizontal: 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          flex: 1,
        }}>
        {selectedImages?.length > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              height: '100%',
            }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                alignItems: 'center',
                flexDirection: 'row',
                minWidth: '100%',
                height: '100%',
                // paddingVertical: 20,
              }}>
              {selectedImages.map((item, index) => (
                <ImageButton
                  item={item}
                  removeImage={removeImage}
                  key={'image' + index}
                  number={index + 1}
                  onPress={() => {
                    navigation.navigate('PreviewImageScreen', {
                      image: item?.uri,
                      actionBtn: () => {
                        removeImage(item?.uri);
                        navigation.goBack();
                      },
                    });
                  }}
                />
              ))}
              {selectedImages.length < MAX_IMAGES && (
                <ImageButton select onPress={() => getImages()} />
              )}
            </ScrollView>
          </View>
        ) : (
          <TouchableOpacity style={{}} onPress={() => getImages()}>
            <View
              style={{
                backgroundColor: '#F2F0FA',
                height: 50,
                width: 50,
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{height: 33, width: 33}}
                source={require('../../../assets/images/others/album.png')}
              />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
