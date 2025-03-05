import React from 'react';
import {
  CustomSafeAreaView,
  Icons,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../../components/general';
import {AppNav, Header, MainHeader} from '../../../components/layouts';
import {useLayouts} from '../../../../hooks';
import {
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {useQuery} from 'react-query';
import {fetchRequest} from '../../../../helper';
import {COLORS, FLYERS} from '../../../../conts';
import {useNavigation} from '@react-navigation/native';

const Card = ({item}) => {
  const {width} = useWindowDimensions();
  const number = item?.flyerType?.split('_')?.[1];
  const navigation = useNavigation();

  const selectedFyler = FLYERS?.[`template${number}`] || FLYERS?.[`template1`];

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('NewFlyers2Screen', {
          selectedFyler,
          details: item,
          templateNo: number,
        });
      }}
      style={{marginBottom: 20}}>
      <Image
        source={selectedFyler?.template}
        style={{
          height: 160,
          width: width / 2 - 25,
          borderRadius: 10,
          marginBottom: 8,
        }}
      />
      <View
        style={{
          height: 30,
          borderWidth: 1,
          borderColor: '#EAECF0',
          backgroundColor: '#FAFAFA',
          borderRadius: 10,
          justifyContent: 'center',
          paddingHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text color={COLORS.blue} bd>
          Template {number}
        </Text>
        <Icons.RedArrow style={{transform: [{rotate: '220deg'}]}} size={18} />
      </View>
    </TouchableOpacity>
  );
};
export const NewFlyersScreen = () => {
  const {minHeight} = useLayouts();
  const getFlyersPrice = async () => {
    try {
      const response = await fetchRequest({
        path: '/flyer/prices',
        method: 'GET',
        // displayMessage: false,
        showLoader: false,
      });
      return response?.data;
    } catch (error) {
      throw error;
    }
  };
  const {data: flyerPrice} = useQuery('getFlyersPrice', getFlyersPrice);
  console.log(flyerPrice);
  return (
    <CustomSafeAreaView>
      <MainHeader />
      <KeyboardAvoidingViewWrapper
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 40,
          paddingHorizontal: 20,
          minHeight: minHeight - 70,
        }}>
        <Text bd size={18}>
          Design Flyer
        </Text>

        <Text style={{marginTop: 10}} color={'#828282'} size={12} bk>
          Below are our different flyer Templates and designs for you to pick
          from. Click to view.
        </Text>
        <FlatList
          columnWrapperStyle={{justifyContent: 'space-between', marginTop: 20}}
          numColumns={2}
          data={flyerPrice}
          renderItem={({item}) => <Card item={item} />}
        />
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};
