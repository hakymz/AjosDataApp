import React from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';

import {COLORS} from '../../../../conts';
import {
  CustomSafeAreaView,
  ErrorButton,
  PageIndicator,
  SearchInput,
  Text,
} from '../../../components/general';
import {MainHeader} from '../../../components/layouts';

import {useQuery} from 'react-query';
import {fetchRequest} from '../../../../helper';
import {ServiceBtn} from '../../../components/general/buttons/ServiceBtn';

const getAllGiftCardData = async countryCode => {
  try {
    const response = await fetchRequest({
      path: `giftcard/countries/${countryCode}/products`,
      method: 'GET',
      displayMessage: false,
      showLoader: false,
    });

    return response?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const BuyGiftCardScreen = ({navigation, route}) => {
  const {width} = useWindowDimensions();
  const {selectedCountry} = route?.params || {};

  const [state, setState] = React.useState({
    selectedGiftCardIndex: 0,
    showRightArrow: false,
    searchText: '',
  });

  const {data, error, isLoading, isFetching, refetch} = useQuery(
    'getAllGiftCardDataBuy',
    () => getAllGiftCardData(selectedCountry?.isoName),
  );
  const giftCardsData = React.useMemo(() => {
    const filterLists = data?.filter?.(item =>
      item?.productName
        ?.toLowerCase?.()
        ?.includes?.(state?.searchText?.toLowerCase?.()),
    );

    return filterLists;
  }, [state.searchText, data]);

  if (error) {
    return <ErrorButton isFetching={isFetching} refetch={refetch} />;
  }

  return (
    <CustomSafeAreaView style={{flex: 1}}>
      <MainHeader title={'Buy Gift Card'} nav />
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          marginBottom: 20,
          paddingHorizontal: 20,
          justifyContent: 'space-between',
        }}>
        {['100%', '50%', '0%'].map(per => (
          <PageIndicator
            style={{width: width / 3 - 20}}
            height={4}
            width={per}
          />
        ))}
      </View>

      <View style={{paddingHorizontal: 20, marginBottom: 20}}>
        <Text size={14} semiBold textAlign={'center'}>
          What country do you want to buy from?
        </Text>
      </View>
      <View style={{paddingHorizontal: 20}}>
        <SearchInput
          placeholder="Search for gift card"
          onChangeText={value => {
            setState(prevState => ({...prevState, searchText: value}));
          }}
        />
      </View>

      <View style={{flex: 1, paddingHorizontal: 20}}>
        {isLoading && !giftCardsData && (
          <View style={{height: 50, marginTop: 30}}>
            <ActivityIndicator color={COLORS.primary} size={'large'} />
            <Text
              size={16}
              color={COLORS.lightBlue}
              style={{marginTop: 10}}
              textAlign={'center'}>
              Loading...
            </Text>
          </View>
        )}

        {giftCardsData?.length > 0 && (
          <View style={{flex: 1}}>
            <FlatList
              contentContainerStyle={{marginTop: 20}}
              columnWrapperStyle={{justifyContent: 'space-between'}}
              data={giftCardsData}
              numColumns={3}
              renderItem={({item}) => (
                <ServiceBtn
                  image={item?.logoUrls?.[0]}
                  selected={
                    item?.productName == state?.selectedService?.productName
                  }
                  name={item?.productName}
                  onPress={() => {
                    navigation.navigate('BuyGiftCardNextScreen', item);
                  }}
                  item={item}
                />
              )}
            />
          </View>
        )}
      </View>
    </CustomSafeAreaView>
  );
};
