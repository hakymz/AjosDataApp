import React from 'react';
import {View} from 'react-native';
import {BottomSheets, Button, Text, ToggleInput} from '../../general';
import {PageList} from '../../lists';
import {COLORS} from '../../../../conts';
import {useUser} from '../../../../hooks';
import {fetchRequest} from '../../../../helper';
import Toast from '../../toast/Toast';
import {useQueryClient} from 'react-query';

const List = ({title, icon, enableSwitch, click, ...props}) => {
  return (
    <PageList {...props}>
      <Text size={18} color={COLORS.blue} fontWeight={'500'}>
        {title}
      </Text>

      <ToggleInput
        click={click}
        onValueChange={() => {}}
        enableSwitch={enableSwitch}
      />
    </PageList>
  );
};
export const UpdateNotification = () => {
  const {data, updateUserData} = useUser();
  const queryClient = useQueryClient();

  const updateSettings = async settings => {
    try {
      const response = await fetchRequest({
        path: `settings/change-notification`,
        data: settings,
      });
      console.log(response);
      Toast.show('success', 'Settings updated');
      updateUserData({
        data: data,
      });
      BottomSheets.hide();
      queryClient.invalidateQueries({queryKey: ['userData']});
    } catch (error) {
      console.log(error, 'errrss');
      throw error;
    }
  };

  return (
    <View style={{paddingHorizontal: 24}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        Turn off Alerts
      </Text>
      <View style={{marginTop: 20, marginBottom: 30}}>
        <Text lineHeight={17} color={'#828282'} size={12} fontWeight={'400'}>
          You can choose what type of Alerts you want to Turn off and leave on.
          Just use the TOGGLE switch.
        </Text>
      </View>
      <View style={{flex: 1}}>
        <List
          click={async () => {
            updateSettings({
              sms: !data?.user?.notificationSettings?.sms,
              email: data?.user?.notificationSettings?.email,
            });
          }}
          enableSwitch={data?.user?.notificationSettings?.sms}
          title={'SMS Alert'}
        />

        <List
          click={async () => {
            updateSettings({
              sms: data?.user?.notificationSettings?.sms,
              email: !data?.user?.notificationSettings?.email,
            });
          }}
          enableSwitch={data?.user?.notificationSettings?.email}
          title={'Email Notifications'}
        />

        <Button
          onPress={BottomSheets.hide}
          textColor={COLORS.white}
          title={'Cancel'}
          type="grey"
        />
      </View>
    </View>
  );
};
