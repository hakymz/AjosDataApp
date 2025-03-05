import React from 'react';
import {Status} from './content';
import {BottomSheets} from './index';
export const TransactionStatusModal = ({type, message}) => {
  BottomSheets.show({
    component: <Status type={type} message={message} />,
    customSnapPoints: [500, 500],
  });
};
