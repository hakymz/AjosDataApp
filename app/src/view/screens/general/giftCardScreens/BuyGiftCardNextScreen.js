import React from "react";
import { View, Image, Keyboard, useWindowDimensions } from "react-native";

import { s } from "react-native-size-matters";
import { COLORS, GENERAL } from "../../../../conts";
import {
  AmountInput,
  Button,
  CustomPicker,
  CustomSafeAreaView,
  Icons,
  Input,
  KeyboardAvoidingViewWrapper,
  PageIndicator,
  Text,
} from "../../../components/general";
import { Header } from "../../../components/layouts";
import { fetchRequest, formatAmount } from "../../../../helper";
import { useLayouts, useUser } from "../../../../hooks";
import * as yup from "yup";
import { useFormik } from "formik";
import Toast from "../../../components/toast/Toast";
import { TouchableOpacity } from "react-native";

const getConvertedAmount = (value, giftData, setState) => {
  let convertedAmount;
  if (giftData?.denominationType == "FIXED") {
    convertedAmount =
      giftData?.fixedRecipientToSenderDenominationsMap[
        Number.isInteger(value * 1) ? value + ".0" : value
      ];
  } else {
    convertedAmount =
      (giftData?.minSenderDenomination / giftData?.minRecipientDenomination) *
      value;
  }

  setState((prevState) => ({
    ...prevState,
    convertedAmount,
  }));
};

let validationSchema;

