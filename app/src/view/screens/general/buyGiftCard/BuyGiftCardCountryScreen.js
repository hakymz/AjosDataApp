import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';

import {s} from 'react-native-size-matters';
import {COLORS} from '../../../../conts';
import {
  Button,
  CustomSafeAreaView,
  Icons,
  KeyboardAvoidingViewWrapper,
  PageIndicator,
  SearchInput,
  Text,
} from '../../../components/general';
import {MainHeader} from '../../../components/layouts';

import {useQuery} from 'react-query';
import {fetchRequest} from '../../../../helper';

const getAllGiftCardCountries = async () => {
  try {
    const response = await fetchRequest({
      path: 'giftcard/countries',
      method: 'GET',
      displayMessage: false,
      showLoader: false,
    });

    console.log(response);
    return response?.data;
  } catch (error) {
    console.log(error, 'error error');
    throw error;
  }
};

const List = ({item, onPress, selected}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        height: 52,
        borderWidth: 1,
        borderColor: selected ? COLORS.white : '#C5C6CC',
        borderRadius: 12,
        paddingHorizontal: 15,
        backgroundColor: selected ? COLORS.white : 'transparent',
        justifyContent: 'space-between',
      }}>
      {/* <SvgUri
        width="30"
        height="30"
        uri={item?.flagUrl}
        style={{borderRadius: 100}}
      /> */}
      <Text numberOfLines={1} color={'#1F2024'} size={14}>
        {item?.name}
      </Text>
      {selected && <Icons.Check size={12} />}
    </TouchableOpacity>
  );
};

export const BuyGiftCardCountryScreen = ({navigation}) => {
  const {width} = useWindowDimensions();
  const [state, setState] = React.useState({
    selectedGiftCardIndex: 0,
    showRightArrow: false,
    searchText: '',
    selectedCountry: null,
  });

  const {data, error, isLoading, refetch} = useQuery(
    'getAllGiftCardCountries',
    getAllGiftCardCountries,
  );
  const giftCardsData = React.useMemo(() => {
    const filterLists = data?.filter?.(item =>
      item?.name
        ?.toLowerCase?.()
        ?.includes?.(state?.searchText?.toLowerCase?.()),
    );

    return filterLists;
  }, [state.searchText, data]);

  return (
    <CustomSafeAreaView backgroundColor="#F5F5F5" style={{flex: 1}}>
      <MainHeader title={'Buy Gift Card'} nav />
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          marginBottom: 20,
          marginTop: 0,
          paddingHorizontal: 20,
          justifyContent: 'space-between',
        }}>
        {['50%', '0%', '0%'].map(per => (
          <PageIndicator
            style={{width: width / 3 - 20}}
            height={2}
            width={per}
          />
        ))}
      </View>

      <View style={{paddingHorizontal: 20, marginBottom: 0}}>
        <Text size={18} bold>
          Buy from a specific country
        </Text>
        <Text style={{marginTop: 5}} medium size={12} color={'#979797'}>
          Here is a compilation of all the countries where you can purchase
          from, depending on your needs.
        </Text>
      </View>

      <View style={{paddingHorizontal: 20}}>
        <SearchInput
          placeholder="Search for country"
          onChangeText={value => {
            setState(prevState => ({...prevState, searchText: value}));
          }}
        />
      </View>

      <View style={{flex: 1, paddingHorizontal: 20, paddingTop: 20}}>
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

        {error && (
          <View style={{paddingHorizontal: 30, marginTop: 50}}>
            <Button
              onPress={() => {
                refetch();
              }}
              title={'Retry'}
              style={{backgroundColor: COLORS.darkestRed}}
            />
          </View>
        )}

        {giftCardsData?.length > 0 && (
          <View style={{flex: 1}}>
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{marginTop: 0, paddingBottom: 80}}
              data={giftCardsData}
              renderItem={({item}) => (
                <List
                  selected={item?.name == state?.selectedCountry?.name}
                  name={item?.name}
                  item={item}
                  onPress={() => {
                    setState(prevState => ({
                      ...prevState,
                      selectedCountry: item,
                    }));
                  }}
                />
              )}
            />
          </View>
        )}
      </View>

      <View style={{paddingHorizontal: 20, paddingBottom: 20, marginTop: 10}}>
        <Button
          onPress={() => {
            navigation.navigate('BuyGiftCardScreen', {
              selectedCountry: state?.selectedCountry,
            });
          }}
          disabled={!state?.selectedCountry}
          title={'Next'}
        />
      </View>
    </CustomSafeAreaView>
  );
};

const style = StyleSheet.create({
  iconCon: {
    height: s(29),
    width: s(29),
    backgroundColor: '#402274',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
