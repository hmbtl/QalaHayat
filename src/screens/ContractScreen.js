import React, { Component } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  StatusBar,
  Text,
  View,
  TouchableHighlight,
  Image,
} from 'react-native';
import { CardView, LoadingView, Dialog, QalaInputText } from '@component/views';
import moment from "moment"
import api from '@services/api';
import { images, constants, colors } from '@config';
import { verticalScale, moderateScale } from 'react-native-size-matters';

function ContractItem({ index, item, onPress, onPDF, onPayment, isAsanConnected }) {

  let startDate = moment(new Date(item.insurance_start_date)).format('DD.MM.YYYY');
  let endDate = moment(new Date(item.insurance_end_date)).format('DD.MM.YYYY');

  let cardColor = "white";
  let pressedColor = "#ffffffdd";
  let chevronDown = images.chevronDown;
  let chevronUp = images.chevronUp;
  let labelStyle = { flex: 1, color: "#414141", fontSize: constants.fonts.xsmall };
  let valueStyle = { flex: 1, color: colors.primary, fontSize: constants.fonts.xsmall, fontWeight: "bold" }

  if (item.state.toLowerCase() === 'bitdi') {
    cardColor = "#FF4D4D";
    pressedColor = "#FF9B9B";
    labelStyle.color = "white";
    valueStyle.color = "white";
    chevronDown = images.chevronDownWhite;
    chevronUp = images.chevronUpWhite;
  }



  return (
    <CardView
      style={[styles.card, { paddingBottom: item.expanded ? 0 : 3 }]}
      containerStyle={{ margin: 5 }}
      color={cardColor}
      pressedColor={pressedColor}
      cornerRadius={8}
      onPress={() => onPress(index)}
      cardElevation={4}>
      <Image
        source={item.expanded ? chevronUp : chevronDown}
        style={{
          height: verticalScale(30), width: verticalScale(30),
          alignSelf: item.expanded ? "flex-start" : "center",
        }}
        resizeMode="stretch"
      />
      <View style={{ flex: 1, padding: 10 }}>
        <View style={styles.textContainer}>
          <Text style={labelStyle}>Müqavilə nömrəsi</Text>
          <Text style={valueStyle}>{item.policy_number}</Text>
        </View>
        {item.expanded && (
          <>
            <View style={[styles.textContainer, { paddingTop: 5 }]}>
              <Text style={labelStyle}>Başlama tarixi</Text>
              <Text style={valueStyle}>{startDate}</Text>
            </View>
            <View style={[styles.textContainer, { paddingTop: 5 }]}>
              <Text style={labelStyle}>Bitmə tarixi</Text>
              <Text style={valueStyle}>{endDate}</Text>
            </View>
            <View style={[styles.textContainer, { paddingTop: 5 }]}>
              <Text style={labelStyle}>Sığorta məbləği</Text>
              <Text style={valueStyle}>{item.price} ₼</Text>
            </View>
            <View style={[styles.textContainer, { paddingTop: 5 }]}>
              <Text style={labelStyle}>Sığorta haqqı</Text>
              <Text style={valueStyle}>{item.debt2} ₼</Text>
            </View>
            <View style={[styles.textContainer, { paddingTop: 5 }]}>
              <Text style={labelStyle}>Ödəniş qaydası</Text>
              <Text style={valueStyle}>{item.premium_type}</Text>
            </View>
            <View style={[styles.textContainer, { paddingTop: 5 }]}>
              <Text style={labelStyle}>Cari borc</Text>
              <Text style={valueStyle}>{item.debt4} ₼</Text>
            </View>
            <View style={[styles.textContainer, { paddingTop: 5, paddingBottom: 10 }]}>
              <Text style={labelStyle}>Status</Text>
              <Text style={valueStyle}>{item.state}</Text>
            </View>
            {(item.state.toLowerCase() !== 'bitdi' && !isAsanConnected) &&
              <View style={styles.actionButtonContainer}>
                <TouchableHighlight
                  onPress={() => onPDF(index)}
                  underlayColor="#41414111"
                  style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>pdf</Text>
                </TouchableHighlight>

                <TouchableHighlight
                  onPress={() => onPayment(index)}
                  underlayColor="#41414111"
                  style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>ödəyin</Text>
                </TouchableHighlight>

              </View>
            }
          </>

        )}
      </View>

    </CardView>
  );
}