const Quantity = ({ quantity, onChange }) => {
  return (
    <View
      style={{
        marginHorizontal: 20,
      }}
    >
      <Text color={"#1F2024"} bold size={12}>
        Quantity
      </Text>
      <View
        style={{
          height: s(50),
          backgroundColor: COLORS.white,
          width: 100,
          borderRadius: 8,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            onChange(quantity > 1 ? quantity - 1 : quantity);
          }}
          style={{
            height: 24,
            width: 24,
            backgroundColor: "#EAF2FF",
            borderRadius: 24,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icons.Minus
            size={10}
            onPress={() => {
              onChange(quantity > 1 ? quantity - 1 : quantity);
            }}
          />
        </TouchableOpacity>

        <Text size={14}>{quantity}</Text>

        <TouchableOpacity
          onPress={() => {
            onChange(quantity < 10 ? quantity + 1 : quantity);
          }}
          style={{
            height: 24,
            width: 24,
            backgroundColor: "#EAF2FF",
            borderRadius: 24,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icons.Plus
            size={10}
            onPress={() => {
              onChange(quantity < 10 ? quantity + 1 : quantity);
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const BuyGiftCardNextScreen = ({ route, navigation }) => {
  const { giftData } = route?.params || {};
  const { width } = useWindowDimensions();

  const recipientCurrencyCode = giftData?.recipientCurrencyCode;
  const [state, setState] = React.useState({
    selectedCard: null,
    selectedImages: [],
    convertedAmount: null,
  });

  const fixedRecipientDenominations = React.useMemo(
    () =>
      giftData?.fixedRecipientDenominations?.map((item) => {
        return { name: item + " " + recipientCurrencyCode, item };
      }),
    []
  );

  if (giftData?.denominationType == "FIXED") {
    validationSchema = yup.object().shape({
      unitPrice: yup.object().required("Please select how much"),
      walletType: yup.object().required("Please select select wallet"),
    });
  } else {
    validationSchema = yup.object().shape({
      unitPrice: yup
        .number()
        .required("Please enter amount")
        .min(
          giftData?.minRecipientDenomination,
          `Min amount of ${giftData?.minRecipientDenomination}`
        )
        .max(
          giftData?.maxRecipientDenomination,
          `Max amount of ${giftData?.maxRecipientDenomination}`
        ),
      walletType: yup.object().required("Please select select wallet"),
    });
  }

  const {
    errors,
    values,
    setFieldValue,
    touched,
    handleChange,
    setFieldTouched,
    submitForm,
    setValues,
    handleSubmit,
  } = useFormik({
    initialValues: {
      phone: "",
      amount: "",
      currency: "NGN",
      cardSubcategory: "",
      purchaseAmount: "",
      quantity: 1,
      unitPrice: "",
      walletType: { name: "Main Wallet", value: "main" },
    },
    validationSchema,
    onSubmit: () => {
      const dataList = [
        { title: "Gift card", details: giftData?.productName },
        {
          title: "Card unit",
          details: `${
            giftData?.denominationType == "FIXED"
              ? values?.unitPrice?.item
              : values?.unitPrice
          }`,
        },
        {
          title: "Quantity",
          details: `${values?.quantity}`,
        },
        {
          title: "Total amount",
          details: `${GENERAL.nairaSign}${formatAmount(
            state?.convertedAmount * values?.quantity
          )}`,
        },
        {
          title: "Wallet",
          details: `${values?.walletType?.name}`,
        },
      ];

      navigation.navigate("ConfirmTransactionDetailsScreen", {
        data: dataList,
        proceed: (pin) => buyGiftCard({ pin }),
      });
    },
  });

  const buyGiftCard = async ({ pin }) => {
    try {
      const response = await fetchRequest({
        path: "/giftcard/order",
        data: {
          productId: giftData?.productId,
          countryCode: giftData?.country?.isoName,
          quantity: values.quantity,
          unitPrice:
            giftData?.denominationType == "FIXED"
              ? values?.unitPrice?.item
              : values?.unitPrice * 1,
          transactionPin: pin,
          wallet: "NGN",
          walletType: values?.walletType?.value,
        },
      });

      navigation.navigate("Dashboard");
      Toast.show("success", "Transaction successful");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CustomSafeAreaView style={{ flex: 1 }}>
      <Header backBtn title="Gift Cards - Buy" menuBtn={false} />

      <KeyboardAvoidingViewWrapper
        addMinHeight
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 0,
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginBottom: 20,
            justifyContent: "space-between",
          }}
        >
          {["100%", "100%", "50%"].map((per) => (
            <PageIndicator
              style={{ width: width / 3 - 20 }}
              height={4}
              width={per}
            />
          ))}
        </View>

        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <View
            style={{
              marginRight: 10,
            }}
          >
            <Image
              style={{ height: 120, width: 100, borderRadius: 16 }}
              source={{ uri: giftData?.logoUrls?.[0] }}
            />
          </View>

          <View
            style={{
              justifyContent: "center",
              flex: 1,
            }}
          >
            <Text size={12} style={{ color: COLORS.black }}>
              {giftData?.productName}
            </Text>
            <Text
              size={12}
              bold
              style={{ marginTop: 10 }}
              color={COLORS.primary}
            >
              Note:
            </Text>
            <Text size={12} style={{ flex: 1 }} color={"#637381"}>
              {giftData?.redeemInstruction?.concise}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <>
            <View style={{ marginTop: 20 }}>
              {giftData?.denominationType == "FIXED" ? (
                <CustomPicker
                  label={"Card Units"}
                  conStyle={{ borderRadius: 8 }}
                  style={{ borderRadius: 8 }}
                  error={touched?.unitPrice && errors?.unitPrice}
                  onValueChange={(value) => {
                    setValues({
                      ...values,
                      unitPrice: value,
                    });
                    getConvertedAmount(value?.item, giftData, setState);
                  }}
                  value={values?.unitPrice}
                  placeholder={"How Much($)"}
                  data={fixedRecipientDenominations}
                  onBlur={() => {
                    setFieldTouched("unitPrice", true);
                  }}
                />
              ) : (
                <Input
                  error={touched?.unitPrice && errors?.unitPrice}
                  onChangeText={(value) => {
                    setValues({
                      ...values,
                      unitPrice: value,
                    });
                    getConvertedAmount(value, giftData, setState);
                  }}
                  value={values?.unitPrice}
                  placeholder="Unit price($)"
                  style={{ width: 200, borderRadius: 8 }}
                  conStyle={{ width: 200 }}
                  onBlur={() => {
                    setFieldTouched("unitPrice", true);
                  }}
                />
              )}
            </View>

            <Quantity
              quantity={values?.quantity}
              onChange={(value) => {
                setFieldValue("quantity", value);
              }}
            />

            <View style={{ marginTop: 10 }}>
              <CustomPicker
                label="Wallet Type"
                error={touched?.walletType && errors?.walletType}
                onValueChange={(value) => {
                  setFieldValue("walletType", value);
                }}
                value={values?.walletType}
                placeholder="Select Wallet"
                data={[
                  { name: "Main Wallet", value: "main" },
                  { name: "Topup Wallet", value: "topup" },
                ]}
                onBlur={() => {
                  setFieldTouched("walletType", true);
                }}
              />
            </View>

            <AmountInput
              editable={false}
              style={{ marginBottom: 10, marginTop: 40 }}
              title="Amount"
              placeholder="0000"
              value={state?.convertedAmount * values?.quantity}
              error={touched?.purchaseAmount && errors?.purchaseAmount}
              onChangeText={(value) => {}}
              keyboardType="numeric"
            />
          </>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            paddingTop: 40,
          }}
        >
          <Text
            textAlign={"center"}
            style={{ marginTop: 10, marginBottom: 20, paddingHorizontal: 20 }}
            color={COLORS.dark}
            size={12}
          >
            <Text size={11} style={{ color: "#637381" }}>
              By clicking on this button, you have accepted our{" "}
            </Text>

            <Text
              bold
              style={{ textDecorationLine: "underline" }}
              color={"#637381"}
              size={11}
            >
              Terms and Policy
            </Text>
          </Text>
          <Button
            onPress={() => {
              Keyboard.dismiss();
              handleSubmit();
            }}
            title="Continue"
          />
        </View>
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};
