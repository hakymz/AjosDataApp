import React from 'react';
import {View} from 'react-native';
import {BottomSheets, Icons, Text} from '../../general';
import {PageList} from '../../lists';
import {AddNumberForBulkSms} from './AddNumberForBulkSms';
import DocumentPicker, {types} from 'react-native-document-picker';

export const AddNumberForBulkSmsOption = ({onValueChange, currentContacts}) => {
  const pickerDoc = async () => {
    try {
      const pickerResult = await DocumentPicker.pick({
        allowMultiSelection: false,
      });

      const stringFile = await RNFS.readFile(pickerResult?.[0]?.uri);
      BottomSheets.hide();
      const phoneNumberRegex =
        /(\+?\d{1,2}\s?)?(\(?\d{3}\)?|\d{3})([-.\s]?\d{3}[-.\s]?\d{4})/g;

      const phoneNumbers = stringFile.match(phoneNumberRegex);

      onValueChange(phoneNumbers);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View>
      <Text textAlign={'center'} size={22} bold>
        Add-numbers/contacts
      </Text>
      <Text style={{marginTop: 5}} color={'#868D95'} textAlign={'center'}>
        Choose one out of the options below
      </Text>
      <View style={{paddingHorizontal: 20, marginTop: 50}}>
        <PageList
          onPress={() => {
            BottomSheets.show({
              component: (
                <AddNumberForBulkSms
                  onValueChange={onValueChange}
                  currentContacts={currentContacts}
                />
              ),
            });
          }}
          style={{height: 56}}
          children={
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <Icons.AddNumber />
              <Text medium size={16}>
                Add numbers manually
              </Text>
            </View>
          }
          rightIcon={<></>}
        />

        <PageList
          onPress={() => {
            pickerDoc();
          }}
          style={{height: 56}}
          children={
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <Icons.Notes />
              <Text medium size={16}>
                Upload a .CSV file
              </Text>
            </View>
          }
          rightIcon={<></>}
        />
      </View>
    </View>
  );
};
