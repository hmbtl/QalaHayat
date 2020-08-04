import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import { Platform } from 'react-native'
import { LoadingView, Dialog } from '@component/views';

export default class PaymentScreen extends Component {

  _isMounted = false;


  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isPaymentPageLoaded: false,
      showDialog: false,
      amount: this.props.navigation.getParam("amount", ""),
      debt: this.props.navigation.getParam("debt", ""),
      policyNumber: this.props.navigation.getParam("policyNumber", ""),
      lang: "az",
      finCode: this.props.navigation.getParam("finCode", ""),
      insurerId: this.props.navigation.getParam("insurerid", ""),
      isFromContracts: this.props.navigation.getParam("isFromContracts", false)
    };

    this.setStateWithMount = this.setStateWithMount.bind(this);

  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  setStateWithMount = data => {
    if (this._isMounted) {
      this.setState(data);
    }
  };


  componentDidUpdate(prevProps, prevState) {
    if (prevState.showDialog === true && this.state.showDialog === false) {
      this.props.navigation.goBack();
    }
  }

  render = () => {
    const { amount, debt, policyNumber, lang, finCode, insurerId } = this.state;

    let paymentURL, body, headers, source;

    const whiteListRegex = /^.*(qala\.az\/|asanpay\.az\/|\.3dsecure.az\/|3dsecure\.kapitalbank\.az|millikart\.az).*$/i;
    const paymentDomainRegex = /^.*(asanpay\.az\/|\.3dsecure.az\/).*$/i;
    const qalaDomain = /^.*(qala\.az\/).*$/i;

    console.log(this.state)

    if (this.state.isFromContracts) {
      paymentURL = "https://personal.qala.az/payment/processing.php";
      body =
        "payment_debt=" + amount +
        "&payment_policy_number=" + policyNumber +
        "&lang=" + lang +
        "&payment_fin_code=" + finCode +
        "&user_insurerid=" + insurerId +
        "&payment_debt_check=" + debt;

      headers = { 'Content-Type': 'application/x-www-form-urlencoded' }

      source = { uri: paymentURL, method: "POST", body: body }
    } else {
      paymentURL = "https://www.qala.az/online/online_payment/processing.php";
      body =
        "payment_debt2=" + amount +
        "&payment_policy_number2=" + policyNumber +
        "&lang=" + lang +
        "&payment_pin_code2=" + finCode +
        "&user_insurerid_check=" + insurerId +
        "&payment_debt_check=" + debt +
        "&insurerid=" + insurerId;

      headers = { 'Content-Type': 'application/x-www-form-urlencoded' }

      source = { uri: paymentURL, method: "POST", body: body }
    }


    if (Platform.OS === 'ios') {
      source.headers = headers;
    }


    return (
      <LoadingView
        isLoading={this.state.isLoading}
        showBlur={true}
        style={{ flex: 1 }}>
        <Dialog
          onCancelPress={() => {
            this.setStateWithMount({
              showDialog: false
            })
          }}
          animationType="fade"
          title="Ödəniş"
          cancelText="Bağla"
          transparent={true}
          visible={this.state.showDialog}
          content="Ödənişiniz sona yetirildi bağla düyməsinə basıb əvvəl ki səhifəyə qayıdın."
        />
        <WebView
          source={source}
          onError={syntheticEvent => {
            const { nativeEvent } = syntheticEvent;
          }}
          onShouldStartLoadWithRequest={request => {
            // Only allow navigating within this website
            // return request.url.startsWith('https://reactnative.dev');

            console.log(request.url);

            if (this.state.isPaymentPageLoaded && qalaDomain.test(request.url)) {

              this.setStateWithMount({
                showDialog: true
              })
              return false
            } else {
              return whiteListRegex.test(request.url);
            }

          }}
          onLoadEnd={syntheticEvent => {
            // update component to be aware of loading status
            const { nativeEvent } = syntheticEvent;
            const url = nativeEvent.url;

            this.setStateWithMount({
              isLoading: false,
            });

            if (paymentDomainRegex.test(url)) {
              this.setStateWithMount({
                isPaymentPageLoaded: true
              })
            }

          }}
        />
      </LoadingView>
    );
  }
}
