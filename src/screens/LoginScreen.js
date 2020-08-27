import React, { Component } from 'react'
import { Text, StyleSheet, View, ImageBackground, StatusBar, Image, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import { Button, QalaInputText, CardView, Dialog, LoadingView } from '@component/views';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import AsyncStorage from '@react-native-community/async-storage';
import Snackbar from 'react-native-snackbar';
import api from '@services/api';
import { images, constants, colors } from "@config"
import { color } from 'react-native-reanimated';


export default class LoginScreen extends Component {

    _isMounted = false;

    constructor(props) {
        super(props)

        this.state = {
            asan: {
                "transaction_id": "827498606615871956",
                "personal_code": "3MM9SAW",
                "pin_code": "3898",
                "status": "success"
            },
            timer: 120,
            method: "fin",
            isLoading: false,
            asanModal: false,
            finTextInput: "",
            passwordTextInput: "",
            phoneTextInput: "",
            asanIdTextInput: "",
        }

        this.loginWithFin = this.loginWithFin.bind(this);
        this.loginWithAsan = this.loginWithAsan.bind(this);
        this.setStateWithMount = this.setStateWithMount.bind(this);
        this.verifyAsan = this.verifyAsan.bind(this);
        this.onCancelAsan = this.onCancelAsan.bind(this);
    }

    componentDidMount() {
        // set component mounted
        this._isMounted = true;
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

    onCancelAsan = async () => {
        console.log("timer stopped")
        clearInterval(this.countdown);
        this.setStateWithMount({
            asanModal: false
        })
    }

    verifyAsan = async () => {
        if (this.state.timer === 1) {
            clearInterval(this.countdown);

            Snackbar.show({
                text: "Sorğu üçün ayrılmış müddət bitdi.",
                backgroundColor: '#de1623',
            });

            this.setStateWithMount({
                asanModal: false
            })
            console.log("asan_info_exit", "should exit now");
        } else {
            this.setStateWithMount({
                timer: this.state.timer - 1
            });

            let data = await api.asanValidate(this.state.asan.transaction_id);

            console.log("asan_info_yes", data);

            if (data.status == "error") {
                console.log("should show error", data.message)

                this.setState({
                    asanModal: false
                })



                clearInterval(this.countdown);

                setTimeout(() => {
                    Snackbar.show({
                        text: data.message,
                        backgroundColor: '#de1623',
                    });
                }, 300)

            } else {
                // if success get user from data
                let user = data.data;


                if (user !== null) {
                    this.setStateWithMount({
                        asanModal: false,
                    });

                    // store asan data
                    user.asan = {
                        asan_id: this.state.asanIdTextInput,
                        phone_number: "+994" + this.state.phoneTextInput
                    }

                    // store user information to storage
                    await AsyncStorage.setItem(constants.asyncKeys.user, JSON.stringify(user));

                    this.props.navigation.navigate("Pin", {
                        action: "create"
                    });
                }

            }
        }

    }

    secondsToClock = (time) => {
        let minutes = Math.floor(time / 60);
        let seconds = time - (minutes * 60);

        return minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
    }

    loginWithAsan = async () => {
        try {

            if (this.state.phoneTextInput === "" || this.state.asanIdTextInput === "") {
                Snackbar.show({
                    text: "Zəruri sahələr doldurulmayıb",
                    backgroundColor: '#de1623',
                });
            } else {
                this.setStateWithMount({
                    isLoading: true
                });
                // get data from server
                const data = await api.authAsan(this.state.asanIdTextInput, "+994" + this.state.phoneTextInput);

                if (data.status == "error") {
                    Snackbar.show({
                        text: data.message,
                        backgroundColor: '#de1623',
                    });
                } else {
                    // if success get user from data
                    let asan = data;


                    this.setStateWithMount({
                        asanModal: true,
                        asan: asan,
                        timer: 120
                    })

                    this.countdown = setInterval(
                        this.verifyAsan,
                        1000
                    );

                }
            }

        } catch (e) {
            Snackbar.show({
                text: 'Daxil sistem xətası.',
                backgroundColor: '#de1623',
            });
        } finally {
            this.setStateWithMount({
                isLoading: false
            });
        }
    }

    loginWithFin = async () => {
        try {
            this.setStateWithMount({
                isLoading: true
            });

            // get data from server
            const data = await api.authFin(this.state.finTextInput, this.state.passwordTextInput);

            if (data.status == "error") {
                Snackbar.show({
                    text: 'Istifadəçi tapılmadı.',
                    backgroundColor: '#de1623',
                });
            } else {
                // if success get user from data
                let user = data.data;

                // store user information to storage
                await AsyncStorage.setItem(constants.asyncKeys.user, JSON.stringify(user));

                this.props.navigation.navigate("Pin", {
                    action: "create"
                });
            }

        } catch (e) {

            Snackbar.show({
                text: 'Daxil sistem xətası.',
                backgroundColor: '#de1623',
            });
        } finally {
            this.setStateWithMount({
                isLoading: false
            });
        }
    }

    renderFinForm() {
        return (<View
            style={{ padding: moderateScale(6) }}
        >

            <View
                style={{ paddingLeft: scale(7), paddingRight: scale(7), marginBottom: verticalScale(5) }}
            >
                <Text style={{ fontSize: constants.fonts.large, fontWeight: "bold", color: colors.primaryDark }}>Daxil ol</Text>
                <Text style={{ fontSize: constants.fonts.xxsmall, fontWeight: "normal", color: "#41414199" }}>Daxil olmaq üçün şəxsiyyət vəsiqənizdə olan FİN kodu və şifrənizi aşağıya daxil edin. </Text>
            </View>


            <QalaInputText
                placeholder="XXXXXXX"
                label="FIN"
                autoCapitalize="characters"
                onChangeText={text => this.setState({ finTextInput: text })}
                maxLength={7}
                value={this.state.finTextInput}
                labelStyle={{ color: colors.primaryDark }}
                style={styles.inputStyle}
            />

            <QalaInputText
                placeholder="•••••••••"
                label="Şifrə"
                secureTextEntry={true}
                onChangeText={text => this.setState({ passwordTextInput: text })}
                value={this.state.passwordTextInput}
                labelStyle={{ color: colors.primaryDark }}
                style={styles.inputStyle}
            />

            <Button
                color={colors.primary}
                text="Daxil ol"
                textColor={"white"}
                isLoading={this.state.isLoading}
                onPress={this.loginWithFin}
                containerStyle={{ marginTop: verticalScale(20) }}
            />

            <Text style={{ width: "100%", textAlign: "center", marginTop: 10, color: "#414141aa", fontSize: constants.fonts.xxsmall }}>
            </Text>

        </View>)
    }

    renderAsanForm() {
        return (<View
            style={{ padding: moderateScale(6) }}
        >

            <Dialog
                onCancelPress={this.onCancelAsan}
                animationType="fade"
                cancelText="Dayandır"
                transparent={true}
                headerStyle={{ backgroundColor: "white" }}
                headerTextStyle={{ color: colors.asanimza }}
                headerIconStyle={{ tintColor: colors.asanimza }}
                visible={this.state.asanModal}
                headerIcon={images.asanimza}
                //onRequestClose={() => this.setStateWithMount({ asanModal: false })}
                title="Asan Imza"
            >
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
            </Dialog>

            <View
                style={{ paddingLeft: scale(7), paddingRight: scale(7), marginBottom: verticalScale(5) }}
            >
                <Text style={{ fontSize: constants.fonts.large, fontWeight: "bold", color: colors.primaryDark }}>Daxil ol</Text>
                <Text style={{ fontSize: constants.fonts.xxsmall, fontWeight: "normal", color: "#41414199" }}>Daxil olmaq üçün <Text style={{ color: "black", fontWeight: "bold" }}>Asan İmza</Text> məlumatlarınızı  {"\n"}aşağıya daxil edin. </Text>
            </View>

            <QalaInputText
                placeholder="50XXXXXXX"
                label="Mobile nömrə"
                preText="+994"
                maxLength={9}
                autoCapitalize="characters"
                value={this.state.phoneTextInput}
                onChangeText={text => this.setState({ phoneTextInput: text })}
                keyboardType="numeric"
                labelStyle={{ color: colors.primaryDark }}
                style={styles.inputStyle}
            />

            <QalaInputText
                placeholder="XXXXXX"
                label="İstifadəçi İD-si"
                maxLength={6}
                value={this.state.asanIdTextInput}
                onChangeText={text => this.setState({ asanIdTextInput: text })}
                labelStyle={{ color: colors.primaryDark }}
                style={styles.inputStyle}

            />

            <Button
                color={colors.primary}
                text="Davam et"
                textColor={"white"}

                onPress={this.loginWithAsan}
                isLoading={this.state.isLoading}
                keyboardType="numeric"
                containerStyle={{ marginTop: verticalScale(20) }}
            />

            <Text style={{ width: "100%", textAlign: "center", marginTop: moderateScale(10), color: "#414141aa", fontSize: constants.fonts.xxsmall }}>

            </Text>

        </View>)
    }


    render() {
        return (

            <LoadingView
                style={{ flex: 1 }}
                showBlur={true}
                isLoading={false}>

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    keyboardVerticalOffset="-150"
                    behavior="position"
                >

                    <ImageBackground
                        source={images.newPinBackground}
                        style={{ width: '100%', height: constants.screenHeight < 600 ? '100%' : "100%" }}>
                        <StatusBar
                            backgroundColor="white"
                            barStyle="dark-content"
                            translucent={true}
                        />
                        <View style={styles.container}>
                            <Image
                                source={images.logoSmall}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </View>
                        <View style={{ flex: 2, padding: moderateScale(15), paddingTop: moderateScale(6) }}>
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ alignItems: "center", justifyContent: "center", flex: 1, }}>
                                    <TouchableOpacity
                                        activeOpacity={0.6}
                                        onPress={() => { this.setState({ method: "fin" }) }}
                                    >
                                        <View style={this.state.method === "fin" ? styles.tabSelected : styles.tab} >
                                            <Image
                                                style={{ width: verticalScale(20), height: verticalScale(20), tintColor: this.state.method === "fin" ? "white" : "#ffffffaa", }}
                                                resizeMode="contain"
                                                source={images.finid}
                                            />
                                            <Text style={this.state.method === "fin" ? styles.tabTextSelected : styles.tabText}>Fin kod</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={[styles.triangle, { borderBottomColor: this.state.method === "fin" ? "white" : "transparent" }]}></View>
                                </View>
                                <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
                                    <TouchableOpacity
                                        onPress={() => { this.setState({ method: "asanimza" }) }}
                                        activeOpacity={0.6}
                                    >
                                        <View style={this.state.method === "asanimza" ? styles.tabSelected : styles.tab}>
                                            <Image
                                                style={{ width: verticalScale(20), height: verticalScale(20), tintColor: this.state.method === "asanimza" ? "white" : "#ffffffaa" }}
                                                resizeMode="contain"
                                                source={images.asanimza}
                                            />
                                            <Text style={this.state.method === "asanimza" ? styles.tabTextSelected : styles.tabText}>Asan Imza</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={[styles.triangle, { borderBottomColor: this.state.method === "asanimza" ? "white" : "transparent" }]}></View>
                                </View>
                            </View>
                            <CardView
                                cornerRadius={10}
                                cardElevation={4}
                                style={styles.card}
                            >
                                {this.state.method === "fin" && this.renderFinForm()}
                                {this.state.method === "asanimza" && this.renderAsanForm()}
                            </CardView>
                        </View>
                    </ImageBackground>
                </KeyboardAvoidingView>

            </LoadingView>


        )

    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        flexDirection: "column",
        marginTop: constants.ratio < 1.9 ? (constants.ratio < 1.6 ? verticalScale(0) : verticalScale(30)) : verticalScale(50),
    },
    image: {
        marginTop: constants.ratio < 1.9 ? (constants.ratio < 1.6 ? verticalScale(50) : verticalScale(30)) : verticalScale(40),
        height: verticalScale(130),
    },
    inputStyle: {
        backgroundColor: "#DEDEDE88",
        borderColor: "#DEDEDEaa",
        color: "#414141",
        elevation: 0,
        height: moderateScale(45),
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
    },

    card: {
        elevation: 0,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        borderWidth: 0,
        shadowOpacity: 0,
        shadowRadius: 0,
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 13,
        borderRightWidth: 13,
        borderBottomWidth: 15,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'white'
    },

    tab: {
        flexDirection: "row", borderRadius: 60, marginBottom: 3, alignItems: "center"
    },
    tabText: {
        color: "#ffffffaa", fontSize: constants.fonts.xsmall, paddingLeft: scale(5), textTransform: "uppercase"
    },

    tabSelected: {
        flexDirection: "row",
        borderRadius: 50,
        marginBottom: verticalScale(5),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#87C34C",
        padding: verticalScale(4),
        width: scale(140),
        elevation: 5,
        borderWidth: 1,
        borderColor: "#ffffffbb",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 1,

    },
    tabTextSelected: { color: "#ffffff", fontSize: constants.fonts.xsmall, paddingLeft: verticalScale(10), textTransform: "uppercase" }


})
