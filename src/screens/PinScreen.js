import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, ImageBackground, StatusBar, Alert, SafeAreaView, Platform, TouchableOpacity } from 'react-native'
import FingerprintScanner from 'react-native-fingerprint-scanner';
import { PinBoard } from "@component/layouts"
import { Button, PinCircles, Dialog } from "@component/views"
import { images, colors, constants } from "@config"
import { verticalScale, moderateScale, scale } from 'react-native-size-matters';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-community/async-storage';


export default class PinScreen extends Component {

    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            action: this.props.navigation.getParam("action", "auth"),
            pin: "",
            selectedPin: "",
            isSensorAvailable: true,
            biometryType: "",
            tryCount: 1,
            showModal: false,
            lostPasswordModal: false
        }

        //let brand = DeviceInfo.getBrand();
        // console.log(brand, constants.screenHeight, constants.screenWidth, Dimensions.get('window'))

        this.onPressUsePassword = this.onPressUsePassword.bind(this);
        this.onPinFinished = this.onPinFinished.bind(this);
        this.onBiometricsAccept = this.onBiometricsAccept.bind(this);
        this.onBiometricsCancel = this.onBiometricsCancel.bind(this);
        this.checkAuth = this.checkAuth.bind(this);
        this.setStateWithMount = this.setStateWithMount.bind(this);
        this.logout = this.logout.bind(this);

    }

    setStateWithMount = data => {
        if (this._isMounted) {
            this.setState(data);
        }
    };

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


    checkAuth = async () => {
        if (this.state.action === "auth") {

            const useBiometrics = await AsyncStorage.getItem(constants.asyncKeys.useBiometrics);

            if (useBiometrics === "yes") {
                if (this.state.isSensorAvailable) {
                    FingerprintScanner
                        .authenticate({ title: 'Biometrics ilə daxil olun' })
                        .then(() => {
                            // navigate to home screen
                            this.props.navigation.navigate("Home")
                        })
                        .catch((e) => {
                            console.log(e)
                        });
                }
            }


        }
    }

    onPressUsePassword() {
        this.setState({
            showPin: true
        });
    }

    onPinFinished = async pin => {
        // if user sees this page for the first time then ask them to 
        // create pin authorization
        if (this.state.action !== "auth") {
            if (this.state.selectedPin === "") {
                this.setStateWithMount({
                    selectedPin: pin,
                    pin: ""
                })
            } else {
                if (this.state.selectedPin === pin) {
                    // store pin to storage
                    await AsyncStorage.setItem(constants.asyncKeys.pin, pin);

                    if (this.state.action === "create") {
                        if (this.state.isSensorAvailable) {
                            this.setStateWithMount({
                                showModal: true,
                            });
                        } else {
                            // navigate to home screen
                            this.props.navigation.navigate("Home")
                        }
                    } else {
                        this.props.navigation.navigate("Setting")
                    }

                } else {
                    Snackbar.show({
                        text: 'Şifrələr uyğun gəlmədi, yenidən cəhd edin.',
                        backgroundColor: '#de1623',
                    });


                    this.setStateWithMount({
                        selectedPin: "",
                        pin: "",

                    })
                }
            }
        } else {

            let savedPin = await AsyncStorage.getItem(constants.asyncKeys.pin);
            // check if pin matches with stored pin 
            if (pin === savedPin) {
                this.props.navigation.navigate("Home")
            } else {
                let tryCount = this.state.tryCount;
                let lostPasswordModal = this.state.lostPasswordModal;
                console.log(tryCount)
                if (tryCount === 3) {
                    lostPasswordModal = true;
                    tryCount = 1;
                } else {
                    tryCount++;

                    Snackbar.show({
                        text: 'Daxil etdiyiniz şifrə yalnışdır.',
                        backgroundColor: '#de1623',
                    });
                }
                this.setStateWithMount({
                    pin: "",
                    tryCount: tryCount,
                    lostPasswordModal: lostPasswordModal
                })
            }
        }

    }


    onBiometricsAccept = async () => {
        try {
            // hide pin board 
            this.setStateWithMount({
                showPin: false,
                showModal: false
            });

            await FingerprintScanner
                .authenticate({ title: 'Biometrics ilə daxil olun' });

            await AsyncStorage.setItem(constants.asyncKeys.useBiometrics, "yes");

            this.props.navigation.navigate("Home")
        } catch (e) {
            console.log(e);
        }
    }

    onBiometricsCancel = async () => {
        // hide pin board 
        this.setStateWithMount({
            showModal: false
        })

        await AsyncStorage.setItem(constants.asyncKeys.useBiometrics, "no");

        // navigate to home screen
        this.props.navigation.navigate("Home")
    }

    componentDidMount() {
        // set component mounted
        this._isMounted = true;

        if (Platform.OS === "android" && Platform.Version < 23) {
            this.setStateWithMount({ isSensorAvailable: false })
        } else {
            FingerprintScanner
                .isSensorAvailable()
                .then(biometryType => this.setStateWithMount({ biometryType }))
                .catch(error => this.setStateWithMount({ isSensorAvailable: false }));
        }

        this.checkAuth();
    }

    componentWillUnmount = () => {
        // set component mounted false
        this._isMounted = false;
        FingerprintScanner.release();
    }

    renderPin() {

        let message = "Daxil olmaq üçün PİN-i daxil edin";

        if (this.state.action !== "auth") {
            if (this.state.selectedPin === "") {
                message = "Yeni PİN-i daxil edin";
            } else {
                message = "PİN-i təkrar daxil edin";
            }
        }

        return (
            <SafeAreaView
                style={styles.pinContainer}>

                <PinCircles
                    pinCount={4}
                    value={this.state.pin}
                />

                <Text
                    style={{
                        color: "white",
                        fontSize: constants.fonts.small,
                        padding: moderateScale(15),
                        textAlign: "center"
                    }}
                >
                    {message}
                </Text>
                <PinBoard
                    pinCount={4}
                    onPinChange={pin => this.setState({ pin })}
                    onPinFinished={this.onPinFinished}
                    pin={this.state.pin}
                    onTouchIdPress={() => { this.setState({ showPin: false }) }}
                />
                {this.state.action === "auth" &&
                    <TouchableOpacity
                        onPress={() => { this.setStateWithMount({ lostPasswordModal: true }) }}
                    ><Text style={{ fontSize: constants.fonts.small, textAlign: "center", padding: verticalScale(15), color: "white" }}>Şifrəni, unutmusunuz ?</Text>
                    </TouchableOpacity>
                }
            </SafeAreaView>
        )
    }

    render() {
        return (

            <ImageBackground
                source={images.newPinBackground}
                resizeMode="cover"
                style={{ width: '100%', height: "100%" }}>

                <StatusBar
                    backgroundColor="white"
                    barStyle="dark-content"
                    translucent={true}
                />


                <Dialog
                    onOutsidePress={() => { this.setState({ showModal: false }) }}
                    onCancelPress={this.onBiometricsCancel}
                    animationType="fade"
                    acceptText="Bəli, razıyam"
                    cancelText="Bağla"
                    transparent={true}
                    visible={this.state.showModal}
                    onAcceptPress={this.onBiometricsAccept}
                    onRequestClose={() => this.setState({ showModal: false })}
                    title={this.state.biometryType}
                    content={"Qala Hayat Mobile-a girmək üçün " + this.state.biometryType + " istifadə eləmək istəyirsiniz?"}
                />

                <Dialog
                    onOutsidePress={() => { this.setState({ lostPasswordModal: false }) }}
                    onCancelPress={() => { this.setState({ lostPasswordModal: false }) }}
                    animationType="fade"
                    acceptText="Bəli, hesabdan çıx"
                    cancelText="Bağla"
                    transparent={true}
                    visible={this.state.lostPasswordModal}
                    onAcceptPress={this.logout}
                    onRequestClose={() => this.setState({ lostPasswordModal: false })}
                    title="Şifrəni unutmusunuz?"
                    content={"Əgər, siz şifrənizi unutmusunuzsa hesabdan çıxıb və yenidən daxil ola bilərsiniz."}
                />



                <View style={styles.container}>
                    <Image
                        source={images.logoSmall}
                        style={styles.image}
                        resizeMode="contain"
                    />
                    {this.renderPin()}


                </View>

            </ImageBackground>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        flexDirection: "column",
        marginTop: constants.ratio < 1.93 ? (constants.ratio < 1.6 ? moderateScale(30) : moderateScale(20)) : moderateScale(50),
    },
    image: {
        marginTop: constants.ratio < 1.93 ? (constants.ratio < 1.6 ? moderateScale(0) : moderateScale(40)) : verticalScale(40),
        height: verticalScale(130),
    },
    pinContainer: {
        flex: 1,
        alignSelf: "center",
        marginTop: constants.ratio < 1.93 ? (constants.ratio < 1.6 ? verticalScale(65) : verticalScale(60)) : verticalScale(70)
    }


})
