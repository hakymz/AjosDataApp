import React from 'react';
import {View, Keyboard} from 'react-native';
import {BottomSheets, Button, Text} from '../../general';

import {useNavigation} from '@react-navigation/native';

import {fetchRequest} from '../../../../helper';
import {useQueryClient} from 'react-query';

export const DeleteDataToCashNumber = ({item}) => {
  const queryClient = useQueryClient();

  const deleteNumber = async () => {
    try {
      const response = await fetchRequest({
        path: 'billpayment/reseller/delete-sim/' + item?._id,
        method: 'DELETE',
      });
      BottomSheets.hide();
      queryClient.invalidateQueries({queryKey: ['getSimLinks']});
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{paddingHorizontal: 24, paddingBottom: 20}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        Delete Number
      </Text>
      <Text style={{marginTop: 20}} size={12} color={'#828282'}>
        Are you sure you want to delete this number, this process can’t be
        undone, you will need to Link this number again.
      </Text>

      <View style={{marginTop: 20}}>
        <View
          style={{
            height: 54,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#EFF1FB',
            borderRadius: 8,
          }}>
          <Text md color={'#4961AC'}>
            {item?.phoneNumber}
          </Text>
        </View>

        <View style={{flexDirection: 'row', marginTop: 40}}>
          <Button
            onPress={() => {
              deleteNumber();
              BottomSheets.hide();
            }}
            fontSize={14}
            type="lightGrey"
            style={{width: 122, marginRight: 10, paddingHorizontal: 0}}
            title={'Cancel'}
          />
          <Button
            onPress={() => {
              deleteNumber();
            }}
            fontSize={14}
            style={{width: 'auto', flex: 1, paddingHorizontal: 0}}
            title={'Yes - Delete'}
          />
        </View>
      </View>
    </View>
  );
};
