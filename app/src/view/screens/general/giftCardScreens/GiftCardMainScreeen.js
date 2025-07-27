import { Image, TouchableOpacity, View } from "react-native";
import {
  Button,
  CustomSafeAreaView,
  Icons,
  KeyboardAvoidingViewWrapper,
  Text,
} from "../../../components/general";
import { Header } from "../../../components/layouts";
import { COLORS } from "../../../../conts";
import { PageList } from "../../../components/lists";
import React from "react";

export const GiftCardMainScreeen = ({ navigation }) => {
  const [state, setState] = React.useState({ selectedList: null });
  const list = [
    {
      name: "Buy Gift Cards",
      onPress: () => navigation.navigate("BuyGiftCardCountryScreen"),
    },
    {
      name: "Sell Gift Cards",
      onPress: () => navigation.navigate("GiftCardScreen"),
    },
  ];
  return (
    <CustomSafeAreaView>
      <Header title="Gift Cards" backBtn />
      <KeyboardAvoidingViewWrapper
        addMinHeight
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }}
      >
        <View
          style={{
            height: 69,
            backgroundColor: "#F6F9FF",
            borderRadius: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            overflow: "hidden",
          }}
        >
          <Text size={13} bold color={"#335991"}>
            Buy & Sell Gift Cards
          </Text>
          <Image
            style={{
              height: "100%",
              width: 100,
              resizeMode: "contain",
              bottom: -10,
            }}
            source={require("../../../../assets/images/homeMenu/giftcard.png")}
          />
        </View>
        <View style={{ marginTop: 50 }}>
          <Text size={16} semiBold color={"#3A3A3A"}>
            Holla, let us know if you want to Buy or Sell Gift cards?
          </Text>
        </View>

        <View style={{ marginTop: 40 }}>
          {list.map((item) => (
            <PageList
              onPress={() => {
                setState((prevState) => ({ ...prevState, selectedList: item }));
              }}
              name={item?.name}
              selected={item?.name == state?.selectedList?.name}
            />
          ))}
        </View>

        <View style={{ justifyContent: "flex-end", flex: 1 }}>
          <View
            style={{
              height: 99,
              backgroundColor: "#EAF2FF",
              marginBottom: 10,
              borderRadius: 16,
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingVertical: 20,
              alignItems: "center",
            }}
          >
            <Icons.InfoBlue size={24} />
            <View style={{ paddingHorizontal: 10, flex: 1 }}>
              <Text bold color={"#1F2024"} size={12}>
                Please Note
              </Text>
              <Text
                style={{ marginTop: 5 }}
                lineHeight={16}
                color={"#494A50"}
                size={12}
              >
                You can only select one at a time, and you can always return to
                this page anytime.
              </Text>
            </View>
            <View></View>
          </View>

          <Button
            onPress={() => {
              state?.selectedList?.onPress();
            }}
            disabled={!state?.selectedList}
            title={"Next"}
          />
        </View>
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};
