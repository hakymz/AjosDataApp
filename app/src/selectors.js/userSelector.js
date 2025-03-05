import {createSelector} from 'reselect';

const getCurrency = (mywallet, currency) => {
  return mywallet?.filter(item => item.currency == currency)[0];
};

export const selectData = state => state;

export const selectNGNWallet = createSelector(selectData, data => {
  return data?.wallet?.naira;
});
export const selectUSDWallet = createSelector(selectData, data => {
  return data?.wallet?.dollar;
});

export const selectTotalCryptoBalance = createSelector(selectData, data => {
  let totalBalance = 0;

  data?.wallets?.mywallet?.forEach(item => {
    if (item?.currency != 'NGN') {
      totalBalance += item?.nairaAmount;
    }
  });

  return totalBalance;
});

export const selectUser = createSelector(selectData, data => {
  return data?.user ?? {};
});
