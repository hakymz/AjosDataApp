import React from 'react';
import {TextInput, View} from 'react-native';
import {BottomSheets, Button, Icons, Text} from '../../general';
import {PageList} from '../../lists';
import {COLORS, FONTS} from '../../../../conts';
export const AddNumberForBulkSms = ({currentContacts = [], onValueChange}) => {
  const [state, setState] = React.useState({
    contacts: currentContacts ? currentContacts : [],
    phone: '',
  });
  return (
    <View>
      <Text textAlign={'center'} size={22} bold>
        Add-numbers manually
      </Text>
      <Text style={{marginTop: 5}} color={'#868D95'} textAlign={'center'}>
        Input the number and hit enter to add a different number and so on.
      </Text>
      <View style={{paddingHorizontal: 20, marginTop: 30}}>
        <View
          style={{
            height: 250,
            borderWidth: 1,
            borderRadius: 12,
            borderColor: '#E9F1FF',
            marginBottom: 20,
            paddingHorizontal: 20,
            paddingVertical: 20,
          }}>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {state?.contacts?.map((number, index) => (
              <Text medium size={14} style={{marginRight: 5}}>
                {number}
                {state?.contacts?.length - 1 > index && ','}
              </Text>
            ))}
          </View>
          <TextInput
            placeholderTextColor={COLORS.darkBlue}
            placeholder={state?.contacts?.length < 1 ? 'Type Number here' : ''}
            onKeyPress={({nativeEvent}) => {
              if (nativeEvent.key == 'Backspace' && state?.phone == '') {
                let newNumbers = [...state.contacts];

                newNumbers?.pop();
                setState(prevState => ({
                  ...prevState,
                  contacts: newNumbers,
                }));
              }
            }}
            value={state?.phone}
            keyboardType="default"
            onChangeText={value => {
              if (!isNaN(value * 1)) {
                setState(prevState => ({...prevState, phone: value}));
              }
              let splitNumbers = value?.split(' ');
              splitNumbers = splitNumbers?.filter(item => item);

              if (value.includes(' ') && value?.length > 9) {
                setState(prevState => ({
                  ...prevState,
                  phone: '',
                  contacts: [...prevState?.contacts, splitNumbers],
                }));

                // setContacts([...contacts, ...splitNumbers]);
              }
            }}
            onEndEditing={({nativeEvent: {eventCount, target, text}}) => {
              let value = text;
              if (value?.length > 9) {
                setState(prevState => ({
                  ...prevState,
                  phone: '',
                  contacts: [...prevState?.contacts, value?.trim?.()],
                }));
              }
            }}
            style={{
              fontSize: 16,
              color: COLORS.darkBlue,
              fontFamily: FONTS.PLUS_JAKARTA_SANS_FONTS.medium,
              // backgroundColor: 'red',
            }}
          />
        </View>
        <Button
          title={'Add Numbers'}
          onPress={() => {
            BottomSheets.hide();
            onValueChange(state?.contacts);
          }}
        />
      </View>
    </View>
  );
};
