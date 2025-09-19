import React from 'react';
import {
  Image,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS, FONTS} from '../../../../conts';
import {
  BottomSheets,
  CustomSafeAreaView,
  Icons,
  InfiniteFlatList,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../../components/general';
import {MainHeader} from '../../../components/layouts';
import {fetchRequest, formatAmount, parseJSON} from '../../../../helper';
import {useQuery, useQueryClient} from 'react-query';
import {
  DollarCardDetails,
  FreezeCard,
  TerminateCard,
  TopupDollarCard,
  TransactionSummary,
  WithdrawDollarCard,
} from '../../../components/bottomSheetModal/modalContents';
import {BlurView} from '@react-native-community/blur';
import moment from 'moment';
const List = ({item}) => {
  console.log(item?.status);
  return (
    <TouchableOpacity
      onPress={() => {
        BottomSheets.show({
          component: <TransactionSummary details={item} />,
          disableScrollIfPossible: false,
          showCloseBtn: false,
        });
      }}
      style={{
        height: 80,
        backgroundColor: COLORS.white,
        marginBottom: 15,
        borderRadius: 16,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#E9F1FF',
        justifyContent: 'center',
        paddingVertical: 10,
      }}>
      <Text numberOfLines={1} color={'#848A94'} size={12}>
        {item?.description}
      </Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flex: 1}}>
          <Text
            style={{marginTop: 4}}
            numberOfLines={1}
            fontWeight={500}
            size={14}
            color={COLORS.darkBlue}>
            ${item?.amount}
          </Text>
          <Text style={{marginTop: 4}} color={'#848A94'} size={12}>
            {moment(item?.created_at).format('hh:mma')} |{' '}
            {moment(item?.created_at).format('DD-MMM-YYYY')}
          </Text>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {item?.status == 'debit' ? (
            <Icons.TransactionOut />
          ) : (
            <Icons.TransactionIn />
          )}

          <Image
            source={{uri: item?.imageUrl || item?.image}}
            style={{height: 43, width: 43, borderRadius: 40}}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ActionBtn = ({icon, title, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        height: 50,
        backgroundColor: COLORS.white,
        paddingHorizontal: 15,
        borderRadius: 32,
        flexDirection: 'row',
        alignItems: 'center',
        width: 160,
      }}>
      {icon}
      <Text style={{marginLeft: 5}} size={12} bold color={'#151521'}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const getDollarCards = async () => {
  try {
    const response = await fetchRequest({
      path: '/virtual-card',
      method: 'GET',
      showLoader: false,
    });

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getDollarDetails = async id => {
  try {
    const response = await fetchRequest({
      path: `virtual-card/details/${id}`,
      method: 'GET',
      showLoader: false,
      displayMessage: false,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

const getDollarCardRates = async () => {
  try {
    const response = await fetchRequest({
      path: `virtual-card/fee`,
      method: 'GET',
      showLoader: false,
    });

    return response?.data;
  } catch (error) {
    throw error;
  }
};

const Card = ({item, totalCards}) => {
  const {width} = useWindowDimensions();
  const queryClient = useQueryClient();
  let cardDetails = parseJSON(item?.body);

  const {data} = useQuery({
    queryKey: [item?.id],
    queryFn: () => getDollarDetails(item?.id),
  });

  const unfreezeCard = async () => {
    try {
      const response = await fetchRequest({
        path: `virtual-card/unfreeze/${item?.id}`,
      });
      queryClient.invalidateQueries({queryKey: ['getDollarCards']});
    } catch (error) {
      throw error;
    }
  };

  return (
    <View
      style={{
        height: 183,
        marginRight: 10,
        overflow: 'hidden',
        borderRadius: 18,
        width: totalCards == 1 ? width - 90 : width - 120,
      }}>
      {item?.status == 'freeze' && (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              position: 'absolute',
              zIndex: 10,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <TouchableOpacity
            onPress={unfreezeCard}
            style={{
              height: 50,
              backgroundColor: COLORS.white,
              zIndex: 20,
              paddingHorizontal: 20,
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 32,
            }}>
            <Icons.Freeze2 size={24} />
            <Text style={{marginLeft: 5}} bold color={'#151521'}>
              Unfreeze Card
            </Text>
          </TouchableOpacity>
          <BlurView
            blurType="light"
            blurAmount={4}
            style={StyleSheet.absoluteFillObject}
          />
          <View
            style={[
              StyleSheet.absoluteFillObject,
              {backgroundColor: 'rgba(0,0,0,0.3)'}, // match Figma overlay
            ]}
          />
        </View>
      )}

      <Image
        style={{
          height: 183,
          width: '100%',
          borderRadius: 18,
          position: 'absolute',
        }}
        source={require('../../../../assets/images/others/cardBg.png')}
      />
      <View style={{flex: 1, paddingHorizontal: 20, paddingVertical: 20}}>
        <Text
          style={{marginTop: 20}}
          textAlign={'center'}
          fontType={FONTS.MONTSERRAT}
          semiBold
          size={12}
          color={'#111B21'}>
          {cardDetails?.card?.name}
        </Text>
        <Text
          fontType={FONTS.MONTSERRAT}
          bold
          style={{marginTop: 20}}
          textAlign={'center'}
          size={30}
          color={'#111B21'}>
          ${formatAmount(data?.data?.balance)}
        </Text>
      </View>
    </View>
  );
};

const CardMenus = ({selectedCard}) => {
  const {data: rate} = useQuery({
    queryKey: ['getDollarCardRates'],
    queryFn: getDollarCardRates,
  });

  return (
    selectedCard?.status == 'active' && (
      <View style={{alignItems: 'center'}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
          }}>
          <ActionBtn
            onPress={() => {
              BottomSheets.show({
                component: <TopupDollarCard rate={rate} card={selectedCard} />,
              });
            }}
            icon={<Icons.AddCircle size={30} />}
            title={'Add funds'}
          />
          <View style={{width: 15}} />
          <ActionBtn
            onPress={() => {
              BottomSheets.show({
                component: (
                  <WithdrawDollarCard rate={rate} card={selectedCard} />
                ),
              });
            }}
            icon={<Icons.MinusCircle size={30} />}
            title={'Widthdraw'}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 10,
          }}>
          <ActionBtn
            onPress={() => {
              BottomSheets.show({
                component: <FreezeCard card={selectedCard} />,
              });
            }}
            icon={<Icons.Freeze size={24} />}
            title={'Freeze Card'}
          />
          <View style={{width: 15}} />
          <ActionBtn
            onPress={() => {
              BottomSheets.show({
                component: <TerminateCard card={selectedCard} />,
              });
            }}
            icon={<Icons.Delete2 size={24} />}
            title={'Terminate Card'}
          />
        </View>
      </View>
    )
  );
};

const getHistory = async ({pageParam = 1, id}) => {
  try {
    if (!id) {
      return false;
    }
    const response = await fetchRequest({
      path: `virtual-card/transactions/${id}?page=0&limit=10`,
      showLoader: false,
      displayMessage: false,
      method: 'GET',
    });

    return {...response?.data, current_page: pageParam};
  } catch (error) {
    console.log(error, 'erroor pkkkk');
    throw error;
  }
};
export const DollarCardDetailsScreen = ({navigation}) => {
  const [state, setState] = React.useState({selectedCard: null});
  const {width} = useWindowDimensions();

  const {data: card} = useQuery({
    queryKey: ['getDollarCards'],
    queryFn: getDollarCards,
  });

  if (card?.data?.length === 0) {
    navigation.replace('DollarCardScreen');
  }

  React.useEffect(() => {
    setState(prevState => ({...prevState, selectedCard: card?.data?.[0]}));
  }, [card]);

  return (
    <CustomSafeAreaView style={{backgroundColor: COLORS.background}}>
      <MainHeader nav title={'Dollar Card'} />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 20,
          marginTop: 20,
          justifyContent: 'space-between',
          paddingHorizontal: 20,
        }}>
        <Text size={25} semiBold color={COLORS.darkBlue}>
          Cards
        </Text>
        {state?.selectedCard?.status == 'active' && (
          <TouchableOpacity
            onPress={() => {
              BottomSheets.show({
                component: <DollarCardDetails card={state?.selectedCard} />,
              });
            }}
            style={{
              height: 35,
              backgroundColor: COLORS.white,
              paddingHorizontal: 18,
              borderRadius: 32,
              justifyContent: 'center',
            }}>
            <Text size={12} bold color={COLORS.dark2}>
              View Card Details
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
          }}
          decelerationRate="fast"
          snapToInterval={width - 120}
          onScroll={({nativeEvent}) => {
            if (!nativeEvent?.contentOffset) return;

            const index = Math.round(nativeEvent.contentOffset.x / width);

            setState(prevState => ({
              ...prevState,
              selectedCard: card?.data?.[index],
            }));
          }}
          showsHorizontalScrollIndicator={false}
          horizontal>
          {card?.data?.map(item => (
            <Card item={item} totalCards={card?.data?.length} />
          ))}
        </ScrollView>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('DollarCardScreen');
          }}
          style={{
            height: 183,
            width: 38,
            borderWidth: 1.4,
            borderRadius: 18,
            borderStyle: 'dashed',
            justifyContent: 'center',
            marginRight: 20,
          }}>
          <View
            style={{
              width: 100,
              transform: [{rotate: '-90deg'}],
              left: -33,
              top: -20,
            }}>
            <Text size={12} medium style={{}} color={COLORS.dark2}>
              Add Card
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* Card menus */}
      <CardMenus selectedCard={state?.selectedCard} />

      <View
        style={{
          marginTop: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
        }}>
        <Text medium size={18} color={COLORS.dark}>
          Transactions
        </Text>
        <Text style={{opacity: 0.5}} size={12} color={COLORS.dark}>
          See all
        </Text>
      </View>
      <InfiniteFlatList
        keyProps="result"
        renderItem={({item}) => <List item={item} />}
        request={({pageParam}) =>
          getHistory({pageParam, id: state?.selectedCard?.id})
        }
        queryKey={`getHistory${state?.selectedCard?.id}`}
      />
    </CustomSafeAreaView>
  );
};

const style = StyleSheet.create({
  con: {
    height: 310,
    backgroundColor: COLORS.yellow,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  iconCon: {
    height: 42,
    width: 42,
    backgroundColor: COLORS.white,
    borderRadius: 100,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
