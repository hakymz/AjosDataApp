export const openErrorScreen = ({
  navigation,
  title = 'Another day, Another Successful Transaction!',
  btnTitle = 'Try Again',
  subTitle = 'This would a take a few seconds to reflect',
  proceed,
  indicatorWidth = '0%',
  indicatorText = 'Failed',
}) => {
  navigation.navigate('ErrorScreen', {
    title,
    btnTitle,
    subTitle,
    proceed,
    indicatorText,
    indicatorWidth,
  });
};
