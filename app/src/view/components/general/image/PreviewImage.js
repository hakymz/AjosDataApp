import React from 'react';
import {ScrollView, View, Modal, ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {s} from 'react-native-size-matters';
import {Icons} from '..';
import {COLORS} from '../../../../conts';
import {useLayouts, useOrientation} from '../../../../hooks';
import {Button} from '../../buttons';
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
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View
          style={{
            top: insets.top + 20,
            zIndex: 20,
            alignItems: 'flex-end',
            paddingHorizontal: 20,
            position: 'absolute',
            width: '100%',
          }}>
          <Icons.CrossRed
            style={{height: s(30), width: s(30)}}
            onPress={close}
          />
        </View>
        <View
          style={{
            minHeight: height,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 40,
          }}>
          <View style={{width: '100%'}}>
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
            <View style={{flex: 1, alignItems: 'center'}}>
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
            </View>

            {showButtons && (
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  marginTop: 40,
                  paddingHorizontal: 20,
                }}>
                <Button
                  type="blue"
                  title="Close"
                  style={{flex: 1}}
                  onPress={close}
                />
                <View style={{width: 20}} />
                <Button
                  type="red"
                  title="Remove"
                  style={{flex: 1}}
                  onPress={removeImage}
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};
