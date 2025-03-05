import React from 'react';
import {View} from 'react-native';
import {useUser} from '../../../../hooks';
import {Text} from '../../general';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Copy} from '../../../../helper';
import {COLORS} from '../../../../conts';

const List = ({title, subTitle, copy}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 1,
      }}>
      <Text size={13} numberOfLines={1} style={{width: '45%'}} semiBold>
        {title}
      </Text>
      <View
        style={{
          width: '50%',
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}>
        <Text size={11} textAlign={'right'} numberOfLines={1}>
          {subTitle}
        </Text>
        {copy && (
          <Icon
            color={COLORS.black}
            style={{marginLeft: 5}}
            onPress={copy}
            size={15}
            name="content-copy"
          />
        )}
      </View>
    </View>
  );
};

const CurrentAccount = ({bankName, accountNo, accountName, next}) => {
  return (
    <View>
      {next ? (
        <Text size={12} semiBold textAlign="center">
          OR
        </Text>
      ) : (
        <Text style={{marginTop: 10, marginBottom: 10}} size={12} bold>
          TRANSFER TO THE ACCOUNT DETAILS BELOW TO FUND YOUR WALLET
        </Text>
      )}

      <List title={'Bank Name'} subTitle={bankName} />
      <List title={'Account Name'} subTitle={accountName} />
      <List
        title={'Account No'}
        subTitle={accountNo}
        copy={() => Copy(accountNo)}
      />
    </View>
  );
};
export const AccountDetails = () => {
  const {
    data: {user: {data = ''} = ''},
  } = useUser();
  return (
    <View>
      <CurrentAccount
        accountName={data?.name}
        bankName={'Providus Bank'}
        accountNo={data?.providus}
      />
      <CurrentAccount
        next
        accountName={data?.name}
        bankName={'Wema Bank'}
        accountNo={data?.account}
      />
      <CurrentAccount
        next
        accountName={data?.name}
        bankName={'Monie Point'}
        accountNo={data?.sec_account}
      />
    </View>
  );
};
