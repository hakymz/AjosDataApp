import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {BottomSheets, Button, Icons, Text} from '../../general';
import LottieView from 'lottie-react-native';
import {PageList} from '../../lists';
import {COLORS, CONTACTS, GENERAL, IMAGES} from '../../../../conts';
import {ChangePassword} from './ChangePassword';
// import Intercom from '@intercom/intercom-react-native';
import {openLink} from '../../../../helper';

const List = ({title, icon, ...props}) => {
  return (
    <TouchableOpacity
      {...props}
      style={{
        backgroundColor: '#F8F8F8',
        borderWidth: 0,
        flexDirection: 'row',
        height: 54,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        borderRadius: 8,
      }}>
      <Text size={18} color={COLORS.blue} fontWeight={'500'}>
        {title}
      </Text>
      {icon}
    </TouchableOpacity>
  );
};
export const ContactUs = () => {
  return (
    <View style={{paddingHorizontal: 24}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        Contact Us{' '}
      </Text>
      <View style={{marginTop: 20, marginBottom: 30}}>
        <Text lineHeight={17} color={'#828282'} size={12} fontWeight={'400'}>
          You can choose between the available contact options that suits your
          preference at this particular time.
        </Text>
      </View>
      <View style={{flex: 1}}>
        <List
          title={'Whatsapp Chat'}
          icon={<Icons.Whatsapp size={24} />}
          onPress={() => {
            BottomSheets.hide();
            openLink(CONTACTS.whatsappLink);
          }}
        />
        <List
          onPress={() => {
            Intercom.present();
            BottomSheets.hide();
          }}
          title={'In-app Live Chat'}
          icon={<Icons.ChatRed size={24} />}
        />
        <List
          onPress={() => {
            openLink('mailto:dataresellhelpdesk@gmail.com');
            BottomSheets.hide();
          }}
          title={'Via Email'}
          icon={<Icons.MailRed size={24} />}
        />
        <Button
          style={{marginTop: 10}}
          onPress={() => {
            BottomSheets.hide();
          }}
          textColor={COLORS.white}
          title={'Cancel'}
          type="grey"
        />
      </View>
    </View>
  );
};
