import React, { Component } from 'react'
import { Text, StyleSheet, View, ScrollView, TouchableOpacity, TouchableHighlight, Image } from 'react-native'
import { Button, QalaInputText, CardView, Dialog, LoadingView } from '@component/views';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { images, constants, colors } from "@config"
import AsyncStorage from '@react-native-community/async-storage';
import Snackbar from 'react-native-snackbar';
import api from '@services/api';


export default class ProfileScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("action", "personal") === "personal" ? "Şəxsi Məlumatlarım" : "Şifrəni Dəyiş",
      headerRight: () => navigation.getParam("action", "personal") === "personal" ? null : (
        <TouchableOpacity
          onPress={navigation.getParam('updatePassword')}
          style={{
            right: 10,
            alignItems: 'flex-end',
            backgroundColor: 'transparent',
            paddingLeft: 15,
          }} >
          <Image style={{ width: 30, height: 30, tintColor: "white" }} source={images.checkmark} />
        </TouchableOpacity >
      ),
    };
  };


  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      asan: {
        pin_code: "0000",
      },
      showValidate: false,
      asanModal: false,
      isLoading: true,
      currentPasswordInput: "",
      newPasswordInput: "",
      confirmPasswordInput: "",
      modalLoading: false,
      asanPhoneInput: "",
      asanUserInput: "",
      timer: 120,
      user: {
        name: "",
        surname: "",
        fin_code: "",
        asan: null
      }
    }

    this.getUser = this.getUser.bind(this);
    this.onConnectAsan = this.onConnectAsan.bind(this);
    this.setStateWithMount = this.setStateWithMount.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onAcceptPress = this.onAcceptPress.bind(this);
    this.onCancelAsan = this.onCancelAsan.bind(this);
    this.verifyAsan = this.verifyAsan.bind(this);
  }

  componentDidMount() {
    // set component mounted
    this._isMounted = true;
    this.props.navigation.setParams({ updatePassword: this.onChangePassword });
    this.getUser();
  }

  componentWillUnmount() {
    // set component mounted false
    this._isMounted = false;
    clearInterval(this.countdown);
  }

  setStateWithMount = data => {
    if (this._isMounted) {
      this.setState(data);
    }
  };

  onChangePassword = async () => {
    if (this.state.currentPasswordInput === "" ||
      this.state.newPasswordInput === "" ||
      this.state.confirmPasswordInput === "") {
      Snackbar.show({
        text: "Zəruri sahələr doldurulmayıb",
        backgroundColor: '#de1623',
      });
    } else {
      if (this.state.newPasswordInput !== this.state.confirmPasswordInput) {
        Snackbar.show({
          text: "Şifrələr uyğun gəlmir.",
          backgroundColor: '#de1623',
        });
      } else {

        this.setStateWithMount({
          isLoading: true
        })

        try {
          const data = await api.updatePassword(this.state.currentPasswordInput, this.state.newPasswordInput);

          if (data.status == "error") {
            Snackbar.show({
              text: "Şifrə yalnışdır.",
              backgroundColor: '#de1623',
            });
          } else {
            this.setStateWithMount({
              newPasswordInput: "",
              currentPasswordInput: "",
              confirmPasswordInput: ""
            })

            Snackbar.show({
              text: "Şifrəniz müvəffəqiyyətlə dəyişdirildi.",
            });
          }
        } catch (e) {
          console.log(e);
          Snackbar.show({
            text: "Daxili sistem xətası.",
            backgroundColor: '#de1623',
          });
        } finally {
          this.setStateWithMount({ isLoading: false })
        }
      }
    }
  }


  verifyAsan = async () => {


    if (this.state.timer === 1) {
      clearInterval(this.countdown);
      this.setStateWithMount({
        showValidate: false
      })
      Snackbar.show({
        text: "Sorğu üçün ayrılmış müddət bitdi.",
        backgroundColor: '#de1623',
      });
    } else {
      this.setStateWithMount({
        timer: this.state.timer - 1
      });

      const data = await api.asanValidate(this.state.asan.transaction_id, true);

      if (data.status == "error") {
        clearInterval(this.countdown);

        this.setStateWithMount({
          showValidate: false
        })

        setTimeout(() => {
          Snackbar.show({
            text: data.message,
            backgroundColor: '#de1623',
          });
        }, 300)
      } else {

        // if success get user from data
        let userData = data.data;

        if (userData !== null) {
          clearInterval(this.countdown);

          let user = this.state.user;

          // store asan data
          user.asan = {
            asan_id: this.state.asanUserInput,
            phone_number: "+994" + this.state.asanPhoneInput
          }


          // store user information to storage
          await AsyncStorage.setItem(constants.asyncKeys.user, JSON.stringify(user));

          this.setStateWithMount({
            user: user,
            asanModal: false,
          })

          /* this.props.navigation.navigate("Pin", {
             action: "create"
           });
           */
        }

      }
    }

  }

  onAcceptPress = async () => {
    try {

      if (this.state.asanPhoneInput === "" || this.state.asanUserInput === "") {
        Snackbar.show({
          text: "Zəruri sahələr doldurulmayıb",
          backgroundColor: '#de1623',
        });
      } else {
        this.setStateWithMount({
          modalLoading: true
        });
        // get data from server
        const data = await api.authAsan(this.state.asanUserInput, "+994" + this.state.asanPhoneInput);

        if (data.status == "error") {
          Snackbar.show({
            text: data.message,
            backgroundColor: '#de1623',
          });
        } else {
          // if success get user from data
          let asan = data;


          if (asan.personal_code !== this.state.user.fin_code) {
            Snackbar.show({
              text: "Daxil etdiyiniz Asan Imza, istifadəçiyə aid deyil.",
              backgroundColor: '#de1623',
            });
          } else {

            this.setStateWithMount({
              asanModal: true,
              asan: asan,
              showValidate: true,
              timer: 120
            })

            this.countdown = setInterval(
              this.verifyAsan,
              1000
            );
          }

        }
      }

    } catch (e) {
      Snackbar.show({
        text: 'Daxil sistem xətası.',
        backgroundColor: '#de1623',
      });
    } finally {
      this.setStateWithMount({
        modalLoading: false
      });
    }
  }

  onCancelAsan = () => {
    if (this.state.showValidate) {
      clearInterval(this.countdown);
      this.setStateWithMount({
        showValidate: false
      })
    } else {
      this.setStateWithMount({
        asanPhoneInput: "",
        asanUserInput: "",
        asanModal: false
      })
    }
  }

  onConnectAsan = async () => {
    this.setStateWithMount({
      asanModal: true
    })
  }

  getUser = async () => {

    try {

      const userString = await AsyncStorage.getItem(constants.asyncKeys.user);
      const user = JSON.parse(userString);

      this.setStateWithMount({
        isLoading: true,
        user: user
      })

      // get data from server
      const data = await api.getUser();

      if (data.status == "error") {
        throw new Error(data.message)
      } else {
        // if success get user from data
        let user = data.data;

        // store user information to storage
        await AsyncStorage.setItem(constants.asyncKeys.user, JSON.stringify(user));

        this.setStateWithMount({
          user: user
        })
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setStateWithMount({
        isLoading: false
      })
    }

  }
  secondsToClock = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time - (minutes * 60);

    return minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
  }


  renderShowAsanLogin = () => {
    return (
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: constants.fonts.small, paddingBottom: 10 }}>
          Asan Imza melumatlarinizi daxil edin.
        </Text>

        <QalaInputText
          placeholder="Mobile nömrə"
          label="Mobile nömrə"
          preText="+994"
          value={this.state.asanPhoneInput}
          autoCapitalize="sentences"
          editable={true}
          maxLength={9}
          onChangeText={text => this.setState({ asanPhoneInput: text })}
          labelStyle={{ color: colors.asanimza }}
          style={[styles.inputStyle, { color: colors.blackLight }]}
        />

        <QalaInputText
          placeholder="XXXXXX"
          label="İstifadəçi İD-si"
          autoCapitalize="characters"
          value={this.state.asanUserInput}
          editable={true}
          onChangeText={text => this.setState({ asanUserInput: text })}
          maxLength={6}
          labelStyle={{ color: colors.asanimza }}
          style={[styles.inputStyle, { color: colors.blackLight }]}
        />


      </View>
    )
  }

  renderShowAsanValidate = () => {
    return (
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: constants.fonts.small }}>
          Lütfən, telefonunuza göndərilmiş sorğunu qəbul edin. Sorğunun yoxlama kodunun aşağıdakı kod ilə eyni olmasını müqayisə edin.
      </Text>

        <Text style={{ alignSelf: "center", padding: 10, fontSize: moderateScale(40), color: colors.blackLight }}>
          {this.secondsToClock(this.state.timer)}
        </Text>
        <View style={{ backgroundColor: colors.asanimza, borderRadius: 3, marginTop: 10 }}>

          <Text style={
            {
              fontSize: constants.fonts.small,
              padding: 5,
              borderRadius: 100,
              textAlign: "center",
              color: "white"
            }
          }>Yoxlama Kodu: {this.state.asan.pin_code}</Text>
        </View>


      </View>
    )
  }

  renderPassword = () => {

    return (
      <LoadingView
        style={styles.container}
        showBlur={true}
        isLoading={this.state.isLoading}
      >
        <ScrollView style={styles.container}>

          <View style={{ padding: 20 }}>
            <Text style={styles.sectionHeader}>Şifrə</Text>

            <View style={styles.card}>
              <QalaInputText
                placeholder="•••••••••"
                label="Hazır kı, şifrəniz"
                secureTextEntry={true}
                value={this.state.currentPasswordInput}
                onChangeText={text => this.setState({ currentPasswordInput: text })}
                labelStyle={{ color: colors.primaryDark }}
                style={[styles.inputStyle, { color: colors.blackLight }]}
              />

              <QalaInputText
                placeholder="•••••••••"
                label="Yeni şifrəniz"
                secureTextEntry={true}
                value={this.state.newPasswordInput}
                onChangeText={text => this.setState({ newPasswordInput: text })}
                labelStyle={{ color: colors.primaryDark }}
                style={[styles.inputStyle, { color: colors.blackLight }]}
              />

              <QalaInputText
                placeholder="•••••••••"
                label="Şifrəni təsdiqlə"
                secureTextEntry={true}
                value={this.state.confirmPasswordInput}
                onChangeText={text => this.setState({ confirmPasswordInput: text })}
                labelStyle={{ color: colors.primaryDark }}
                style={[styles.inputStyle, { color: colors.blackLight }]}
              />
            </View>

          </View>
        </ScrollView>
      </LoadingView>)
  }

  renderPersonal = () => {

    return (
      <LoadingView
        style={styles.container}
        showBlur={true}
        isLoading={this.state.isLoading}
      >


        <Dialog
          onCancelPress={this.onCancelAsan}
          animationType="fade"
          cancelText={this.state.showValidate ? "Dayandır" : "Bağla"}
          acceptText={this.state.showValidate ? undefined : "DAVAM ET"}
          onAcceptPress={this.onAcceptPress}
          isLoading={this.state.modalLoading}
          acceptTextStyle={{ color: colors.asanimza }}
          transparent={true}
          headerStyle={{ backgroundColor: "white" }}
          headerTextStyle={{ color: colors.asanimza }}
          headerIconStyle={{ tintColor: colors.asanimza }}
          visible={this.state.asanModal}
          headerIcon={images.asanimza}
          //onRequestClose={() => this.setStateWithMount({ asanModal: false })}
          title="Asan Imza"
        >
          {this.state.showValidate && this.renderShowAsanValidate()}
          {!this.state.showValidate && this.renderShowAsanLogin()}

        </Dialog>

        <ScrollView style={styles.container}>


          <View style={{ padding: 20 }}>
            <Text style={styles.sectionHeader}>Şəxsi</Text>

            <View style={styles.card}>
              <QalaInputText
                placeholder="Ad"
                label="Ad"
                value={this.state.user.name}
                autoCapitalize="sentences"
                editable={false}
                onChangeText={text => this.setState({ finTextInput: text })}
                labelStyle={{ color: colors.primaryDark }}
                style={styles.inputStyle}
              />

              <QalaInputText
                placeholder="Soyad"
                label="Soyad"
                value={this.state.user.surname}
                autoCapitalize="sentences"
                editable={false}
                onChangeText={text => this.setState({ finTextInput: text })}
                labelStyle={{ color: colors.primaryDark }}
                style={styles.inputStyle}
              />

              <QalaInputText
                placeholder="50XXXXXXX"
                label="FIN"
                value={this.state.user.fin_code}
                autoCapitalize="characters"
                onChangeText={text => this.setState({ finTextInput: text })}
                maxLength={7}
                editable={false}
                labelStyle={{ color: colors.primaryDark }}
                style={styles.inputStyle}
              />
            </View>

            <Text style={styles.sectionHeader}>Asan Imza</Text>

            {(this.state.user.asan != null) &&
              (
                <View style={[styles.card, { borderColor: colors.asanimza }]}>
                  <QalaInputText
                    placeholder="Mobil nömrə"
                    label="Mobil nömrə"
                    value={this.state.user.asan.phone_number}
                    autoCapitalize="sentences"
                    editable={false}
                    onChangeText={text => this.setState({ finTextInput: text })}
                    labelStyle={{ color: colors.asanimza }}
                    style={styles.inputStyle}
                  />

                  <QalaInputText
                    placeholder="50XXXXXXX"
                    label="İstifadəçi İD-si"
                    value={this.state.user.asan.asan_id}
                    autoCapitalize="characters"
                    editable={false}
                    onChangeText={text => this.setState({ finTextInput: text })}
                    maxLength={7}
                    labelStyle={{ color: colors.asanimza }}
                    style={styles.inputStyle}
                  />
                </View>
              )
            }

            {!this.state.user.asan &&
              (
                <TouchableHighlight
                  style={{ borderRadius: 8 }}
                  underlayColor={colors.asanimza}
                  onPress={this.onConnectAsan}
                >
                  <View style={[styles.card, { borderColor: colors.asanimza, padding: 10, marginBottom: 0, flexDirection: "row", alignItems: "center" }]}>
                    <Image
                      source={images.asanimza}
                      resizeMode="contain"
                      style={{ height: moderateScale(35), width: moderateScale(35), marginRight: 10, marginLeft: 5, tintColor: "#9327e8" }}
                    />
                    <Text style={{ fontSize: constants.fonts.small }}>Asan Imza-ya daxil olun</Text>
                  </View>
                </TouchableHighlight>

              )
            }
          </View>
        </ScrollView>
      </LoadingView>
    )
  }

  render() {

    const action = this.props.navigation.getParam("action", "personal");

    if (action === "personal") {
      return this.renderPersonal();
    } else {
      return this.renderPassword();
    }

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  sectionHeader: {
    marginBottom: verticalScale(10),
    fontSize: constants.fonts.small,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    color: colors.sectionHeader,
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
  card: {
    backgroundColor: "white",
    marginBottom: 25,
    borderRadius: 8,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    borderLeftWidth: 5,
    shadowOpacity: 0.3,
    borderWidth: 0.3,
    borderColor: colors.green,
    elevation: 4,
    padding: 10,
    shadowRadius: 1,
  }
})
