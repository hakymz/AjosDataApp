import React from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, FONTS, GENERAL} from '../../../../conts';
import {useLayouts, useTheme} from '../../../../hooks';
import {Icons, Text} from '..';
import {Box} from '../../layouts';
import LottieView from 'lottie-react-native';
import {s} from 'react-native-size-matters';
import {scaleFont} from '../../../../helper';
import {launchImageLibrary} from 'react-native-image-picker';
import {Button, ImageButton} from '../../buttons';
import {PreviewImage} from '.';
const MAX_IMAGES = 20;

export const UploadImage = ({selectedImages, updateImages = () => {}}) => {
  const {theme} = useTheme();
  const [state, setState] = React.useState({
    showImagePreview: false,
    imagePreview: '',
    includeBase64: true,
  });

  const removeImage = () => {
    const newImages = selectedImages.filter(
      item => state.imagePreview != item.uri,
    );
    updateImages(newImages);
    setState(prevState => ({
      ...prevState,
      showImagePreview: false,
      imagePreview: '',
    }));
  };

  return (
    <View style={{paddingVertical: 20}}>
      <Box style={{height: s(140)}}>
        {selectedImages?.length > 0 ? (
          <View style={{flexDirection: 'row'}}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {selectedImages.map((item, index) => (
                <ImageButton
                  key={'image' + index}
                  number={index + 1}
                  onPress={() =>
                    setState(prevState => ({
                      ...prevState,
                      showImagePreview: true,
                      imagePreview: item?.uri,
                    }))
                  }
                />
              ))}
              {selectedImages.length < MAX_IMAGES && (
                <ImageButton select onPress={() => getImages()} />
              )}
            </ScrollView>
          </View>
        ) : (
          <TouchableOpacity onPress={() => getImages()}>
            <LottieView
              style={{height: s(85)}}
              autoPlay
              source={require('../../../../assets/lottieFiles/others/upload.json')}
            />
          </TouchableOpacity>
        )}
      </Box>
      <Text
        style={{
          marginTop: 10,
          color: theme == GENERAL.DarkTheme ? COLORS.white : COLORS.darkBlue,
          textAlign: 'center',
        }}>
        Upload Images
      </Text>

      <PreviewImage
        visible={state.showImagePreview}
        image={state.imagePreview}
        close={() =>
          setState(prevState => ({
            ...prevState,
            showImagePreview: false,
            imagePreview: '',
          }))
        }
        removeImage={removeImage}
      />
    </View>
  );
};
