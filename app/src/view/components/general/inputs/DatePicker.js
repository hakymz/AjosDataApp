import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {s} from 'react-native-size-matters';
import {COLORS} from '../../../../conts';
import {Text} from '../text';
import moment from 'moment';
import {scaleFont} from '../../../../helper';
import {dateToString} from '../../../../helper';
import {useLayouts} from '../../../../hooks';

const CustomDatePicker = ({
  placeholder,
  defaultDate = '',
  onValueChange = () => {},
  error,
  enabled = true,
  style,
  minDate,
  maxDate,
  conStyle,
  rightIcon,
  border = true,
}) => {
  const [show, setShow] = React.useState(false);
  const [dateIsEmpty, setDateIsEmpty] = React.useState(
    defaultDate == '' ? true : false,
  );

  const [date, setDate] = React.useState(
    defaultDate != ''
      ? new Date(moment(defaultDate?.split?.(' ')[0], 'MM-DD-YYYY'))
      : new Date(),
  );

  React.useEffect(() => {
    if (defaultDate) {
      setDate(new Date(moment(defaultDate?.split?.(' ')[0], 'MM-DD-YYYY')));
    }
  }, [defaultDate]);

  const [mode, setMode] = React.useState('date');

  const onChange = selectedDate => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    setDateIsEmpty(false);
    onValueChange(dateToString(currentDate));
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        showDatepicker(), setShow(!show);
        setDateIsEmpty(false);
      }}
      style={{
        marginBottom: 20,
        zIndex: 1000,
        borderRadius: 16,
        ...conStyle,
      }}>
      <View
        style={[
          styles.inputContainer,
          {
            ...style,
            borderColor: error && border ? COLORS.error : COLORS.white,
            borderWidth: 1,
            backgroundColor: COLORS.white,
          },
        ]}>
        <Text size={14} md color={error ? COLORS.error : '#4961AC'}>
          {dateIsEmpty ? placeholder : dateToString(date)}
        </Text>
        {rightIcon && <View style={{right: -5}}>{rightIcon}</View>}
      </View>

      <DatePicker
        locale="en-GB"
        mode={mode}
        modal
        open={show}
        date={date}
        onConfirm={date => {
          onChange(date);
          setShow(false);
        }}
        onCancel={() => {
          setShow(false);
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default CustomDatePicker;
