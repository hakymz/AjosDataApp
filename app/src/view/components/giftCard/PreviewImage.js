import React from 'react';
import {ScrollView, View, Modal, ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {s} from 'react-native-size-matters';

import {COLORS} from '../../../conts';
import {useOrientation, useLayouts} from '../../../hooks';

import {Button} from '../general';
import {Icons} from '../general';
export const PreviewImage = ({
  image,
  visible = false,
  removeImage,
  close,
  showButtons = true,
}) => {
  const [imageLoading, setImageLoading] = React.useState(true);
  const {height} = useLayouts();
  const {screenOrientation} = useOrientation();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      style={{
        flex: 1,
      }}>
      <ScrollView
        contentContainerStyle={{
          backgroundColor: 'rgba(0,0,0,1)',
          minHeight: '100%',
          paddingTop: insets.top + 60,
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View
          style={{
            top: insets.top + 20,
            zIndex: 20,
            paddingHorizontal: 20,
            position: 'absolute',
            width: '100%',
          }}>
          <Icons.BackArrowBlue size={30} onPress={close} />
        </View>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 40,
            flex: 1,
          }}>
          {imageLoading && (
            <View
              style={{
                height: 300,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                zIndex: 100,
              }}>
              <ActivityIndicator color={COLORS.primary} size="large" />
            </View>
          )}

          <FastImage
            onLoadStart={() => setImageLoading(true)}
            source={{uri: image}}
            resizeMode="contain"
            style={{
              height: 350,
              width: screenOrientation == 'landscape' ? 350 : '100%',
            }}
            onLoad={() => setImageLoading(false)}
          />

          {showButtons && (
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                marginTop: 40,
                paddingHorizontal: 20,
                flex: 1,
                alignItems: 'flex-end',
                paddingBottom: 60,
              }}>
              <Button title="Close" style={{flex: 1}} onPress={close} />
              <View style={{width: 20}} />
              <Button
                style={{backgroundColor: COLORS.red, flex: 1}}
                title="Remove"
                onPress={removeImage}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </Modal>
  );
};
