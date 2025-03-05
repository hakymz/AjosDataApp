import React from 'react';
import {
  ScrollView,
  View,
  Image,
  Keyboard,
  StyleSheet,
  StatusBar,
} from 'react-native';

import {s} from 'react-native-size-matters';
import {COLORS, GENERAL} from '../../../../conts';
import {
  BalanceContainer,
  Button,
  CustomSafeAreaView,
  Text,
} from '../../../components/general';

import AppNav from '../../../components/layouts/general/AppNav';
import {BillsForm} from '../../../components/bills';
import {useLayouts} from '../../../../hooks';

export const BillsScreenNext = ({route}) => {
  const submitForm = React.useRef();
  const [disableButton, setDisableButton] = React.useState(true);
  const data = route?.params;
  let message =
    data?.type == 'airtime'
      ? 'Please use the phonebook icon to access your contacts from your device'
      : 'Please enter the right details to avoid “stories” 🤣';
  const {minHeight} = useLayouts();

  return (
    <CustomSafeAreaView style={{flex: 1}}>
      <StatusBar barStyle={'dark-content'} />
      <AppNav title={<Text semiBold>{data?.title}</Text>} line />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: GENERAL.platform == 'ios' ? 40 : 20,
          paddingHorizontal: 20,
          minHeight: minHeight - 80,
        }}>
        <View style={style.imageCon}>
          <Image
            style={{
              height: s(40),
              width: s(40),
              resizeMode: 'contain',
              borderRadius: 100,
            }}
            source={data?.externalData ? {uri: data?.image} : data?.image}
          />
          <Text semiBold>
            {'  '}
            <Text color="#969696" semiBold>
              Operator:
            </Text>{' '}
            {data?.name}
          </Text>
        </View>

        <BillsForm
          data={data}
          ref={submitForm}
          setDisableButton={setDisableButton}
        />
        {/* Details Section */}

        <Text style={{marginTop: 20, paddingHorizontal: 20}} size={12} semiBold>
          {message}
        </Text>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingTop: 40,
            paddingHorizontal: 30,
          }}>
          <BalanceContainer />
          <Button
            disabled={disableButton}
            textColor={'white'}
            type={disableButton ? 'grey' : 'black'}
            onPress={() => {
              Keyboard.dismiss();
              submitForm.current();
            }}
            title="Purchase"
          />
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
  imageCon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    marginTop: 10,
  },
});
