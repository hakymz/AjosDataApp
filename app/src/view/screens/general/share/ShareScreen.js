import React from 'react';
import {
  Button,
  CustomSafeAreaView,
  Icons,
  Text,
} from '../../../components/general';
import {AppNav} from '../../../components/layouts';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, IMAGES} from '../../../../conts';
import {PageList} from '../../../components/lists';
import {useLayouts, useUser} from '../../../../hooks';
import {Copy} from '../../../../helper';
import Share from 'react-native-share';

export const ShareScreen = ({navigation}) => {
  const {
    data: {user = {}},
  } = useUser();

  const {minHeight} = useLayouts();
  return (
    <CustomSafeAreaView>
      <AppNav title="Share | Earn" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 0,
          paddingBottom: 40,
          paddingHorizontal: 20,
          minHeight: minHeight - 70,
        }}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={IMAGES.shareAvatar}
            style={{height: 280, width: 300, resizeMode: 'contain'}}
          />
          <Text
            fontWeight={'500'}
            size={15}
            color={COLORS.blue}
            style={{paddingHorizontal: 10, marginTop: 10}}>
            Earn commission on every SME/CG purchase of your referee, ask them
            to register with your unique referral code below
          </Text>
        </View>
        <Text
          fontWeight={'500'}
          size={14}
          style={{marginTop: 40, paddingHorizontal: 10, marginBottom: 10}}>
          Referral Code
        </Text>
        <PageList style={{height: 68, flex: 0}}>
          <View>
            <Text size={16} fontWeight={'500'} color={COLORS.blue}>
              {user?.refCode}
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                let options = {
                  title: 'Refferal Code',
                  message: user?.refCode,
                };
                Share.open(options)
                  .then(res => {
                    console.log(res);
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }}
              style={{
                height: 36,
                width: 36,
                borderWidth: 1,
                borderColor: '#EAECF0',
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 5,
              }}>
              <Icons.Share size={15} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Copy(user?.refCode);
              }}
              style={{
                height: 36,
                width: 36,
                borderWidth: 1,
                borderColor: '#EAECF0',
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icons.Copy size={15} />
            </TouchableOpacity>
          </View>
        </PageList>
        <Text lineHeight={16} color={'#828282'} size={12} fontWeight={'400'}>
          You can share this with your friends to use when installing the app to
          start earning as they use the app.
        </Text>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Button
            onPress={() => {
              navigation.navigate('ShareProfileScreen');
            }}
            title={'View Profile'}
            style={{marginTop: 30}}
          />
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  list: {
    height: 72,
    backgroundColor: '#F8F8F8',
    marginBottom: 10,
    borderRadius: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
