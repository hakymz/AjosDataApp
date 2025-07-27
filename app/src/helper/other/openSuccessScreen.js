import {CommonActions} from '@react-navigation/native';
import {COLORS} from '../../conts';

export const openSuccessScreen = ({
  navigation,
  title = 'You are a sure Plug🔌',
  btnTitle = 'View Transaction History',
  subTitle = 'This would a take a few seconds to reflect',
  subTitleColor = COLORS.black,
  proceed,
  secondBtn = null,
  secondBtnText = '',
  btnComponent,
  titleComponent,
  image = '',
  number,
  secondBtnProceed = () => {},
}) => {
  navigation.navigate('SuccessScreen', {
    navigation,
    title,
    btnTitle,
    subTitle,
    proceed,
    secondBtn,
    secondBtnProceed,
    secondBtnText,
    subTitleColor,
    btnComponent,
    titleComponent,
    image,
    number,
  });
};
