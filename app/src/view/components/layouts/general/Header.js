import React from 'react';
import {View, StatusBar, TouchableOpacity, StyleSheet} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS, GENERAL} from '../../../../conts';
import {useUser} from '../../../../hooks';
import {MyIcons, Text} from '../../general';
import {SideDrawer} from '../../sideDrawer';
import {Profile} from '../../sideDrawer/contents';
import {Image} from '../../general/image';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const Header = ({text, amount, conStyle}) => {
  const navigation = useNavigation();
  const {top} = useSafeAreaInsets();
  const {data, getUserImage} = useUser();

  const isFocused = useIsFocused();

  return (
    <View>
      {/* StatusBar for ios use this to change the backgroundColor */}
      {GENERAL.platform == 'ios' && (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            backgroundColor: COLORS.black,
            height: top,
            zIndex: 10,
            top: -top,
          }}
        />
      )}
      {isFocused && (
        <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      )}

      <View
        style={{
          ...styles.con,
          ...conStyle,
        }}>
        <TouchableOpacity
          style={{
            borderWidth: 2,
            borderRadius: 100,
            borderColor: '#A0A0A0',
          }}
          onPress={() => SideDrawer.show('left', <Profile />)}
          activeOpacity={0.7}>
          <Image
            source={getUserImage()}
            style={{
              height: s(39),
              width: s(39),
              resizeMode: 'contain',
              borderRadius: 100,
            }}
          />
        </TouchableOpacity>

        <Text
          numberOfLines={1}
          style={{paddingLeft: 10, flex: 1}}
          size={15}
          bold
          color={COLORS.white}>
          {text}
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('NotificationScreen')}
          activeOpacity={0.7}>
          <MyIcons.BellWhite size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    backgroundColor: COLORS.black,
    width: '100%',
    paddingHorizontal: 20,
    height: s(60),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
