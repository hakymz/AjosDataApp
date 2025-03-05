import React from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';
import {CustomSafeAreaView, MyIcons, Text} from '../../../components/general';
import {AppNav} from '../../../components/layouts';
import LottieView from 'lottie-react-native';
import {s} from 'react-native-size-matters';
import {COLORS} from '../../../../conts';
import moment from 'moment';
import {TransactionListSection} from '../../../components/lists';

export const SummaryScreen = ({navigation, route}) => {
  const {data, name, pageTitle} = route?.params;
  console.log(data[0]?.metaInfo);
  const sections = React.useMemo(() => {
    const brokenSections = [];
    let currentSection = [];
    let lastDate = moment(new Date()).format('MM-DD-YYYY');
    data?.forEach?.((element, index) => {
      if (lastDate != moment(element?.created_at).format('MM-DD-YYYY')) {
        brokenSections.push([
          ...currentSection,
          {
            date: element?.created_at,
            ...element,
          },
        ]);
        currentSection = [];
      } else {
        currentSection.push({
          date: element?.created_at,
          ...element,
        });
      }
      lastDate = moment(element?.created_at).format('MM-DD-YYYY');

      if (data?.length - 1 == index && currentSection.length > 0) {
        brokenSections.push(currentSection);
      }
    });

    return brokenSections;
  }, [data]);

  return (
    <CustomSafeAreaView>
      <AppNav title={<Text semiBold>{name}</Text>} line />

      {data?.length == 0 && (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            marginBottom: 150,
          }}>
          <LottieView
            resizeMode="cover"
            style={{
              width: s(270),
              height: s(270),
            }}
            autoPlay
            loop={true}
            source={require('../../../../assets/lottieFiles/others/box.json')}
          />
          <Text style={{top: -20}} semiBold size={16}>
            No Transaction found 🙉
          </Text>
        </View>
      )}
      {data?.length > 0 && (
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 40,
          }}
          data={sections}
          renderItem={({item}) => (
            <TransactionListSection
              onPress={data => {
                navigation.navigate('SummaryNextScreen', {
                  data: {...data, pageTitle: pageTitle || data?.category},
                });
              }}
              iconConStyle={{backgroundColor: 'white'}}
              item={item}
            />
          )}
        />
      )}
    </CustomSafeAreaView>
  );
};
