import React, { Component } from 'react';
import {
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  Switch,
  Platform,
  View,
  Image,
  Text,
} from 'react-native';
import { constants, images, colors } from '@config';
import AsyncStorage from '@react-native-community/async-storage';
import { verticalScale } from 'react-native-size-matters';
import { QalaInputText, LoadingView, CardView } from '@component/views';
import api from '@services/api';

export default class SettingScreen extends Component {


  /* static navigationOptions = ({ navigation }) => {
     return {
       headerRight: () => (
         <TouchableOpacity
           onPress={navigation.getParam('updateUser')}
           style={{
             right: 10,
             alignItems: 'flex-end',
             backgroundColor: 'transparent',
             paddingLeft: 15,
           }}>
           <Image style={{ width: 30, height: 30, tintColor: "white" }} source={images.checkmark} />
         </TouchableOpacity>
       ),
     };
   };
   */

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      useBiometrics: false,
    };

    this.onPress = this.onPress.bind(this);
    this.logout = this.logout.bind(this);
    this.loadPrefs = this.loadPrefs.bind(this);
    this.onBiometricsSwitch = this.onBiometricsSwitch.bind(this);
  }

  loadPrefs = async () => {
    const useBiometrics = await AsyncStorage.getItem(constants.asyncKeys.useBiometrics);

    this.setState({
      useBiometrics: useBiometrics === "yes"
    });

  }

  onPress = () => {
    console.log("test");
  }


  onBiometricsSwitch = async (value) => {
    await AsyncStorage.setItem(constants.asyncKeys.useBiometrics, value ? "yes" : "no");

    this.setState({
      useBiometrics: value
    })
  }


  logout = async () => {
    try {
      await AsyncStorage.removeItem(constants.asyncKeys.user);
      await AsyncStorage.removeItem(constants.asyncKeys.useBiometrics);
      await AsyncStorage.removeItem(constants.asyncKeys.showWizardInfo);

      this.props.navigation.navigate('Auth');
    } catch (exception) {
      console.log(exception)
    }
  }

  componentDidMount() {
    //this.getUserData();
    //this.props.navigation.setParams({updateUser: this.updateUserData});
    this.loadPrefs();
  }

  render() {
    return (
      <LoadingView
        style={{ flex: 1, backgroundColor: "white" }}
        showBlur={true}
        isLoading={this.state.isLoading}
      >

        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent={true}
        />
        <ScrollView style={styles.container}>


          <View style={{ flex: 1, padding: 20 }}>
            <Text style={styles.sectionHeader}>Hesab</Text>
            <View style={styles.card}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("Profile", {
                    action: "personal"
                  })
                }}
                activeOpacity={0.5}
              >
                <View style={styles.buttionContainer}>
                  <Text style={styles.sectionButton}>Şəxsi məlumatlarım</Text>
                  <Image
                    style={styles.chevron}
                    source={images.chevronRight}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("Profile", {
                    action: "password"
                  })
                }}
                activeOpacity={0.5}
              >
                <View style={styles.buttionContainer}>
                  <Text style={styles.sectionButton}>Şifrəni dayişin</Text>
                  <Image
                    style={styles.chevron}
                    source={images.chevronRight}
                  />
                </View>
              </TouchableOpacity>

            </View>
            <Text style={styles.sectionHeader}>Təhlükəsizlik</Text>
            <View style={[styles.card, { borderColor: colors.blueLight }]}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("Pin", {
                    action: "update"
                  });
                }}
                activeOpacity={0.4}
              >
                <View style={styles.buttionContainer}>
                  <Text style={styles.sectionButton}>PİN-i dəyişin</Text>
                  <Image
                    style={styles.chevron}
                    source={images.chevronRight}
                  />
                </View>
              </TouchableOpacity>
              <View
              >
                <View style={styles.buttionContainer}>
                  <Text style={styles.sectionButton}>Biometrics</Text>
                  <Switch
                    value={this.state.useBiometrics}
                    onValueChange={this.onBiometricsSwitch}
                    trackColor={{ true: colors.blueLight, false: colors.disabled }}
                    style={styles.switch}
                    thumbColor="white"
                  />
                </View>
              </View>
            </View>

            <Text style={styles.sectionHeader}>Seçimlər</Text>
            <View style={[styles.card, { borderColor: colors.yellow }]}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("Pin");
                }}
                activeOpacity={0.5}
              >
                <View style={styles.buttionContainer}>
                  <Text style={styles.sectionButton}>Kilidlə</Text>
                  <Image
                    style={styles.chevron}
                    source={images.chevronRight}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.logout}
                activeOpacity={0.5}
              >
                <View style={styles.buttionContainer}>
                  <Text style={styles.sectionButton}>Sistemdən çıx</Text>
                  <Image
                    style={styles.chevron}
                    source={images.chevronRight}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </LoadingView >


    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  chevron: {
    height: 20,
    width: 20,
    tintColor: "#41414199",
    marginRight: 5,
  },
  switch: {
    ...Platform.select({
      ios: {
        transform: [{ scaleX: .7 }, { scaleY: .7 }]
      }
    })
  },
  sectionHeader: {
    marginBottom: verticalScale(10),
    fontSize: constants.fonts.small,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    color: "#212121",
  },
  sectionButton: {
    padding: 10,
    fontWeight: "bold",
    color: "#313131",
    fontSize: constants.fonts.xsmall,
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
});
