import React from 'react';
import {
  CheckBox,
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
import {COLORS, FLYERS, NETWORKS} from '../../../../conts';
import {useNavigation} from '@react-navigation/native';

const List = ({item}) => {
  return (
    <TouchableOpacity
      style={{
        height: 54,
        backgroundColor: '#F8F8F8',
        marginBottom: 10,
        flexDirection: 'row',
        paddingHorizontal: 20,
        alignItems: 'center',
      }}>
      <CheckBox isChecked />
    </TouchableOpacity>
  );
};

const Indicators = ({currentIndex}) => {
  const {width} = useWindowDimensions();
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      {['', '', ''].map((item, index) => (
        <View
          style={{
            height: 4,
            backgroundColor: '#F1E8E8',
            borderRadius: 4,
            width: width / 3 - 20,
            borderRadius: 10,
            overflow: 'hidden',
          }}>
          <View
            style={{
              width:
                currentIndex > index
                  ? '100%'
                  : currentIndex == index
                  ? '50%'
                  : '0%',
              backgroundColor: COLORS.primary,
              height: '100%',
            }}
          />
        </View>
      ))}
    </View>
  );
};
export const CreateFlyersScreen = () => {
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

  return (
    <CustomSafeAreaView>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 20,
          paddingVertical: 20,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View>
          <Text bd size={18}>
            Design Flyer
          </Text>
          <Text bd size={14} color={COLORS.blue}>
            Edit Template
          </Text>
        </View>
        <View
          style={{
            borderWidth: 1,
            height: 30,
            borderColor: '#EAECF0',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 10,
            borderRadius: 10,
          }}>
          <Text color={COLORS.blue} size={12} bd>
            SAMPLE - C
          </Text>
        </View>
      </View>
      <KeyboardAvoidingViewWrapper
        contentContainerStyle={{paddingHorizontal: 20}}>
        <Indicators currentIndex={0} />
        <Text bk size={12} color={'#828282'} style={{marginTop: 20}}>
          With this tool, you can create your own flyer for your business, to
          allow your customers know how much your bundles are.
        </Text>

        <Text style={{marginTop: 20, marginBottom: 20}} bd color={COLORS.blue}>
          Select Network(s)
        </Text>
        {NETWORKS.map(item => (
          <List item={item} />
        ))}
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};
