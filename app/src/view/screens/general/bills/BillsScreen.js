import React from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';

import {s} from 'react-native-size-matters';
import {COLORS, GENERAL, INTERNET, NETWORKS} from '../../../../conts';
import {
  CustomSafeAreaView,
  NavigationButton,
  Text,
} from '../../../components/general';
import {Header} from '../../../components/layouts';

import {useNavigation} from '@react-navigation/native';
import {useBillsData} from '../../../../hooks';
import {Image} from '../../../components/general/image';
import Line from '../../../components/general/others/Line';
import {useQuery} from 'react-query';

const Card = ({title, content}) => {
  return (
    <View style={[styles.list]}>
      <Text bold color={COLORS.primary}>
        {title}
      </Text>
      <View
        style={{
          marginTop: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {content}
      </View>
    </View>
  );
};

const filterName = (name, type) => {
  if (!name) {
    return '';
  }
  if (type == 'tv') {
    return name.split(' ')[0];
  }
  if (name.substring(name.indexOf('-') + 1).length > 10) {
    return name.split('-')[0];
  } else {
    return name.substring(name.indexOf('-') + 1);
  }
};
const ActionBtn = ({data, externalData, marginRight}) => {
  const name = externalData ? filterName(data?.name, data?.type) : data?.name;
  const navigation = useNavigation();
  return (
    <View style={{flex: 1, alignItems: 'center', marginRight}}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate('BillsScreenNext', {
            ...data,
            name,
            productName: data?.name,
            externalData,
          })
        }>
        <Image
          style={{
            height: s(50),
            width: s(50),
            resizeMode: 'contain',
            borderRadius: 100,
          }}
          source={externalData ? {uri: data?.image} : data?.image}
        />
      </TouchableOpacity>

      <Text style={{marginTop: 5}} semiBold size={12} numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
};

export const BillsScreen = () => {
  const {getTvData, getElectricityData} = useBillsData();

  const {data: electricityData, error} = useQuery(
    'getElectricityData',
    getElectricityData,
  );
  const {data: tvData, error: tvDataError} = useQuery('getTvData', getTvData);

  const itemsData = [
    {title: 'Data and Airtime', data: NETWORKS, type: 'airtime'},
    {title: 'Internet', data: INTERNET, type: 'internet'},
    {
      title: 'Cable Bills',
      data: tvData,
      type: 'tv',
      externalData: true,
      marginRight: 20,
    },
    {
      title: 'Utility | Electricity',
      data: electricityData,
      type: 'electricity',
      externalData: true,
      marginRight: 20,
    },
  ];

  return (
    <CustomSafeAreaView style={{flex: 1, backgroundColor: COLORS.background}}>
      <Header text="Pay Bills" />

      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: GENERAL.platform == 'ios' ? 40 : 20,
        }}>
        <View
          style={{
            height: 125,
            backgroundColor: COLORS.black,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}>
          <View style={styles.nav}>
            <NavigationButton
              style={{backgroundColor: '#162425', width: 100}}
              title={'Back'}
              left
            />
            <Text style={{}} size={13} color={COLORS.white}>
              How can we serve you today?
            </Text>
          </View>
        </View>

        <View style={{...styles.con}}>
          <FlatList
            data={itemsData}
            renderItem={({item, index}) => {
              return (
                <>
                  <Card
                    title={item?.title}
                    content={
                      <ScrollView
                        contentContainerStyle={{minWidth: '100%'}}
                        horizontal
                        showsHorizontalScrollIndicator={false}>
                        {item?.data?.map((data, index) => (
                          <ActionBtn
                            externalData={item?.externalData}
                            marginRight={item?.marginRight}
                            data={{
                              ...data,
                              type: item?.type,
                              title: item?.title,
                            }}
                          />
                        ))}
                      </ScrollView>
                    }
                  />
                  {index != 3 && <Line />}
                </>
              );
            }}
          />
        </View>
        <Text size={12} semiBold textAlign={'center'}>
          Swipe left for more options on each category
        </Text>
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  con: {
    backgroundColor: COLORS.white,
    paddingVertical: 20,
    marginBottom: 0,
    marginHorizontal: 20,
    top: -30,
    borderRadius: 20,
  },
  list: {
    height: s(140),
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
