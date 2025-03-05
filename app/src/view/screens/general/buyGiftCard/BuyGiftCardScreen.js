import React from 'react';
import {
  CustomSafeAreaView,
  SearchInput,
  Text,
} from '../../../components/general';
import {AppNav} from '../../../components/layouts';
import {ActivityIndicator, FlatList, ScrollView, View} from 'react-native';
import {COLORS, GENERAL} from '../../../../conts';
import {fetchRequest} from '../../../../helper';
import {useQuery} from 'react-query';
import {GiftCard} from '../../../components/giftCard';
import {useOrientation} from '../../../../hooks';
export const BuyGiftCardScreen = ({navigation, route}) => {
  const selectedCountry = route?.params;
  const {screenOrientation} = useOrientation();

  const [search, setSearch] = React.useState('');

  const getGiftCardDetails = async () => {
    try {
      const response = await fetchRequest({
        path: `giftcard/countries/${selectedCountry?.isoName}/products`,
        method: 'GET',
        displayMessage: false,
        showLoader: false,
      });

      if (response?.status == 'success' && response?.data?.length > 0) {
        return response?.data;
      }
    } catch (error) {
      throw error;
      //send the request after some seconds
    }
  };

  const {data, error, isFetching, isLoading, isRefetching} = useQuery(
    'getGiftCardDetails',
    getGiftCardDetails,
  );

  const filteredList = React.useMemo(() => {
    return data?.filter(item =>
      item?.productName?.toLowerCase?.()?.includes?.(search?.toLowerCase?.()),
    );
  }, [data, search]);

  return (
    <CustomSafeAreaView>
      <AppNav title={'Buy Gift Cards'} line />
      {isLoading ? (
        <View style={{paddingTop: 40}}>
          <ActivityIndicator size={'large'} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 60,
          }}>
          <Text semiBold color={'#666766'}>
            Select Gift Card
          </Text>
          <SearchInput
            title={'Search Gift Card'}
            style={{marginHorizontal: 0}}
            onChangeText={value => setSearch(value)}
          />
          <FlatList
            contentContainerStyle={{paddingTop: 30}}
            key={screenOrientation == GENERAL.landScape ? 'h' : 'v'}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}
            numColumns={screenOrientation == GENERAL.landScape ? 4 : 3}
            data={filteredList}
            renderItem={({item}) => (
              <GiftCard
                item={{...item}}
                onPress={() =>
                  navigation.navigate('BuyGiftCardNextScreen', {
                    ...item,
                    ...selectedCountry,
                  })
                }
              />
            )}
          />
        </ScrollView>
      )}
    </CustomSafeAreaView>
  );
};
