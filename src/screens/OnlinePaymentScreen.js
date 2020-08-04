import React, { Component } from 'react'
import { Text, StyleSheet, View, ScrollView, TouchableHighlight } from 'react-native'
import { Button, QalaInputText, Dialog, LoadingView } from '@component/views';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { images, constants, colors } from "@config"
import Snackbar from 'react-native-snackbar';
import api from '@services/api';


export default class OnlinePaymentScreen extends Component {


    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            modal: false,
            isLocal: true,
            isFin: true,
            paymentAmount: 0,
            scroll: false,
            contract: null,
            errors: {},
            fields: {
                fin: "12N0Y77",
                certificateNumber: "MLI-BS-0000634"
            }
        }

        this.setStateWithMount = this.setStateWithMount.bind(this);
        this.search = this.search.bind(this);
        this.onPaymentAccept = this.onPaymentAccept.bind(this);
        this.onChangeField = this.onChangeField.bind(this);
    }

    componentDidMount() {
        // set component mounted
        this._isMounted = true;
    }

    componentWillUnmount() {
        // set component mounted false
        this._isMounted = false;
    }

    setStateWithMount = data => {
        if (this._isMounted) {
            this.setState(data);
        }
    };

    onChangeField = (field, value) => {
        let fields = this.state.fields;
        let errors = this.state.errors;

        fields[field] = value;
        errors[field] = "";

        this.setStateWithMount({
            fields,
            errors
        })
    }


    onPaymentAccept = () => {

        let contract = this.state.contract;
        let paymentAmount = contract.debt4;

        if (contract.premium_type.toLowerCase() === 'aylıq') {
            paymentAmount = contract.debt2;
        }

        if (contract.policy_number.startsWith("MLI")) {
            paymentAmount = 0.00
        }


        this.props.navigation.navigate("Payment", {
            amount: paymentAmount,
            debt: contract.debt4,
            finCode: this.state.fields['fin'],
            policyNumber: this.state.fields['certificateNumber'],
            insurerid: this.state.isLocal ? "" : contract.insurerid,
            isFromContracts: false
        })
    }

    search = async () => {
        let isFormValid = true;
        let errors = this.state.errors;
        let fields = this.state.fields;

        if (!fields['certificateNumber']) {
            errors['certificateNumber'] = "Zəhmət olmasa şəhadətnamə nömrəsin daxil edin"
            isFormValid = false
        }

        if (this.state.isFin) {
            if (!fields['fin']) {
                errors['fin'] = "Zəhmət olmasa FİN-i daxil edin."
                isFormValid = false
            }
        } else {
            if (!fields['voen']) {
                errors['voen'] = "Zəhmət olmasa VÖEN-i daxil edin."
                isFormValid = false
            }
        }

        this.setStateWithMount({
            errors
        })


        if (isFormValid) {
            this.setStateWithMount({
                isLoading: true,
                contract: null,
                paymentAmount: 0
            });

            try {

                let data = {};

                if (this.state.isFin) {
                    data = await api.getContractByFin(fields['certificateNumber'], fields['fin']);
                } else {
                    data = await api.getContractByVOEN(fields['certificateNumber'], fields['voen']);
                }

                if (data.status == "error") {
                    throw new Error(data.message)
                } else {
                    // if success get user from data
                    let contract = data.data;

                    if (contract !== null) {


                        let paymentAmount = contract.debt4;

                        if (contract.premium_type.toLowerCase() === 'aylıq') {
                            paymentAmount = contract.debt2;
                        }

                        this.setStateWithMount({
                            contract: contract,
                            paymentAmount: paymentAmount,
                            scroll: true
                        })

                    } else {
                        this.setStateWithMount({
                            modal: true
                        })
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

    }


    render = () => {
        let isMLI = false;


        let certificateNumber = this.state.fields['certificateNumber'];

        if (certificateNumber) {
            if (certificateNumber.startsWith("MLI")) {
                isMLI = true;
            }
        }

        return (
            <LoadingView
                style={styles.container}
                showBlur={true}
                isLoading={this.state.isLoading}
            >


                <Dialog
                    onOutsidePress={() => { this.setState({ modal: false }) }}
                    onCancelPress={() => { this.setState({ modal: false }) }}
                    title="Axtarış"
                    cancelText="Bağla"
                    transparent={true}
                    visible={this.state.modal}
                    onRequestClose={() => this.setState({ modal: false })}
                    content="Axtardığınız müqavilə tapılmadı. Zəhmət olmasa məlumatların düzgünlüyünü yoxlayın və yenidən cəhd edin."
                />

                <ScrollView style={styles.container}

                    ref={ref => { this.scrollView = ref }}
                    onContentSizeChange={() => {
                        if (this.state.scroll) {
                            this.scrollView.scrollToEnd({ animated: true })
                            this.setStateWithMount({ scroll: false })
                        }
                    }}
                >

                    <View style={{ padding: 20, paddingBottom: 50 }}>

                        <Text style={styles.sectionHeader}>Sığorta şəhadətnaməsini tapın</Text>


                        <View style={{ flexDirection: "row", marginBottom: 20, justifyContent: "flex-start" }}>
                            <TouchableHighlight
                                style={{ flex: 1, marginRight: 5, borderRadius: 3 }} onPress={() => this.setStateWithMount({ isFin: true })}>
                                <View style={[styles.selector, { backgroundColor: this.state.isFin ? colors.primary : "white" }]}>
                                    <Text style={{ color: this.state.isFin ? "white" : colors.primary }}>FIN ilə axtar</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={{ flex: 1, marginLeft: 5, borderRadius: 3 }} onPress={() => this.setStateWithMount({ isFin: false })}>
                                <View style={[styles.selector, { backgroundColor: !this.state.isFin ? colors.primary : "white" }]}>
                                    <Text style={{ color: !this.state.isFin ? "white" : colors.primary }}>VOEN ilə axtar</Text>
                                </View>
                            </TouchableHighlight>
                        </View>


                        <View style={styles.card}>
                            {this.state.isFin &&
                                <QalaInputText
                                    label="FİN"
                                    placeholder="məs. XXXXXXX"
                                    maxLength={7}
                                    autoCapitalize="characters"
                                    value={this.state.fields['fin']}
                                    error={this.state.errors['fin']}
                                    onChangeText={text => this.onChangeField('fin', text)}
                                    //onChangeText={text => this.setState({ fin: text })}
                                    labelStyle={{ color: colors.primaryDark }}
                                    style={[styles.inputStyle, { color: colors.blackLight }]}
                                />
                            }
                            {!this.state.isFin &&
                                <QalaInputText
                                    label="VOEN"
                                    //value={this.state.voen}
                                    //onChangeText={text => this.setState({ voen: text })}
                                    value={this.state.fields['voen']}
                                    error={this.state.errors['voen']}
                                    onChangeText={text => this.onChangeField('voen', text)}
                                    labelStyle={{ color: colors.primaryDark }}
                                    autoCapitalize="characters"
                                    style={[styles.inputStyle, { color: colors.blackLight }]}
                                />
                            }

                            <QalaInputText
                                label="Sığorta şəhadətnaməsinin nömrəsi*"
                                placeholder="məs. Fİ32188FN2"
                                autoCapitalize="characters"
                                //value={this.state.certificateNumber}
                                //onChangeText={text => this.setState({ certificateNumber: text })}
                                value={this.state.fields['certificateNumber']}
                                error={this.state.errors['certificateNumber']}
                                onChangeText={text => this.onChangeField('certificateNumber', text)}
                                labelStyle={{ color: colors.primaryDark }}
                                style={[styles.inputStyle, { color: colors.blackLight }]}
                            />

                            {isMLI &&
                                <View style={{ margin: 5 }}>
                                    <Text style={{
                                        fontSize: moderateScale(9),
                                        fontWeight: 'bold',
                                        color: colors.primaryDark,
                                        paddingLeft: 4,
                                        paddingBottom: 4,
                                    }}>İpoteka kreditin növünü seçin</Text>
                                    <View style={{ flexDirection: "row", margin: 5, alignItems: "center" }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                            <TouchableHighlight style={this.state.isLocal ? styles.radioSelected : styles.radio}
                                                onPress={() => this.setStateWithMount({ isLocal: true })}
                                                underlayColor={colors.primaryDark} >
                                                <View />
                                            </TouchableHighlight>
                                            <Text style={styles.radioText}>Daxili</Text>
                                        </View>

                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                            <TouchableHighlight style={!this.state.isLocal ? styles.radioSelected : styles.radio}
                                                onPress={() => this.setStateWithMount({ isLocal: false })}
                                                underlayColor={colors.primaryDark}
                                            >
                                                <View />
                                            </TouchableHighlight>
                                            <Text style={styles.radioText}>Dövlət</Text>
                                        </View>
                                    </View>
                                </View>
                            }



                        </View>
                        <Text style={styles.belowText}>
                            Tapmaq istədiyiniz şəhadətnamənin məlumatların doldurub aşağıda yerləşən "Axtar" düyməsinə basın.
                        </Text>
                        <Button
                            color={colors.primary}
                            text={"Axtar"}
                            onPress={this.search}
                            icon={images.search}
                            isLoading={this.state.isLoading}
                            containerStyle={{ margin: 0, marginTop: 5, marginBottom: 20 }}
                        />

                        {this.state.contract !== null &&
                            this.renderPayment(isMLI)
                        }
                    </View>
                </ScrollView>
            </LoadingView>
        )
    }

    renderPayment = (isMLI) => {
        return (

            <View>
                <Text style={styles.sectionHeader}>Ödəniş</Text>

                <View style={[styles.card, { borderColor: colors.blue }]}>

                    <QalaInputText
                        label="Sığorta şəhadətnaməsinin növü"
                        value={this.state.contract.insurance_name}
                        editable={false}
                        labelStyle={{ color: colors.blue }}
                        style={[styles.inputStyle]}
                    />

                    <QalaInputText
                        label="Sığorta şəhadətnaməsinin nömrəsi*"
                        value={this.state.contract.policy_number}
                        editable={false}
                        labelStyle={{ color: colors.blue }}
                        style={[styles.inputStyle]}
                    />

                    <QalaInputText
                        label="Sığortalı"
                        value={this.state.contract.pin_code}
                        editable={false}
                        labelStyle={{ color: colors.blue }}
                        style={[styles.inputStyle]}
                    />

                    {(isMLI && !this.state.isLocal) &&
                        <QalaInputText
                            label="Kredit kodu"
                            value={this.state.contract.insurerid}
                            autoCapitalize="characters"
                            editable={false}
                            labelStyle={{ color: colors.blue }}
                            style={[styles.inputStyle]}
                        />
                    }

                    {!isMLI &&
                        <View style={{ flexDirection: "row" }}>

                            <QalaInputText
                                label="Cari borc"
                                value={this.state.contract.debt4}
                                editable={false}
                                preText="₼"
                                containerStyle={{ flex: 1 }}
                                preTextStyle={{ color: colors.disabled }}
                                labelStyle={{ color: colors.blue }}
                                style={[styles.inputStyle, { flex: 1 }]}
                            />

                            <QalaInputText
                                label="Ödənişin məbləği"
                                editable={true}
                                value={this.state.paymentAmount}
                                keyboardType={"numeric"}
                                preText="₼"
                                onChangeText={text => this.setState({ paymentAmount: text })}
                                returnKeyType='done'
                                containerStyle={{ flex: 1 }}
                                labelStyle={{ color: colors.blue }}
                                style={[styles.inputStyle, { color: colors.blackLight }]}
                            />

                        </View>
                    }

                </View>
                <Text style={styles.belowText}>
                    Aşağıda yerləşən "Ödəyin" düyməsinə basdıqdan sonra siz ödəniş üçün 3dsecure saytına yönləndiriləcəksiniz
                        </Text>
                <Button
                    color={colors.blue}
                    underlayColor={colors.blueDark}
                    text={"Ödəyin"}
                    onPress={this.onPaymentAccept}
                    isLoading={false}
                    icon={images.payment}
                    containerStyle={{ margin: 0, marginTop: 5, marginBottom: 20 }}
                />
            </View>
        )
    }


    renderAA() {
        if (this.state.action === "payment") {
            return this.renderPayment();
        } else {
            return this.renderSearch();
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
    selector: {
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: colors.primary,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.3,
        padding: 10,
        shadowRadius: 1,
    },
    belowText: {
        fontSize: constants.fonts.xxsmall,
        color: colors.blackLight,
        padding: 10,
        paddingTop: 0,
        paddingBottom: 10
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
    },
    radioText: {
        fontSize: constants.fonts.small,
        marginRight: 20,
        color: colors.blackLight,
        fontWeight: "bold"
    },
    radio: {
        height: moderateScale(16),
        width: moderateScale(16),
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        backgroundColor: colors.white,
        borderWidth: 1,
        marginRight: 6,
        elevation: 4,
        shadowRadius: 1,
        shadowOpacity: 0.3,
        borderRadius: 50,
        borderColor: colors.primary,
    },
    radioSelected: {
        height: moderateScale(16),
        width: moderateScale(16),
        borderRadius: 50,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        backgroundColor: colors.white,
        borderWidth: 6,
        marginRight: 6,
        shadowOpacity: 0.3,
        elevation: 4,
        shadowRadius: 1,
        borderColor: colors.primary,
    }
})
