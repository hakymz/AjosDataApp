import React from 'react';
import {View, Image} from 'react-native';
import {COLORS} from '../../../conts';
import {Text} from '../general';

export const CreditCard = () => {
  return (
    <View
      style={{
        height: 200,
        backgroundColor: '#41966E',
        borderRadius: 25,
        overflow: 'hidden',
      }}>
      <Image
        style={{
          position: 'absolute',
          width: '120%',
          height: '120%',
          resizeMode: 'cover',
          top: -20,
          left: -10,
          zIndex: 0,
        }}
        source={require('../../../assets/images/others/dolarCard.png')}
      />
      <View style={{padding: 15, flex: 1, justifyContent: 'space-between'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text color={COLORS.white} semiBold size={10}>
              Balance
            </Text>
            <Text color={COLORS.white} bold>
              $2,340.00
            </Text>
          </View>

          <Image
            style={{height: 30, width: 30}}
            source={require('../../../assets/images/others/snapiCardLogo.png')}
          />
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Image
            style={{height: 27, width: 27}}
            source={require('../../../assets/images/others/mastercardLogo.png')}
          />
        </View>
      </View>
    </View>
  );
};
