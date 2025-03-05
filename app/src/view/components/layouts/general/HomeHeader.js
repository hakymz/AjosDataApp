import React from 'react';
import {View, StatusBar, TouchableOpacity, StyleSheet} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS, GENERAL} from '../../../../conts';
import {useUser} from '../../../../hooks';

import {MyIcons, Text} from '../../general';
import {SideDrawer} from '../../sideDrawer';
import {Profile} from '../../sideDrawer/contents';
import {Image} from '../../general/image';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const HomeHeader = ({conStyle}) => {
  const navigation = useNavigation();
  const {top} = useSafeAreaInsets();
  const {data, settings, getUserImage} = useUser();

  return (
    <View>
      {/* StatusBar for ios use this to change the backgroundColor */}
      {GENERAL.platform == 'ios' && (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: top,
            zIndex: 10,
            top: -top,
          }}
        />
      )}

      <View
        style={{
          ...styles.con,
          ...conStyle,
          backgroundColor:
            settings.currency == 'USD' ? COLORS.black : COLORS.yellow,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
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
            color={settings?.currency == 'USD' ? COLORS.white : COLORS.black}>
            {data?.user?.userTag}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {(data?.user?.kycStatus == 'NULL' ||
            data?.user?.kycStatus == 'pending' ||
            data?.user?.kycStatus == 'failed') && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('KycScreen');
              }}
              style={styles.kycPendingCon}>
              <Text lineHeight={0} color={COLORS.white} size={12} bold>
                KYC pending
              </Text>
              <MyIcons.ArrowLightRed stroke="#FFA4A4" size={11} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => navigation.navigate('NotificationScreen')}
            activeOpacity={0.7}>
            {settings?.currency == 'USD' ? (
              <MyIcons.BellWhite size={24} />
            ) : (
              <MyIcons.Bell size={24} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    backgroundColor: COLORS.yellow,
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
