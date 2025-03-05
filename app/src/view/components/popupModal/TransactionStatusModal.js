import React from 'react';
import {Status} from './components';
import {PopupModal} from './PopupModal';
export const TransactionStatusModal = ({title = '', subTitle = '', height}) => {
  PopupModal.show({
    component: <Status title={title} subTitle={subTitle} />,
    height: height,
  });
};
