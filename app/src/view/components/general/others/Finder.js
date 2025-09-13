import React from 'react';
import {Image, StyleSheet, useWindowDimensions, View} from 'react-native';
import {s} from 'react-native-size-matters';
import {KeyboardAvoidingViewWrapper, SearchInput, Text} from '..';
import {COLORS} from '../../../../conts';
import {useNavigation} from '@react-navigation/native';
import {BlurView} from '@react-native-community/blur';

export const Finder = ({}) => {
  const [text, setText] = React.useState('');
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const getScreen = search => {
    const searchL = search?.toLowerCase();
    if (searchL == 'electricity') {
      navigation.navigate('ElectricityScreen');
    } else if (searchL == 'data') {
      navigation.navigate('SellDataScreen');
    } else if (searchL == 'airtime') {
      navigation.navigate('SellAirtimeScreen');
    } else if (searchL == 'sms') {
      navigation.navigate('BulkSmsScreen');
    } else if (searchL == 'tv' || searchL == 'cable') {
      navigation.navigate('TvScreen');
    }
  };
  return (
    <View
      style={{
        position: 'absolute',
        zIndex: 100,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <BlurView
        style={{
          ...StyleSheet.absoluteFillObject,
        }}
        blurType="dark" // "xlight" | "light" | "dark"
        blurAmount={10} // Adjust intensity
        reducedTransparencyFallbackColor="white"
      />
      <KeyboardAvoidingViewWrapper
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            backgroundColor: COLORS.white,
            paddingHorizontal: 20,
            paddingVertical: 30,
            borderRadius: 16,
            height: 400,
            width: width - 40,
          }}>
          <Text
            bold
            color={COLORS.primary}
            style={{}}
            numberOfLines={2}
            size={16}
            medium
            lineHeight={28}>
            Finder
          </Text>
          <Text medium size={14}>
            Search and find anything on the Ajebo app.
          </Text>
          <SearchInput
            placeholder="Search your plug..."
            value={text}
            onChangeText={setText}
            onSubmitEditing={e => {
              getScreen(e.nativeEvent.text);
            }}
          />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 30,
              marginBottom: 30,
            }}>
            <Image
              style={{height: 153, width: 153}}
              source={require('../../../../assets/images/others/search.png')}
            />
          </View>
        </View>
      </KeyboardAvoidingViewWrapper>
    </View>
  );
};
