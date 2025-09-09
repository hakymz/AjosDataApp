import React from 'react';
import {Image, View} from 'react-native';
import {BottomSheets, Button, Text} from '../../general';
import LottieView from 'lottie-react-native';
import {fetchRequest, openBrowser} from '../../../../helper';
import {GENERAL} from '../../../../conts';
import {useQueryClient} from 'react-query';
export const FreezeCard = ({card}) => {
  const queryClient = useQueryClient();
  const freezeCard = async id => {
    try {
      const response = await fetchRequest({
        path: `virtual-card/freeze/${card?.id}`,
      });
      queryClient.invalidateQueries({queryKey: ['getDollarCards']});
    } catch (error) {
      throw error;
    }
  };
  return (
    <View style={{paddingHorizontal: 24}}>
      <Text textAlign={'center'} size={25} semiBold>
        Freeze Card
      </Text>
      <Text style={{marginTop: 15}} color={'#868D95'} textAlign={'center'}>
        What this means for your card.
      </Text>
      <Text medium size={14} color={'#868D95'} style={{marginTop: 40}}>
        You will not be able to make card payments
      </Text>
      <Text medium size={14} color={'#868D95'} style={{marginTop: 20}}>
        Your online subscriptions with this card will not work.
      </Text>

      <View style={{marginTop: 40}}>
        <Button
          onPress={() => {
            freezeCard();
            BottomSheets.hide();
          }}
          fontSize={14}
          title={'Freeze Card'}
        />
      </View>
    </View>
  );
};
