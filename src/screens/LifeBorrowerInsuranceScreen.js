import React, { Component } from 'react'
import { Text, StyleSheet, View, SafeAreaView, StatusBar, Platform } from 'react-native'
import { CardFlip, LoadingView, StepIndicator, Button, ScrollViewCard, ModalPicker, QalaInputText, DatePicker, Dialog } from '@component/views';
import { constants, colors } from '@config';
import { moderateScale } from "react-native-size-matters"
import Snackbar from 'react-native-snackbar';
import moment from "moment"
import api from '@services/api';
import { HeaderBackButton } from 'react-navigation-stack'




export default class LifeBorrowerInsuranceScreen extends Component {

    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            steps: ["info", "request"],
            currentStep: "info",
            buttonText: "Sorğuya keç",
            flip: false,
            showDialog: false,
            fields: {
                insurerStartDate: moment().format('DD.MM.YYYY')
            },
            errors: {}
        }

        this.onPressButton = this.onPressButton.bind(this);
        this.setStateWithMount = this.setStateWithMount.bind(this);
        this.changeStep = this.changeStep.bind(this);
        this.onPressStep = this.onPressStep.bind(this);
        this.checkIfEmpty = this.checkIfEmpty.bind(this);
        this.onChangeField = this.onChangeField.bind(this);
        this.validate = this.validate.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
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

    sendRequest = async () => {
        this.setStateWithMount({
            isLoading: true
        });
        try {

            const data = await api.requestInsurance('lifeborrower', this.state.fields);

            if (data.status == "error") {
                throw new Error(data.message)
            } else {
                this.setStateWithMount({
                    fields: {
                        insurerStartDate: moment().format('DD.MM.YYYY')
                    },
                    errors: {},
                    showDialog: true
                })
            }
        } catch (error) {
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

    onPressStep = (step) => {
        this.changeStep(this.state.currentStep, step);
    }


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

    changeStep = (currentStep, nextStep) => {
        let flip = this.state.flip;
        if (currentStep !== nextStep) {
            flip = true;

            let buttonText = this.state.buttonText;

            switch (nextStep) {
                case "info":
                    buttonText = "Sorğuya keç"
                    break;
                case "request":
                    buttonText = "Sorğu göndər"
                    break;
                default:
                    break;
            }

            this.setState({
                flip: flip,
                currentStep: nextStep,
                buttonText: buttonText
            })
        }
    }

    onPressButton = () => {
        let currentStep = this.state.currentStep;

        if (currentStep === "info") {
            this.changeStep(currentStep, "request")
        } else {

            if (this.checkIfEmpty()) {
                if (this.validate()) {
                    this.sendRequest();
                }
            }
        }
    }

    validate = () => {
        let isFormValid = true;
        let fields = this.state.fields;
        let errors = {};
        const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        const mobileRegex = /^(50|55|77|70|99|51)[2-9][0-9]{6}$/i

        let birthday = moment(fields['birthday'], 'DD.MM.YYYY');
        let insurerStartDate = moment(fields['insurerStartDate'], 'DD.MM.YYYY');
        let insurerEndDate = moment(fields['insurerEndDate'], 'DD.MM.YYYY');
        let today = moment();

        let age = insurerStartDate.diff(birthday, 'years', true);
        let insuranceDiff = insurerEndDate.diff(insurerStartDate, 'months', true);



        if (age < 18) {
            errors['birthday'] = 'Sığorta müqaviləsinin başlanma tarixində sığortalının yaşı minimum 18 olmalıdır.'
            isFormValid = false;
        } else if (age > 64) {
            errors['birthday'] = 'Sığorta müqaviləsinin müddətinin sonunda sığortalının yaşı təqaüd yaşından çox olmamalıdır.'
            isFormValid = false;
        } else {
            if (insuranceDiff > 0 && age * 12 + insuranceDiff >= 780) {
                errors['insurerEndDate'] = 'Sığorta müddəti ilə sığortalının yaşı təqaüd yaşından çox olmamalıdır.';
                isFormValid = false;
            }
        }

        if (fields['insurerAmount'] < 1 || fields['insurerAmount'] > 150000) {
            errors['insurerAmount'] = 'Sığorta məbləği 0-dan çox və 150 000 AZN-dən az olmamalıdır.'
            isFormValid = false;
        }

        if (fields['percentage'] < 2 || fields['percentage'] > 30) {
            errors['percentage'] = 'Kreditin illik faiz dərəcəsi 2% - 30% arası olmamalıdır.';
            isFormValid = false;
        }

        if (insuranceDiff <= 0) {
            errors['insurerEndDate'] = 'Sığortanın başlama tarixi bitmə tarixindən sonra gələ bilməz.';
            isFormValid = false;
        }

        if (!emailRegex.test(fields['email'])) {
            errors['email'] = 'E-mail səhvdir.';
            isFormValid = false;
        }

        if (!mobileRegex.test(fields['phone'])) {
            errors['phone'] = 'Mobil nömrə səhvdir.';
            isFormValid = false;
        }


        this.setStateWithMount({
            errors
        })

        return isFormValid;
    }

    checkIfEmpty = () => {
        let fields = this.state.fields;
        let errors = {};
        let isFormValid = true;

        if (!fields["percentage"]) {
            errors['percentage'] = 'Zəhmət olmasa kreditin illik faiz dərəcəsini daxil edin.'
            isFormValid = false;
        }

        if (!fields['birthday']) {
            errors['birthday'] = 'Zəhmət olmasa doğum tarixinizi qeyd edin.';
            isFormValid = false;
        }

        if (!fields['insurerEndDate']) {
            errors['insurerEndDate'] = 'Zəhmət olmasa sığortanın bitmə tarixin seçin.';
            isFormValid = false;
        }

        if (!fields['insurerAmount']) {
            errors['insurerAmount'] = 'Zəhmət olmasa sığorta məbləğin qeyd edin.';
            isFormValid = false;
        }

        if (!fields['requestName']) {
            errors['requestName'] = 'Zəhmət olmasa Ad və Soyadınızı qeyd edin.';
            isFormValid = false;
        }

        if (!fields['phone']) {
            errors['phone'] = 'Zəhmət olmasa nömrənizi qeyd edin.';
            isFormValid = false;
        }

        if (!fields['email']) {
            errors['email'] = 'Zəhmət olmasa emailiniz qeyd edin.';
            isFormValid = false;
        }

        this.setStateWithMount({
            errors
        })

        return isFormValid;
    }

    render() {
        return (
            <LoadingView
                style={styles.container}
                showBlur={true}
                isLoading={this.state.isLoading}
            >
                <StatusBar
                    backgroundColor="transparent"
                    barStyle="dark-content"
                    translucent={true}
                />
                <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === "android" ? 25 : 0 }}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 1, alignItems: "flex-start", justifyContent: "center" }}>
                            {Platform.OS === "android" &&
                                <HeaderBackButton
                                    onPress={() => this.props.navigation.goBack()}
                                    labelVisible={false}
                                    tintColor="black"
                                />
                            }
                        </View>

                        <View style={{ flex: 3, alignItems: "center" }}>
                            <StepIndicator
                                steps={this.state.steps}
                                currentStep={this.state.currentStep}
                                onPressStep={this.onPressStep}
                            />
                        </View>

                        <View style={{ flex: 1 }}></View>

                    </View>

                    <Dialog
                        onOutsidePress={() => { this.setState({ showDialog: false }) }}
                        onCancelPress={() => { this.setState({ showDialog: false }) }}
                        animationType="fade"
                        title="Müraciət"
                        cancelText="Bağla"
                        transparent={true}
                        visible={this.state.showDialog}
                        onRequestClose={() => this.setState({ showDialog: false })}
                        content="Bizi seçdiyiniz üçün təşəkkür edirik!
                        Müraciətiniz qeydə alındı. Qısa zaman civarında sizə cavab göndəriləcək."
                    />

                    <CardFlip style={{ flex: 1 }} flip={this.state.flip} flipHorizontal={true} flipVertical={false} >

                        <ScrollViewCard
                        >
                            <View style={{ flex: 1, padding: 20 }}>
                                <Text style={styles.header}>
                                    Kredit Üzrə Borcalanın Həyat Sığortası
                                </Text>
                                <Text style={styles.content}>
                                    Mövcud vəziyyətdə istənilən şəxs bankların təklif etdiyi kredit məhsullarından istifadə edir. Xüsusi ilə də, ipoteka və ya istehlak krediti götürən şəxslər uzun müddətli kredit ödəmək məcburiyyətində qalırlar. Şübhəsiz ki, hər bir insan sağlam, uzun ömür sürmək və öhdəsinə düşən bütün işləri zamanında həyata keçirmək istəyir. İpoteka və ya istehlak krediti götürən şəxsin həyatında gözlənilməz bədbəxt hadisə və ya xəstəlik halları baş verərsə götürülmüş kreditlərin ödənilməsində çətin vəziyyət yarana bilər.
                                    {'\n\n'}
                                    Məhz bu kimi halların aradan qaldırılması məqsədi ilə “Qala Həyat” Sığorta Şirkəti kredit üzrə borcalanın həyat sığortası məhsulunu təklif edir.
                                    {'\n\n'}
                                    Bu məhsul vasitəsi ilə istənilən şəxs götürdüyü krediti aşağıda qeyd olunan hər hansı bir səbəbdən ödəyə bilməyəcəyi hallarda sığorta şirkəti bu riski öz üzərinə götürür və borcalanın ipoteka və ya istehlak kreditinin ödənilməsini təmin edir. Bu hallar aşağıdakılardır:
                                    {'\n\n'}
                                    {'\u2022 '}Ölüm{'\n'}
                                    {'\u2022 '}I qrup əlillik{'\n'}
                                    {'\u2022 '}II qrup əlillik{'\n'}
                                    {'\u2022 '}III qrup əlillik{'\n'}
                                    {'\n'}
                                    Əlavə məlumat almaq üçün 1540 qısa nömrəsi ilə əlaqə saxlaya bilərsiniz.
                            </Text>
                            </View>
                        </ScrollViewCard>

                        <ScrollViewCard >
                            <View style={{ flex: 1, padding: 20 }}>
                                <ModalPicker
                                    error={this.state.errors['type']}
                                    onChange={(item) => { this.onChangeField("type", item) }}
                                    label="Kreditin növü"
                                    data={["İpoteka", "İstehlak"]}
                                    selected={this.state.fields['type']}
                                />
                                <ModalPicker
                                    label="Bank"
                                    error={this.state.errors['bank']}
                                    onChange={(item) => { this.onChangeField("bank", item) }}
                                    data={["AccessBank QSC", "AFB Bank ASC", "AGBank ASC",
                                        "Amrahbank ASC", "AtaBank ASC", "Azər Türk Bank ASC",
                                        "Azərbaycan Beynəlxalq Bankı ASC", "Azərbaycan Sənaye Bankı ASC",
                                        "Bank Avrasiya ASC", "Bank BTB ASC", "Bank Melli İran Bakı filialı",
                                        "Bank of Baku ASC", "Bank Respublika ASC", "Bank VTB (Azərbaycan) ASC",
                                        "Expressbank ASC", "Günay Bank ASC", "Xalq Bank ASC", "Kapital Bank ASC",
                                        "Muğanbank ASC", "Naxçıvanbank ASC", "NBCBank ASC", "Pakistan Milli Bankı NBP Bakı filialı",
                                        "PAŞA Bank ASC", "Rabitəbank ASC", "Premium Bank ASC", "TuranBank ASC", "Unibank KB ASC",
                                        "Yapı Kredi Bank Azərbaycan QSC", "Yelo Bank ASC", "Ziraat Bank Azerbaycan ASC",
                                    ]}
                                    selected={this.state.fields['bank']}
                                />


                                <QalaInputText
                                    label="Kreditin illik faiz dərəcəsi"
                                    placeholder="2-30"
                                    editable={true}
                                    value={this.state.fields['percentage']}
                                    maxLength={2}
                                    onChangeText={(text) => { this.onChangeField("percentage", text) }}
                                    labelStyle={{ color: colors.primaryDark }}
                                    style={styles.inputStyle}
                                    error={this.state.errors['percentage']}
                                    keyboardType={'numeric'}
                                />

                                <DatePicker
                                    onChange={(date) => { this.onChangeField("birthday", date) }}
                                    label="Sığortalının doğum tarixi"
                                    placeholder="gg.aa.iiii"
                                    date={this.state.fields['birthday']}
                                    error={this.state.errors['birthday']}
                                />

                                <DatePicker
                                    onChange={(date) => { this.onChangeField("insurerStartDate", date) }}
                                    label="Sığorta müqaviləsinin başlanma tarixi"
                                    placeholder="gg.aa.iiii"
                                    error={this.state.errors['insurerStartDate']}
                                    date={this.state.fields['insurerStartDate']}
                                />
                                <DatePicker
                                    onChange={(date) => { this.onChangeField("insurerEndDate", date) }}
                                    label="Sığorta müqaviləsinin bitmə tarixi"
                                    placeholder="gg.aa.iiii"
                                    error={this.state.errors['insurerEndDate']}
                                    date={this.state.fields['insurerEndDate']}
                                />

                                <QalaInputText
                                    label="Sığorta məbləği"
                                    placeholder="1-150000"
                                    editable={true}
                                    value={this.state.fields['insurerAmount']}
                                    onChangeText={(text) => { this.onChangeField("insurerAmount", text) }}
                                    labelStyle={{ color: colors.primaryDark }}
                                    style={styles.inputStyle}
                                    keyboardType={'numeric'}
                                    error={this.state.errors['insurerAmount']}
                                />

                                <QalaInputText
                                    placeholder="Ad, Soyad"
                                    label="Ad, Soyad"
                                    editable={true}
                                    value={this.state.fields['requestName']}
                                    onChangeText={(text) => { this.onChangeField("requestName", text) }}
                                    labelStyle={{ color: colors.primaryDark }}
                                    style={styles.inputStyle}
                                    error={this.state.errors['requestName']}
                                />

                                <QalaInputText
                                    label="Mobil nömrəsi"
                                    editable={true}
                                    preText="+994"
                                    value={this.state.fields['phone']}
                                    onChangeText={(text) => { this.onChangeField("phone", text) }}
                                    labelStyle={{ color: colors.primaryDark }}
                                    style={styles.inputStyle}
                                    maxLength={9}
                                    error={this.state.errors['phone']}
                                />

                                <QalaInputText
                                    value={this.state.fields['email']}
                                    label="E-mail"
                                    editable={true}
                                    onChangeText={(text) => { this.onChangeField("email", text) }}
                                    labelStyle={{ color: colors.primaryDark }}
                                    style={styles.inputStyle}
                                    error={this.state.errors['email']}
                                />
                                <Text style={styles.belowText}>
                                    Təqaüd yaşı: 65{'\n'}
                                    Sığorta məbləği maxsimum: 150 000 AZN{'\n'}
                                </Text>
                            </View>
                        </ScrollViewCard>
                    </CardFlip>

                    <Button
                        color={colors.primary}
                        text={this.state.buttonText}
                        onPress={this.onPressButton}
                        isLoading={this.state.isLoading}
                        containerStyle={{ margin: 10, marginTop: 5, marginBottom: 20 }}
                    />
                </SafeAreaView>
            </LoadingView >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    content: {
        flex: 1,
        color: colors.blackLight,
        fontSize: constants.fonts.small
    },
    inputStyle: {
        backgroundColor: colors.inputBackground,
        borderColor: colors.inputBorder,
        elevation: 0,
        height: moderateScale(45),
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
    },
    belowText: {
        fontSize: constants.fonts.xxsmall,
        color: colors.blackLight,
        padding: 10
    },
    header: {
        color: colors.primaryDark,
        fontWeight: "bold",
        marginBottom: 10,
        fontSize: constants.fonts.xlarge
    }
})
