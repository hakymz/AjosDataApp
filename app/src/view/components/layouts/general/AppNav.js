import {StatusBar, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {s} from 'react-native-size-matters';
import {CircleButton, Icons, NavigationButton, Text} from '../../general';
import {COLORS} from '../../../../conts';
import Line from '../../general/others/Line';
import {useNavigation} from '@react-navigation/native';
export const AppNav = ({
  style,
  title,
  icon,
  backgroundColor = COLORS.white,
  line,
  comp,
}) => {
  const navigation = useNavigation();
  return (
    <View>
      <View
        style={{
          backgroundColor,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          ...style,
          padding: 20,
          paddingVertical: 15,
        }}>
        {icon ? (
          icon
        ) : (
          <TouchableOpacity
            onPress={navigation.goBack}
            style={{
              height: 47,
              width: 47,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: 'rgba(0,0,0,0.1)',
              shadowOpacity: 1,
              shadowRadius: 12,
              backgroundColor: COLORS.white,
              borderRadius: 15,
              shadowOffset: {height: 10},
            }}>
            <Icons.ArrowLeft size={20} />
          </TouchableOpacity>
        )}
        {comp || (
          <Text size={18} fontWeight={'800'}>
            {title}
          </Text>
        )}
      </View>
      {line && (
        <View style={{alignItems: 'center', marginTop: 10}}>
          <View style={{height: 1, backgroundColor: '#F4F5F9', width: 235}} />
        </View>
      )}
    </View>
  );
};
