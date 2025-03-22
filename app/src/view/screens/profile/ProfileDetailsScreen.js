import React from 'react';
import {
  CustomSafeAreaView,
  Icons,
  Input,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../components/general';
import {MainHeader} from '../../components/layouts';
import {AVATAR, COLORS} from '../../../conts';
import {Image, TouchableOpacity, View} from 'react-native';
import {useUser} from '../../../hooks';
import moment from 'moment';
export const ProfileDetailsScreen = ({navigation}) => {
  const {data, user} = useUser();

  return (
    <CustomSafeAreaView backgroundColor={COLORS.white}>
      <MainHeader
        backgroundColor={COLORS.white}
        nav
        title={<></>}
        icon={<Icons.UserTag size={30} />}
      />
      <KeyboardAvoidingViewWrapper
        contentContainerStyle={{paddingHorizontal: 20, paddingTop: 20}}>
        <Text size={18} bold color={COLORS.darkBlue}>
          Account Details
        </Text>
        <Text style={{marginTop: 5}} size={12} medium color={'#979797'}>
          These are the hottest deals at the moment. A lower “%” means the deal
          has little attention on it.
        </Text>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30,
          }}>
          <View style={{}}>
            <Image style={{height: 100, width: 100}} source={AVATAR.avatar3} />
          </View>

          <View style={{marginTop: 20, alignItems: 'center'}}>
            <Text semiBold size={22} textAlign={'center'}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text
              style={{marginTop: 5}}
              color={'#848A94'}
              textAlign={'center'}
              size={12}>
              {user?.email}
            </Text>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('UpdateProfileScreen');
              }}
              style={{
                height: 25,
                borderWidth: 1,
                borderColor: COLORS.primary,
                borderRadius: 8,
                justifyContent: 'center',
                paddingHorizontal: 13,
                marginTop: 10,
              }}>
              <Text size={12} bold>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{marginTop: 30}}>
          <Input editable={false} value={user?.phoneNumber} />
          <Text style={{marginBottom: 10}} size={12} color={'#898A8D'}>
            Date of Registration
          </Text>
          <Input
            editable={false}
            value={moment(data?.user?.created_at).format('DD - MMM - YYYY')}
          />
        </View>
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};