export default class ContractScreen extends Component {

  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      paymentDialog: false,
      paymentAmount: "",
      contracts: [],
      isAsanConnected: false,
      selectedPayment: {},
      finCode: "",
      info: {
        "debt": 0,
        "debt2": 0,
        "debt3": 0,
        "debt4": 0,
        "price": 0,
        "premium": 0,
        "count": 0
      }
    };

    this.loadContracts = this.loadContracts.bind(this);
    this.setStateWithMount = this.setStateWithMount.bind(this);
    this.onPaymentAccept = this.onPaymentAccept.bind(this);
  }

  setStateWithMount = data => {
    if (this._isMounted) {
      this.setState(data);
    }
  };

  onPress = (index) => {
    let contracts = this.state.contracts;

    contracts[index].expanded = !contracts[index].expanded;

    this.setState({
      contracts,
    })
  }

  onPaymentAccept = () => {

    this.setStateWithMount({
      paymentDialog: false
    })

    this.props.navigation.navigate("Payment", {
      amount: this.state.paymentAmount,
      debt: this.state.selectedPayment.debt4,
      insurerid: this.state.selectedPayment.insurerid,
      finCode: this.state.finCode,
      policyNumber: this.state.selectedPayment.policy_number,
      isFromContracts: true
    })
  }

  onPayment = (index) => {
    let contract = this.state.contracts[index];
    let paymentAmount = contract.debt4;

    if (contract.premium_type.toLowerCase() === 'aylıq') {
      paymentAmount = contract.debt2;
    }

    if (contract.policy_number.startsWith("MLI")) {
      paymentAmount = 0.001
    }


    this.setStateWithMount({
      paymentDialog: true,
      selectedPayment: contract,
      paymentAmount: paymentAmount
    })
  }

  onPDF = (index) => {
    let contract = this.state.contracts[index];

    this.props.navigation.navigate("PDF", {
      pdf: contract.pdf,
      title: contract.policy_number
    })
  }

  loadContracts = async () => {
    this.setStateWithMount({
      isLoading: true
    });

    try {

      const userData = await api.getUser();

      if (userData.status == "error") {
        throw new Error(userData.message)
      } else {
        // if success get user from data
        let user = userData.data;
        let contract = user.contract;

        const contractData = await api.getContracts();

        if (contractData.status == "error") {
          throw new Error(contractData.message)
        } else {
          let contracts = contractData.data;
          this.setStateWithMount({
            info: contract,
            isAsanConnected: user.asan !== null,
            finCode: user.fin_code,
            contracts: contracts
          });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setStateWithMount({
        isLoading: false
      });
    }
  }


  componentDidMount() {
    // set component mounted
    this._isMounted = true;
    this.loadContracts();
  }


  componentWillUnmount() {
    // set component mounted false
    this._isMounted = false;
  }


  renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.sectionLabel}>Ümumi məlumat</Text>
        <View style={styles.row}>
          <CardView
            style={[styles.headerCard, { backgroundColor: colors.blueLight }]}
            cardElevation={4}
            cornerRadius={8}
          >
            <Image
              resizeMode="contain"
              source={images.documents}
              style={styles.headerImage}
            />
            <Text style={styles.headerLabel}>Müqavilələrim</Text>
            <Text style={styles.headerText}>{this.state.info.count}</Text>
          </CardView>

          <CardView
            style={[styles.headerCard, { backgroundColor: colors.green }]}
            cardElevation={4}
            cornerRadius={8}
          >
            <Image
              resizeMode="contain"
              source={images.wallet}
              style={styles.headerImage}
            />

            <Text style={styles.headerLabel}>Sığorta məbləği</Text>
            <Text style={styles.headerText}>{this.state.info.price.toFixed(2)} ₼</Text>

          </CardView>
        </View>

        <View style={styles.row}>
          <CardView
            style={[styles.headerCard, { backgroundColor: colors.yellow }]}
            cardElevation={4}
            cornerRadius={8}
          >
            <Image
              resizeMode="contain"
              source={images.debt}
              style={styles.headerImage}
            />

            <Text style={styles.headerLabel}>Sığorta haqqı</Text>
            <Text style={styles.headerText}>{this.state.info.debt2.toFixed(2)} ₼</Text>
          </CardView>

          <CardView
            style={[styles.headerCard, { backgroundColor: colors.blue }]}
            cardElevation={4}
            cornerRadius={8}
          >
            <Image
              resizeMode="contain"
              source={images.amount}
              style={styles.headerImage}
            />
            <Text style={styles.headerLabel}>Cari borc</Text>
            <Text style={styles.headerText}>{this.state.info.debt4.toFixed(2)} ₼</Text>

          </CardView>
        </View>
        <Text style={styles.sectionLabel}>Siyahı</Text>

      </View >
    )
  }

  render() {


    let isMLI = false;

    if ("policy_number" in this.state.selectedPayment) {
      if (this.state.selectedPayment.policy_number.startsWith("MLI")) {
        isMLI = true;
      }
    }


    return (
      <LoadingView
        style={{ flex: 1, backgroundColor: "white" }}
        showBlur={true}
        isLoading={this.state.isLoading}
      >

        <Dialog
          onOutsidePress={() => { this.setState({ paymentDialog: false }) }}
          onCancelPress={() => { this.setState({ paymentDialog: false }) }}
          acceptText="Ödəyin"
          animationType="fade"
          onAcceptPress={this.onPaymentAccept}
          title="Ödəniş"
          cancelText="Bağla"
          transparent={true}
          visible={this.state.paymentDialog}
          onRequestClose={() => this.setState({ paymentDialog: false })}
        >
          <View style={{ padding: 5 }}>
            <QalaInputText
              label="Sığorta növü"
              value={this.state.selectedPayment.insurance_name}
              editable={false}
              labelStyle={{ color: colors.primaryDark }}
              style={[styles.inputStyleHidden]}
            />

            <QalaInputText
              label="Müqavilə nömrəsi"
              value={this.state.selectedPayment.policy_number}
              editable={false}
              labelStyle={{ color: colors.primaryDark }}
              style={[styles.inputStyleHidden]}
            />

            {!isMLI &&
              <>
                <QalaInputText
                  label="Cari borc"
                  value={this.state.selectedPayment.debt4 + " ₼"}
                  editable={false}
                  labelStyle={{ color: colors.primaryDark }}
                  style={[styles.inputStyleHidden]}
                />

                <QalaInputText
                  label="Ödənişin məbləği"
                  value={this.state.paymentAmount}
                  onChangeText={text => this.setState({ paymentAmount: text })}
                  keyboardType={"numeric"}
                  labelStyle={{ color: colors.primaryDark }}
                  returnKeyType='done'
                  preText="₼"
                  style={[styles.inputStyle, { color: colors.blackLight }]}
                />
              </>
            }
          </View>
        </Dialog>

        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent={true}
        />
        <SafeAreaView style={styles.container}>
          <View style={{ flex: 1, padding: 5 }}>

            <FlatList
              style={{ flex: 1 }}
              ListHeaderComponent={this.renderHeader()}
              data={this.state.contracts}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) =>
                <ContractItem
                  isAsanConnected={this.state.isAsanConnected}
                  onPress={() => this.onPress(index)}
                  item={index, item}
                  onPayment={() => this.onPayment(index)}
                  onPDF={() => this.onPDF(index)} />
              }
              keyExtractor={item => item.id}
            />
          </View>


        </SafeAreaView>
      </LoadingView >

    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  card: {
    flex: 1,
    margin: 0,
    alignItems: 'center',
    flexDirection: 'row',
  },
  textContainer: {
    fontSize: constants.fonts.xsmall,
    flex: 1,
    paddingLeft: 20,
    paddingRight: 10,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  sectionLabel: {
    fontSize: constants.fonts.small,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    color: colors.blackLight,
    margin: verticalScale(5),
    paddingTop: verticalScale(5)
  },
  headerImage: {
    position: "absolute",
    opacity: 0.10,
    right: 0,
    top: verticalScale(5),
    width: moderateScale(40),
    height: moderateScale(40),
  },
  headerCard: {
    flex: 1,
    height: moderateScale(75),
    margin: 5,

  },
  headerContainer: {
    marginBottom: verticalScale(0)
  },
  headerLabel: {
    color: "white",
    fontSize: constants.fonts.xxsmall
  },
  headerText: {
    color: "white",
    paddingTop: verticalScale(5),
    fontSize: constants.fonts.xlarge
  },
  inputStyleHidden: {
    backgroundColor: colors.white,
    color: colors.blackLight,
    borderWidth: 0,
    height: moderateScale(25),
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    paddingLeft: 5,
    elevation: 0,
  },
  inputStyle: {
    backgroundColor: colors.inputBackground,
    borderColor: colors.inputBorder,
    color: colors.disabled,
    elevation: 0,
    height: moderateScale(45),
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  actionButtonText: { color: colors.primary, fontSize: constants.fonts.xxsmall, fontWeight: "bold", textTransform: 'uppercase' },
  actionButtonContainer: { bottom: 0, paddingTop: 10, alignItems: "flex-end", justifyContent: "flex-end", flexDirection: "row", borderTopWidth: 1, borderTopColor: "#41414144" },
  actionButton: {
    paddingTop: 5, paddingBottom: 5, paddingLeft: 20, paddingRight: 20, borderRadius: 50, margin: 3,
    backgroundColor: "white",
    borderColor: colors.primary,
    borderWidth: 1,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    padding: 10,
    shadowRadius: 1,
  },
  row: {
    flexDirection: "row"
  }
});
