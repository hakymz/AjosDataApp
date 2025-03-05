import React from 'react';
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import {s} from 'react-native-size-matters';
import {COLORS, FONTS, GENERAL} from '../../../../conts';
import {
  CircleButton,
  CustomSafeAreaView,
  DisplayAmount,
  Icons,
  MyIcons,
  Text,
} from '../../../components/general';

import {useLayouts} from '../../../../hooks';
import {AppNav} from '../../../components/layouts';
import {formatAmount} from '../../../../helper';
// import Intercom from '@intercom/intercom-react-native';

export const TopUpAmountScreen = ({navigation, route}) => {
  const {proceed} = route?.params || {};
  const {minHeight} = useLayouts();
  const [state, setState] = React.useState({amount: ''});

  const addOrDeletePin = number => {
    if (number == '') {
      return false;
    }
    if (number == 'del') {
      let newAmount = state?.amount?.split('');
      newAmount?.pop();
      newAmount = newAmount?.join('');
      setState(prevState => ({
        ...prevState,
        amount: newAmount,
      }));
    } else {
      setState(prevState => ({
        ...prevState,
        amount: prevState?.amount + number,
      }));
    }
  };

  const Button = ({number}) => {
    return (
      <View
        style={{
          flex: 1,
          height: s(70),
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 10,
        }}>
        <TouchableOpacity
          onPress={() => addOrDeletePin(number)}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: 70,
            width: 70,
            borderRadius: 100,
            backgroundColor: '#F8F8F8',
          }}>
          {number == 'del' ? (
            <View
              style={{
                height: s(55),
                width: s(55),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icons.RedArrow size={22} />
            </View>
          ) : (
            <Text
              size={25}
              md
              color={'#231F20'}
              lineHeight={30}
              textAlign="center">
              {number}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const DisplayButton = () => {
    return (
      <View style={{marginTop: 20}}>
        <FlatList
          numColumns={3}
          data={['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del']}
          renderItem={({item}) => {
            return <Button number={item} />;
          }}
        />
      </View>
    );
  };

  React.useEffect(() => {
    Intercom.setLauncherVisibility('GONE');
    return () => {
      Intercom.setLauncherVisibility('VISIBLE');
    };
  }, []);
  return (
    <CustomSafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <AppNav
        backgroundColor={COLORS.white}
        title={
          <Text color={'#231F20'} size={18} blk>
            Top-up Wallet
          </Text>
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
          paddingHorizontal: 20,
          minHeight: minHeight - 40,
        }}>
        <View style={{alignItems: 'center', marginTop: 40}}>
          <View
            style={{
              height: 30,
              borderWidth: 1,
              width: 140,
              borderRadius: 6,
              borderColor: '#7F8192',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text bd color={'#7F8192'}>
              Enter Amount
            </Text>
          </View>
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 40,
            flexDirection: 'row',
          }}>
          <Text style={{top: -13}} size={22} bd color={'#4961AC'}>
            {GENERAL.nairaSign}{' '}
          </Text>
          <Text numberOfLines={1} color={'#4961AC'} md size={58}>
            {formatAmount(state?.amount)}
          </Text>
        </View>
        <View
          style={{
            marginTop: 40,
          }}>
          <DisplayButton />
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <TouchableOpacity
            disabled={!state?.amount}
            onPress={() => {
              proceed(state?.amount);
            }}
            style={{
              height: 80,
              width: 80,
              backgroundColor: state?.amount > 0 ? COLORS.primary : '#7A7A7A',
              borderRadius: 100,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: state?.amount > 0 ? '#820300' : '#7A7A7A',
              shadowOpacity: 0.4,
              shadowRadius: 15,
              elevation: 15,
              shadowOffset: {width: 10, height: 10},
            }}>
            <Text md size={14} color={COLORS.white}>
              FUND
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  displayCon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 230,
    height: 60,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 40,
    borderRadius: 15,
  },
});
