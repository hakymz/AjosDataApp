import React from "react";
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  Keyboard,
  FlatList,
  TouchableOpacity,
} from "react-native";
import FormData from "form-data";

import { s } from "react-native-size-matters";
import { COLORS, GENERAL } from "../../../../conts";
import {
  AmountInput,
  Button,
  CustomSafeAreaView,
  Input,
  KeyboardAvoidingViewWrapper,
  PagePicker,
  Text,
} from "../../../components/general";
import { Header } from "../../../components/layouts";
import { fetchRequest, formatAmount, uploadImage } from "../../../../helper";
import { UploadImage } from "../../../components/giftCard";
import * as yup from "yup";
import { useFormik } from "formik";

import { useQuery } from "react-query";
import Toast from "../../../components/toast/Toast";
import { Preloader } from "../../../components/loaders";
const validationSchema = yup.object().shape({
  cardSubcategory: yup.object().required("Please choose card"),
  purchaseAmount: yup.number().required("Please input amount"),
  ecode: yup.string(),
});

const getGiftCardSubCategory = async (id) => {
  try {
    const response = await fetchRequest({
      path: "giftcard/sub-category/" + id,
      method: "GET",
      displayMessage: false,
      showLoader: false,
    });

    return response?.data?.cardSubCategories;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const GiftCardNextScreen = ({ route, navigation }) => {
  const { selectedService } = route?.params || {};

  const [state, setState] = React.useState({
    selectedCard: null,
    selectedGiftCard: null,
    selectedImages: [],
    selectedGiftCardIndex: null,
  });

  const {
    data: giftCardsData,
    error,
    isLoading,
    refetch,
  } = useQuery("getGiftCardSubCategory", () =>
    getGiftCardSubCategory(selectedService?._id)
  );

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
      promoCode: "",
    },
    validationSchema,
    onSubmit: () => {
      if (!values.ecode && state?.selectedImages?.length == 0) {
        Toast.show(
          "error",
          "Upload gift cards images or add ecode to continue"
        );
        return false;
      }
      const dataList = [
        { title: "Gift card category", details: selectedService?.name },
        { title: "Gift card category", details: values?.cardSubcategory?.name },
        {
          title: "Amount",
          details: `${formatAmount(values?.purchaseAmount)}`,
        },
        {
          title: "Rate",
          details: `${values?.cardSubcategory?.rate}`,
        },
        {
          title: "Cash value",
          details: `${
            values?.currency == "GHS"
              ? formatAmount(
                  values?.purchaseAmount * values?.cardSubcategory?.ghsrate
                )
              : formatAmount(
                  values?.purchaseAmount * values?.cardSubcategory?.rate
                )
          }`,
        },
        state?.selectedImages?.length > 0 && {
          title: "UPLOADED IMAGES",
          type: "image",
          details: state?.selectedImages,
        },

        values?.ecode && {
          title: "Ecode",
          details: `${values?.ecode}`,
        },
        values?.promoCode && {
          title: "Promo Code",
          details: `${values?.promoCode}`,
        },
      ];

      const message = (
        <Text size={12} color={COLORS.dark}>
          Please note:{"\n"}• Your cash value will change if you submit a card
          in the wrong subcategory{"\n"}• This trade is final and can not be
          canceled after you submit.
        </Text>
      );
      navigation.navigate("ConfirmTransactionDetailsScreen", {
        data: dataList,
        proceed: sellGiftCard,
        message,
        allowPin: false,
      });
    },
  });

  const sellGiftCard = async () => {
    let imagesLink;
    Preloader.show();
    const filteredImages = [];

    try {
      if (state?.selectedImages) {
        state?.selectedImages?.forEach?.((element, index) => {
          const uri =
            GENERAL.platform == "ios"
              ? element?.uri?.replace?.("file://", "")
              : element?.uri;
          filteredImages.push({
            name: element?.fileName,
            type: element?.type,
            uri: uri,
          });
        });

        imagesLink = await uploadImage(filteredImages);
      }

      const response = await fetchRequest({
        path: "giftcard/sell",
        data: {
          cardSubcategoryId: values?.cardSubcategory?.id,
          purchaseAmount: values?.purchaseAmount * 1,
          ecode: values?.ecode,
          currency: values?.currency,
          cardImage: imagesLink,
        },
        method: "POST",
        pageError: { navigation },
      });
      navigation.navigate("Dashboard");
      Toast.show(
        "success",
        "Thank you for trading with us. We will notify you when we credit your wallet"
      );
    } catch (error) {
      console.log(error, "error ....");
    } finally {
      Preloader.hide();
    }
  };

  return (
    <CustomSafeAreaView style={{ flex: 1 }}>
      <Header title={selectedService?.name} backBtn />

      <KeyboardAvoidingViewWrapper
        addMinHeight
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 30,
        }}
      >
        <PagePicker
          error={touched?.cardSubcategory && errors?.cardSubcategory}
          onValueChange={(value) => {
            setValues({
              ...values,
              cardSubcategory: value,
              purchaseAmount: "",
            });

            validationSchema.fields.purchaseAmount.withMutation((schema) => {
              schema.min(
                value?.minimumAcceptableAmount,
                `Min amount of ${value.minimumAcceptableAmount}`
              );
            });
          }}
          value={values?.cardSubcategory}
          placeholder="What Sub-Category?"
          label={"Sub-category"}
          data={giftCardsData}
          onBlur={() => {
            setFieldTouched("cardSubcategory", true);
          }}
        />

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              height: 24,
              backgroundColor: COLORS.primary,
              borderRadius: 12,
              marginBottom: 16,
              justifyContent: "center",
            }}
          >
            <Text
              size={10}
              semiBold
              color={COLORS.white}
              style={{
                paddingHorizontal: 10,
                marginTop: 0,
              }}
            >
              Rate |{" "}
              {values?.currency == "GHS"
                ? GENERAL.cedisSign
                : GENERAL.nairaSign}
              {values?.currency == "GHS"
                ? formatAmount(values?.cardSubcategory?.ghsrate)
                : formatAmount(values?.cardSubcategory?.rate)}
            </Text>
          </View>
        </View>

        <Input
          label="How much?"
          title="How much?"
          placeholder="0000"
          value={values.purchaseAmount}
          error={touched?.purchaseAmount && errors?.purchaseAmount}
          onChangeText={(value) => {
            setFieldValue("purchaseAmount", value);
          }}
          onBlur={() => setFieldTouched("purchaseAmount", true)}
          keyboardType="numeric"
        />
        {/* Total amount section */}

        <AmountInput
          label={"Amount"}
          currency={values.currency}
          onDropdownChange={(value) => {
            setFieldValue("currency", value);
          }}
          title={"Amount"}
          placeholder="0.00"
          value={
            values?.currency == "GHS"
              ? values?.purchaseAmount * 1 * values?.cardSubcategory?.ghsrate
              : values?.purchaseAmount * 1 * values?.cardSubcategory?.rate
          }
        />

        <Text size={10} style={{ flex: 1, marginTop: 10 }} color={"#8F9098"}>
          Thw Amount is calculated Automatically when you enter a price in{" "}
          <Text bold size={10} color={"#8F9098"}>
            “How much?”
          </Text>
        </Text>

        <UploadImage
          style={{ marginTop: 20 }}
          selectedImages={state?.selectedImages}
          updateImages={(images) => {
            setState((prevState) => ({
              ...prevState,
              selectedImages: images,
            }));
          }}
        />

        <Input
          placeholder="E-code | Note"
          value={values.ecode}
          error={touched?.ecode && errors?.ecode}
          onChangeText={(value) => {
            setFieldValue("ecode", value);
          }}
          onBlur={() => setFieldTouched("ecode", true)}
        />
        <Text size={10} style={{ marginBottom: 20 }} color={"#8F9098"}>
          Please let us know if you have any E-code or special requests in the
          space provided above
        </Text>

        <Input
          placeholder="Promo code"
          value={values.promoCode}
          error={touched?.promoCode && errors?.promoCode}
          onChangeText={(value) => {
            setFieldValue("promoCode", value);
          }}
          onBlur={() => setFieldTouched("promoCode", true)}
        />

        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            paddingTop: 20,
          }}
        >
          <Button
            onPress={() => {
              Keyboard.dismiss();
              submitForm();
            }}
            title="Next"
          />
        </View>
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};

const style = StyleSheet.create({
  iconCon: {
    height: s(29),
    width: s(29),
    backgroundColor: "#402274",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
