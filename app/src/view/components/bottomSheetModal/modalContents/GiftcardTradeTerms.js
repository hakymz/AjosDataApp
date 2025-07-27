import React from 'react';
import {View, Image} from 'react-native';
import {BottomSheets, Button, CheckBox, Text} from '../../general';
import {PageList} from '../../lists';
import {fetchRequest} from '../../../../helper';
import {useUser} from '../../../../hooks';
import {useNavigation} from '@react-navigation/native';
import {COLORS, CONTACTS} from '../../../../conts';

export const GiftcardTradeTerms = ({data, onPress}) => {
  const {user} = useUser();
  const [state, setState] = React.useState({isChecked: false});

  return (
    <View style={{paddingHorizontal: 20}}>
      <Text textAlign={'center'} size={22} bold>
        Trade Terms ⚠️
      </Text>
      <Text style={{marginTop: 20}} size={12} color={'#000'}>
        {data?.cardSubCategory?.termsOfTransaction}
      </Text>
      <View
        style={{
          marginTop: 20,
          marginBottom: 30,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <CheckBox
          isChecked={state.isChecked}
          onPress={() => {
            setState(prevState => ({
              ...prevState,
              isChecked: !prevState.isChecked,
            }));
          }}
        />
        <Text
          onPress={() => {
            openLink(CONTACTS.termsLink);
          }}
          color={'#7F8192'}
          fontWeight={'500'}
          style={{paddingLeft: 10}}
          size={12}>
          I’ve read and agree to the Trade Terms
        </Text>
      </View>
      <Button
        onPress={() => {
          BottomSheets.hide();
          onPress();
        }}
        disabled={!state?.isChecked}
        title={'Submit Gift Card'}
      />
    </View>
  );
};
