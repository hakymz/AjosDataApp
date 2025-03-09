import {Text} from '../view/components/general';
import COLORS from './colors';

export default screens = [
  {
    title: 'Personal or Business',
    message: (
      <Text color={'#002055'} size={35}>
        Best plug for cheap
        <Text size={35} semiBold color={COLORS.primary}>
          Data or Airtime
        </Text>{' '}
        purchase
      </Text>
    ),
    image: require('../assets/images/onboarding/onboarding1.png'),
  },
  {
    title: 'Virtual Dollar Cards',
    message: (
      <Text color={'#002055'} size={35}>
        Our cards work
        <Text size={35} semiBold color={COLORS.primary}>
          Every-time
        </Text>{' '}
        you need to pay👌
      </Text>
    ),
    image: require('../assets/images/onboarding/onboarding2.png'),
  },
  {
    title: 'Gift-Card Payment',
    message: (
      <Text color={'#002055'} size={35}>
        Over{' '}
        <Text size={35} semiBold color={COLORS.primary}>
          200+ Gift Cards
        </Text>{' '}
        for various platforms✌
      </Text>
    ),
    image: require('../assets/images/onboarding/onboarding3.png'),
  },
];
