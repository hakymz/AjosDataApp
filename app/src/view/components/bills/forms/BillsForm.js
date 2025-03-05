import React from 'react';
import {AirtimeForm} from './AirtimeForm';
import {ElectricityForm} from './ElectricityForm';
import {InternetForm} from './InternetForm';
import {TvForm} from './TvForm';

export const BillsForm = React.forwardRef(
  ({data, setDisableButton = () => {}}, ref) => {
    if (data.type == 'airtime') {
      return (
        <AirtimeForm
          data={data}
          setDisableButton={setDisableButton}
          ref={ref}
        />
      );
    } else if (data.type == 'internet') {
      return (
        <InternetForm
          data={data}
          setDisableButton={setDisableButton}
          ref={ref}
        />
      );
    } else if (data.type == 'tv') {
      return (
        <TvForm data={data} setDisableButton={setDisableButton} ref={ref} />
      );
    } else if (data.type == 'electricity') {
      return (
        <ElectricityForm
          data={data}
          setDisableButton={setDisableButton}
          ref={ref}
        />
      );
    }

    return null;
  },
);
