import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS, FONTS, GENERAL} from '../../../../conts';
import {useOrientation} from '../../../../hooks';
import {CircleButton, MyIcons, NavigationButton, Text} from '../../general';
import {Icons} from '../../general';

const SmallButton = () => {
  return (
    <TouchableOpacity
      style={{
        height: s(46),
        width: s(111),
        backgroundColor: COLORS.black,
        borderRadius: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
      }}>
      <Text semiBold color={COLORS.white}>
        {title}
      </Text>
      <MyIcons.ArrowGreen size={16} />
    </TouchableOpacity>
  );
};
export const HeaderButton = ({title, onPress = () => {}, route}) => {
  const navigation = useNavigation();
  const {screenOrientation} = useOrientation();
  return (
    <View
      onLayout={event => {}}
      style={{
        ...styles.header,
        top:
          GENERAL.platform == 'ios'
            ? screenOrientation == 'landscape'
              ? 0
              : GENERAL.statusBarHeight
            : 0,
      }}>
      <NavigationButton title={title} onPress={() => onPress()} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 10,
    position: 'absolute',
    width: '100%',
    zIndex: 10,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
  },
});
