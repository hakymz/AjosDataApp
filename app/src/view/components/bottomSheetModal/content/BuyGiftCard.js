import React from 'react';
import {View} from 'react-native';
import {Button, CustomPicker, Icons, Text} from '../../general';
import {COLORS, FONTS} from '../../../../conts';
import {s} from 'react-native-size-matters';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

import {BottomSheets} from '../BottomSheets';

import {useNavigation} from '@react-navigation/native';
import CustomDatePicker from '../../general/inputs/DatePicker';
import {useTradeData} from '../../../../hooks';
import Toast from '../../toast/Toast';

export const BuyGiftCard = ({}) => {
  const navigation = useNavigation();

  const [state, setState] = React.useState({
    selectedCountry: null,
    error: false,
  });

  const {countries, getAllGiftCardDataToBuy, getAllCountries} = useTradeData();

  React.useEffect(() => {
    getAllCountries();
  }, []);
  return (
    <View style={{height: '100%'}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
        }}>
        <Text
          textAlign="center"
          fontType={FONTS.FREDOKA}
          color={COLORS.black}
          size={20}
          lineHeight={24}
          style={{
            marginTop: 10,
            flex: 1,
          }}>
          Giftcard Trade
        </Text>
      </View>
      <BottomSheetScrollView>
        <Text
          medium
          textAlign="center"
          style={{marginTop: 30, paddingHorizontal: 30}}>
          What country do you want to buy from?
        </Text>

        {/* Details Section */}
        <View
          style={{
            borderRadius: 15,
            backgroundColor: '#F3F7FF',
            marginTop: 20,
            padding: 20,
            paddingHorizontal: 20,
            justifyContent: 'center',
            height: s(154),
          }}>
          <View style={{width: '100%'}}>
            <Text
              textAlign="center"
              lineHeight={14}
              color={COLORS.primary}
              medium
              size={12}
              numberOfLines={3}
              style={{marginBottom: 20, marginTop: 10}}>
              This would help us filter all the card available for you from the
              Purchase-country of choice.
            </Text>

            <CustomPicker
              data={countries}
              error={state.error}
              value={state.selectedCountry}
              placeholder="Select Country"
              onValueChange={value => {
                setState(prevState => ({
                  ...prevState,
                  selectedCountry: value,
                  error: value ? false : true,
                }));
              }}
            />
          </View>
        </View>

        <View style={{paddingHorizontal: 20}}>
          <Button
            style={{marginTop: 20}}
            onPress={() => {
              if (state.selectedCountry) {
                BottomSheets.hide();
                navigation.navigate('BuyGiftCardScreen', {
                  selectedCountry: state?.selectedCountry,
                });
              } else {
                setState(prevState => ({...prevState, error: true}));
                Toast.show('error', 'Please select country');
              }
            }}
            title="Start Trade"
            rightIcon={<Icons.CircleArrowYellow />}
          />
        </View>
      </BottomSheetScrollView>
    </View>
  );
};
