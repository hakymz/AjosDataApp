import {Copy} from '../../../../helper';
import {MyIcons} from './MyIcons';

export const CopyIcon = ({text}) => (
  <MyIcons.Copy size={18} onPress={() => Copy(text)} />
);
