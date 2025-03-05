import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {BottomSheets, Text} from '../../general';
import {COLORS} from '../../../../conts';
import {useNavigation} from '@react-navigation/native';
import {useQuery} from 'react-query';
import {fetchRequest} from '../../../../helper';

export const DataToCashInfo = () => {
  const navigation = useNavigation();
  const dataUpdate = async () => {
    try {
      const res = await fetchRequest({
        path: 'customer/data-update',
        method: 'GET',
      });

      return res?.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  const {data: dataUpdateData} = useQuery('dataUpdate', dataUpdate);

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 24,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
        <Image
          style={{
            height: 32,
            width: 32,
            resizeMode: 'contain',
            borderRadius: 6,
          }}
          source={require('../../../../assets/images/others/mtn.png')}
        />
        <Text
          style={{paddingLeft: 10}}
          textAlign={'right'}
          size={18}
          fontWeight={800}>
          Data - Cash
        </Text>
      </View>

      <Text
        size={16}
        fontWeight={'500'}
        style={{marginTop: 30, paddingHorizontal: 24}}>
        {dataUpdateData?.subject}
      </Text>

      <View style={{paddingTop: 20, paddingHorizontal: 24}}>
        <Text lineHeight={16} color={'#000000'} size={12} fontWeight={'500'}>
          {dataUpdateData?.message}
        </Text>
      </View>
      <Image
        style={{height: 300, resizeMode: 'cover', width: '100%'}}
        source={require('../../../../assets/images/others/transferringCash.png')}
      />

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('DataToCashScreen');
          BottomSheets.hide();
        }}
        style={{
          height: 80,
          width: 80,
          backgroundColor: COLORS.primary,
          borderRadius: 100,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#820300',
          shadowOpacity: 0.5,
          shadowRadius: 15,
          elevation: 15,
          shadowOffset: {width: 10, height: 10},
          position: 'absolute',
          zIndex: 10,
          right: 24,
          bottom: 24,
        }}>
        <Text md size={14} color={COLORS.white}>
          NEXT
        </Text>
      </TouchableOpacity>
    </View>
  );
};
