import React from 'react';
import {View, Image} from 'react-native';
import {BottomSheets, Button, Text} from '../../general';
import {useNavigation} from '@react-navigation/native';

export const NoAddress = ({}) => {
  const navigation = useNavigation();

  return (
    <View>
      <View style={{paddingHorizontal: 20}}>
        <Text textAlign={'center'} size={22} bold>
          No Address found!
        </Text>
        <Text
          size={14}
          style={{marginTop: 5}}
          color={'#868D95'}
          textAlign={'center'}>
          Please click the button below to add your address in order to proceed.
        </Text>
      </View>

      <View
        style={{
          marginTop: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          style={{height: 270, width: 270}}
          source={require('../../../../assets/images/others/park.png')}
        />
      </View>
      <View style={{paddingHorizontal: 20}}>
        <Button
          onPress={() => {
            BottomSheets.hide();
            navigation.navigate('ProfileDetailsScreen');
          }}
          title={'Update my Address'}
        />
      </View>
    </View>
  );
};
