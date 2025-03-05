import {COLORS} from '../../conts';

export const getStatusColor = status => {
  if (status == 'successful' || status == 'processed') {
    return COLORS.primary;
  }
  if (status == 'pending') {
    return '#6F6F6F';
  }
  if (status == 'failed' || status == 'declined') {
    return '#FF0000';
  }
};
