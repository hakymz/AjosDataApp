export const formatInput = price => {
  console.log(price);

  if (price) {
    const amount = price * 1;
    return isNaN(amount)
      ? '0.00'
      : amount?.toFixed?.(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  } else {
    return '0.00';
  }
};
