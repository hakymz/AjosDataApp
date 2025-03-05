export const calculateAmountToBePaid = (
  state,
  handleOnChange,
  conversionMatrix,
) => {
  let amountToBePaid = 0;
  if (state.units >= state.giftCard.minimum) {
    if (state.units) {
      if (state.currency == 'BTC') {
        amountToBePaid =
          (parseInt(state.units) * state?.giftCard?.rate) /
          conversionMatrix.BITCOINS;
      } else if (state.currency == 'USDT') {
        amountToBePaid =
          (parseInt(state.units) * state?.giftCard?.rate) /
          conversionMatrix.USDT;
      } else if (state.currency == 'GHS') {
        amountToBePaid =
          (parseInt(state.units) * state?.giftCard?.rate) /
          conversionMatrix.CEDIS;
      } else if (state.currency == 'NGN') {
        amountToBePaid = parseInt(state.units) * state?.giftCard?.rate;
      } else {
        amountToBePaid = 0;
      }
    }
  } else {
    amountToBePaid = 0;
  }

  handleOnChange(amountToBePaid, 'amountToBePaid');
};
