import {CommonActions} from '@react-navigation/native';
import {COLORS} from '../../conts';

export const openSuccessScreen = ({
  navigation,
  title = 'Another day, Another Successful Transaction!',
  btnTitle = 'View Transaction History',
  subTitle = 'This would a take a few seconds to reflect',
  subTitleColor = COLORS.black,
  proceed,
  indicatorWidth = '100%',
  indicatorText = '100% complete',
  secondBtn = null,
  secondBtnText = '',
  indicatorTextColor,
  btnComponent,
  titleComponent,
  number,
  secondBtnProceed = () => {},
}) => {
  navigation.navigate('SuccessScreen', {
    navigation,
    title,
    btnTitle,
    subTitle,
    proceed,
    indicatorWidth,
    indicatorText,
    secondBtn,
    secondBtnProceed,
    secondBtnText,
    indicatorTextColor,
    subTitleColor,
    btnComponent,
    titleComponent,
    number,
  });
};
