import React from 'react';
import {Image, View} from 'react-native';
import {BottomSheets, Button, Text} from '../../general';
import LottieView from 'lottie-react-native';
import {fetchRequest, openBrowser, openSuccessScreen} from '../../../../helper';
import {GENERAL} from '../../../../conts';
import {useQueryClient} from 'react-query';
import {useNavigation} from '@react-navigation/native';
export const TerminateCard = ({card}) => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const terminateCard = async id => {
    try {
      const response = await fetchRequest({
        path: `virtual-card/terminate/${card?.id}`,
      });
      queryClient.invalidateQueries({queryKey: ['getDollarCards']});
      openSuccessScreen({
        navigation,
        title: 'Card Terminated 🚫',
        subTitle:
          'We have successfully deleted this dollar card and reversed any remaining money to your wallet.',
        btnTitle: 'Create a New card',
        proceed: () => {
          navigation.navigate('DollarCardScreen');
        },
      });
    } catch (error) {
      throw error;
    }
  };

  React.useEffect(() => {}, []);
  return (
    <View style={{paddingHorizontal: 24}}>
      <Text textAlign={'center'} size={25} semiBold>
        Terminate Card 🚫
      </Text>
      <Text style={{marginTop: 10}} color={'#868D95'} textAlign={'center'}>
        What this means for your card.
      </Text>
      <Text medium size={14} color={'#868D95'} style={{marginTop: 40}}>
        You will not be able to use this card details anymore as this card will
        be deleted alongside your information.
      </Text>
      <Text medium size={14} color={'#868D95'} style={{marginTop: 20}}>
        You will need to create a new card to gain access to our services, if
        you don’t have another card created.
      </Text>

      <View style={{marginTop: 40}}>
        <Button
          onPress={() => {
            terminateCard();
            BottomSheets.hide();
          }}
          fontSize={14}
          title={'Terminate this card'}
        />
      </View>
    </View>
  );
};
