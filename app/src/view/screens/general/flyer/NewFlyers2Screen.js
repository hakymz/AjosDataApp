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
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('CreateFlyersScreen', {...item});
      }}
      style={{marginBottom: 20}}>
      <Image
        source={item?.image}
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
          Sample - {item?.name}
        </Text>
        <Icons.RedArrow style={{transform: [{rotate: '220deg'}]}} size={18} />
      </View>
    </TouchableOpacity>
  );
};
export const NewFlyers2Screen = ({navigation, route}) => {
  const {minHeight} = useLayouts();
  const {selectedFyler, details, templateNo} = route?.params || {};
  console.log(selectedFyler);
  const sampleDemoList = [
    {id: 1, name: 'A', image: selectedFyler?.sample1Demo},
    {id: 2, name: 'B', image: selectedFyler?.sample2Demo},
    {id: 3, name: 'C', image: selectedFyler?.sample3Demo},
    {id: 4, name: 'D', image: selectedFyler?.sample4Demo},
  ];

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
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text bd size={18}>
            Design Flyer
          </Text>
          <Text bd size={14} color={COLORS.blue}>
            Template 0{templateNo}
          </Text>
        </View>

        <Text style={{marginTop: 10}} color={'#828282'} size={12} bk>
          Below are different samples under this Template. Click to Select a
          sample of choice.{' '}
        </Text>
        <FlatList
          columnWrapperStyle={{justifyContent: 'space-between', marginTop: 20}}
          numColumns={2}
          data={sampleDemoList}
          renderItem={({item}) => <Card item={item} />}
        />
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};
