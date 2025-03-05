import {BlurView, VibrancyView} from '@react-native-community/blur';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {s} from 'react-native-size-matters';
import {AVATAR, COLORS, FONTS, GENERAL} from '../../../conts';
import {useLayouts} from '../../../hooks';
import {Button, Icons, Text} from '../general';

const gender = [
  {name: 'Male', image: AVATAR.boy1},
  {name: 'Female', image: AVATAR.girl1},
];

export const GenderPopup = ({
  state,
  setState,
  onPress = () => {},
  close = () => {},
}) => {
  const navigation = useNavigation();
  const {height} = useLayouts();
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const GenderImage = ({index, image, name}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedIndex(index);
          setState(prevState => ({
            ...prevState,
            gender: index == 0 ? 'male' : 'female',
          }));
        }}
        activeOpacity={0.7}
        style={{flex: 1, alignItems: 'center'}}>
        {selectedIndex == index && (
          <View
            style={{
              position: 'absolute',
              right: selectedIndex == 0 ? 20 : 0,
              left: selectedIndex == 1 ? 20 : null,
              zIndex: 2,
            }}>
            <Icons.CheckRound size={28} />
          </View>
        )}

        <Image
          source={image}
          style={{height: s(106), width: s(106), resizeMode: 'contain'}}
        />
        <Text
          size={18}
          fontType={FONTS.FREDOKA}
          color={COLORS.voodoo}
          style={{marginTop: 10}}>
          {name}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={{
        ...style.modal,
        height,
      }}>
      {GENERAL.platform == 'ios' ? (
        <VibrancyView
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            zIndex: 0,
          }}
          blurAmount={5}
          blurType="extraDark"
        />
      ) : (
        <BlurView
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            zIndex: 0,
          }}
          blurAmount={5}
          blurType="extraDark"
        />
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: height,
          justifyContent: 'center',
          paddingHorizontal: 20,
        }}
        bounces={false}>
        <View style={style.card}>
          {/* button section */}
          <View style={{alignItems: 'flex-end'}}>
            <TouchableOpacity
              onPress={close}
              activeOpacity={0.7}
              style={style.cancelBtn}>
              <Icons.CrossWhite size={20} />
            </TouchableOpacity>
          </View>
          <Text
            color={COLORS.primary}
            bold
            size={22}
            style={{
              textAlign: 'center',
              paddingVertical: 30,
              marginBottom: 20,
              marginTop: 20,
            }}>
            Select a gender.
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 60,
            }}>
            {gender.map((item, index) => (
              <GenderImage
                name={item.name}
                image={item.image}
                state={state}
                setState={setState}
                index={index}
              />
            ))}
          </View>
          <Button
            title="Complete"
            type="black"
            onPress={() => {
              close();
              onPress();
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  modal: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.2)',
    width: '100%',
    zIndex: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 30,
  },
  cancelBtn: {
    height: s(40),
    width: s(40),
    backgroundColor: COLORS.black,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
