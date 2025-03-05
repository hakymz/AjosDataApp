export const getWallet = (wallets, wallet) => {
  const currentWallet = wallets.filter(item => item?.currency == wallet)?.[0];
  return currentWallet || {};
};
