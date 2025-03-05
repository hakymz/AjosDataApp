import React from 'react';
import {s} from 'react-native-size-matters';
import {View, TouchableOpacity, ScrollView} from 'react-native';
import {COLORS, FONTS} from '../../../conts';
import {Icons, MyIcons, Text} from '../general';
import {PreviewImage} from './PreviewImage';
import {launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import Toast from '../toast/Toast';

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
      <MyIcons.Cloud size={30} />
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      style={{paddingRight: 10}}
      activeOpacity={0.7}
      onPress={onPress}>
      <View
        style={{
          position: 'absolute',
          zIndex: 200,
          top: -10,
          right: 0,
        }}>
        <MyIcons.CancelRed
          size={20}
          onPress={() => {
            removeImage(item?.uri);
          }}
        />
      </View>
      <View
        style={{
          height: s(41),
          width: s(41),
          backgroundColor: '#D5EAE0',
          borderRadius: 50,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 5,
          overflow: 'visible',
        }}>
        <Text color={COLORS.primary} semiBold size={14}>
          {number}
        </Text>
      </View>
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
        height: s(85),
        backgroundColor: COLORS.backgroundColor,
        borderRadius: 20,
        justifyContent: 'center',
        marginTop: 12,
      }}>
      <View
        style={{
          // paddingVertical: 20,
          paddingHorizontal: 30,
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
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 1,
              alignItems: 'center',
            }}
            onPress={() => getImages()}>
            <Text semiBold color={COLORS.primary} style={{}}>
              {title}
            </Text>
            <MyIcons.Cloud size={30} style={{top: 0}} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
