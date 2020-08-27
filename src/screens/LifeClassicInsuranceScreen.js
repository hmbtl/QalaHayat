import React, { Component } from 'react'
import { Text, StyleSheet, View, SafeAreaView, StatusBar, Platform } from 'react-native'
import { Dialog, CardFlip, CardView, LoadingView, StepIndicator, Button, ScrollViewCard, ModalPicker, DatePicker, QalaInputText } from '@component/views';
import { constants, colors } from '@config';
import { verticalScale, moderateScale } from "react-native-size-matters"
import moment from "moment"
import api from '@services/api';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-community/async-storage';
import { HeaderBackButton } from 'react-navigation-stack'







export default class LifeClassicInsuranceScreen extends Component {

    _isMounted = false;


    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            steps: ["info", "calculator", "request"],
            currentStep: "info",
            scrollPosition: "top",
            buttonText: "Kalkluyatora keç",
            showDialog: false,
            infoDialog: false,
            flip: false,
            fields: {
                insurerStartDate: moment().format('DD.MM.YYYY')
            },
            errors: {},
            result: {}
        }

        this.changeStep = this.changeStep.bind(this);
        this.onPressButton = this.onPressButton.bind(this);
        this.setStateWithMount = this.setStateWithMount.bind(this);
        this.onPressStep = this.onPressStep.bind(this);
        this.onChangeField = this.onChangeField.bind(this);
        this.validate = this.validate.bind(this);
        this.calculate = this.calculate.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
        this.loadPrefs = this.loadPrefs.bind(this);

    }

    loadPrefs = async () => {
        const showWizardInfo = await AsyncStorage.getItem(constants.asyncKeys.showWizardInfo);

        this.setStateWithMount({
            infoDialog: showWizardInfo !== "no"

        });

    }


    calculate = async () => {
        this.setStateWithMount({
            isLoading: true
        });
        try {

            let fields = this.state.fields;
            const data = await api.calculateLifeClassic(
                fields['sex'].value,
                fields['birthday'],
                fields['insurerStartDate'],
                fields['insuranceLength'],
                fields['insurerAmount'],
                fields['warranty'].value
            );

            if (data.status == "error") {
                throw new Error(data.message)
            } else {

                // if success get user from data
                let result = data.data;

                this.setStateWithMount({
                    result: result
                })

                this.changeStep(this.state.currentStep, "request")
            }
        } catch (error) {
            console.log(error);
        } finally {
            this.setStateWithMount({
                isLoading: false
            });
        }
    }

    sendRequest = async () => {
        const mobileRegex = /^(50|55|77|70|99|51)[2-9][0-9]{6}$/i

        let isFormValid = true;

        let fields = this.state.fields;
        let errors = this.state.errors;

        if (!fields['phone']) {
            errors['phone'] = 'Zəhmət olmasa nömrənizi qeyd edin.';
            isFormValid = false;
        } else if (!mobileRegex.test(fields['phone'])) {
            errors['phone'] = 'Mobil nömrə səhvdir.';
            isFormValid = false;
        }

        const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        if (!fields['email']) {
            errors['email'] = 'Zəhmət olmasa emailiniz qeyd edin.';
            isFormValid = false;
        }else if(!emailRegex.test(fields['email'])) {
            errors['email'] = 'E-mail səhvdir.';
            isFormValid = false;
        }

        if (!fields['requestName']) {
            errors['requestName'] = 'Zəhmət olmasa Ad və Soyadınızı qeyd edin.';
            isFormValid = false;
        }

        if (isFormValid) {
            this.setStateWithMount({
                isLoading: true
            });
            try {

                const data = await api.requestInsurance('harmless', this.state.fields);

                if (data.status == "error") {
                    throw new Error(data.message)
                } else {
                    this.setStateWithMount({
                        fields: {
                            insurerStartDate: moment().format('DD.MM.YYYY')
                        },
                        errors: {},
                        showDialog: true,
                        currentStep: "calculator"
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
        } else {
            this.setStateWithMount({
                errors
            })
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.loadPrefs()

    }

    componentWillUnmount() {
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

    onPressStep = (step) => {
        this.changeStep(this.state.currentStep, step);
    }

    validate = () => {
        let fields = this.state.fields;
        let errors = {};
        let isFormValid = true;

        let birthday = moment(fields['birthday'], 'DD.MM.YYYY');
        let today = moment();

        let insurerStartDate = moment(fields['insurerStartDate'], 'DD.MM.YYYY');

        let diff = insurerStartDate.diff(birthday, 'years', true);

        if (today.diff(insurerStartDate, 'days') > 0) {
            errors['insurerStartDate'] = 'Sığorta müqaviləsinin başlama tarixi keçmiş tarixdə ola bilməz.';
            isFormValid = false;
        }

        if (!fields['birthday']) {
            errors['birthday'] = 'Zəhmət olmasa, doğum tarixinizi seçin.'
            isFormValid = false;
        } else if (diff < 18) {
            errors['birthday'] = 'Sığorta müqaviləsinin başlanma tarixində sığortalının yaşı minimum 18 olmalıdır.'
            isFormValid = false
        } else if (diff + fields['insuranceLength'] > 64) {
            if (fields['insuranceLength'] == 1) {
                errors['insurerStartDate'] = 'Sığorta müqaviləsinin müddətinin sonunda sığortalının yaşı təqaüd yaşından çox olmamalıdır.'
            } else {
                errors['insuranceLength'] = 'Sığorta müqaviləsinin müddətinin sonunda sığortalının yaşı təqaüd yaşından çox olmamalıdır.'
            }
            isFormValid = false
        }

        if (!fields['insurerAmount']) {
            errors['insurerAmount'] = 'Zəhmət olmasa, sığorta məbləğin daxil edin.'
            isFormValid = false;
        } else if (fields['insurerAmount'] < 500 || fields['insurerAmount'] > 50000) {
            errors['insurerAmount'] = 'Sığorta məbləği 500 AZN-dən 50 000 AZN-ə qədər olmalıdır.'
            isFormValid = false
        }

        this.setStateWithMount({ errors })
        return isFormValid;
    }

    changeStep = (currentStep, nextStep) => {
        let flip = this.state.flip;
        if (currentStep !== nextStep) {
            if (currentStep === "info" && nextStep !== "request") {
                flip = true;
            } else if (nextStep === "info") {
                flip = false;
            }

            let buttonText = this.state.buttonText;

            switch (nextStep) {
                case "info":
                    buttonText = "Kalkluyatora keç"
                    break;
                case "calculator":
                    buttonText = "Hesabla"
                    break;
                case "request":
                    buttonText = "Sorğu Göndər"
                    break;
                default:
                    break;
            }

            this.setState({
                flip: flip,
                currentStep: nextStep,
                buttonText: buttonText,
            })
        }
    }

    onPressButton = () => {
        let currentStep = this.state.currentStep;

        switch (currentStep) {
            case "info":
                this.changeStep(currentStep, "calculator")
                break;
            case "calculator":
                if (this.validate()) {
                    this.calculate()
                }
                break;
            case "request":
                this.sendRequest();
                break;

            default:
                break;
        }
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



                <Dialog
                    onOutsidePress={() => { this.setState({ infoDialog: false }) }}
                    onCancelPress={() => { this.setState({ infoDialog: false }) }}
                    animationType="fade"
                    onAcceptPress={() => { AsyncStorage.setItem(constants.asyncKeys.showWizardInfo, "no"); this.setState({ infoDialog: false }) }}
                    title="Məlumat"
                    cancelText="Bağla"
                    acceptText="Bir daha görsətmə"
                    transparent={true}
                    visible={this.state.infoDialog}
                    onRequestClose={() => this.setState({ infoDialog: false })}
                >
                    <View style={{ padding: 10 }}>

                        <Text style={{ fontSize: constants.fonts.xsmall, paddingBottom: 5 }}>
                            Kalkulyator və İnformasiya səhifələrini dəyişmək üçün bu düymələrdən istifadə edə bilərsiniz
                        </Text>
                        <StepIndicator
                            steps={this.state.steps}
                        />

                        <Text style={{ fontSize: constants.fonts.xsmall, paddingTop: 5, paddingBottom: 5 }}>
                            Seçdiyiniz səhifəyə keçid zamanı həmin işarə yaşıl rəngdə yanacaq
                        </Text>

                        <StepIndicator
                            steps={this.state.steps}
                            currentStep={"calculator"}
                        />

                        <Text style={{ fontSize: constants.fonts.xsmall, paddingTop: 5 }}>
                            Bu mesajı bir daha görməmək üçün aşağıda yerləşən "Bir daha görsətmə" düyməsinə basın
                        </Text>
                    </View>
                </Dialog>

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

                        <View style={{ flex: 1, alignItems: "center" }}>
                            <StepIndicator
                                steps={this.state.steps}
                                currentStep={this.state.currentStep}
                                onPressStep={this.onPressStep}
                            />
                        </View>

                        <View style={{ flex: 1 }}></View>

                    </View>
                    <CardFlip style={{ flex: 1 }} flip={this.state.flip} flipHorizontal={true} flipVertical={false} ref={(card) => this.card = card}>

                        <ScrollViewCard
                        >
                            <View style={{ flex: 1, padding: 20 }}>
                                <Text style={styles.header}>
                                    “Klassik Həyat sığortası” məhsulu
                                </Text>

                                <Text style={styles.content}>
                                    “Qala Həyat” Sığorta Şirkəti olaraq, Sizin üçün “Klassik Həyat sığortası” adlı məhsul yaratdıq.
                                    {'\n\n'}
                                    <Text style={styles.section}> MƏHSULU ÇOX ASANLIQLA ƏLDƏ ETMƏK MÜMKÜNDÜR:{'\n\n'}</Text>
                                    {'\u2022 '}Onlayn kalkulyatorda hesablamaq;{'\n'}
                                    {'\u2022 '}Daha sonra onlayn müraciət göndərməklə.{'\n'}
                                    {'\n'}
                                    <Text style={styles.section}>MƏHSULU KİMLƏR ƏLDƏ EDƏ BİLƏR:{'\n\n'}</Text>
                                    {'\u2022 '}Hüquqi və fiziki şəxslər.{'\n'}
                                    {'\n'}
                                    <Text style={styles.section}>TƏMİNAT:{'\n\n'}</Text>
                                    {'\u2022 '}İstənilən səbəbdən ölüm halı (sığorta müddəti ərzində ölüm halında sığorta ödənişi verilir).{'\n'}
                                    {'\n'}
                                    <Text style={styles.section}>ŞƏRTLƏRİMİZ:{'\n\n'}</Text>
                                    {'\u2022 '} Müqavilənin minimum müddəti: 1 il;{'\n'}
                                    {'\u2022 '}Sığorta olunın yaşı: 18-60 yaş;{'\n'}
                                    {'\u2022 '}Sığortanın qüvvədə olduğu ərazi: Bütün dünya;{'\n'}
                                    {'\u2022 '}Sığorta məbləği: 500 manatdan başlayaraq;{'\n'}
                                    {'\u2022 '}Sığorta haqqı: 5 manatdan başlayaraq.{'\n'}
                                    {'\n'}
                                    <Text style={styles.section}>SIĞORTA HAQQININ ÖDƏNİLMƏSİ{'\n\n'}</Text>
                                    {'\u2022 '}Aylıq, illik və birdəfəlik.{'\n'}{'\n'}
                                    <Text style={styles.section}>HANSI HALLARDA SIĞORTA ÖDƏNİŞİ VERİLİR:{'\n\n'}</Text>
                                Ölüm riski üzrə: Sığorta məbləğinin 100%-i faydalanan şəxsə ödənilir.{'\n'}
                                    {'\n\n'}
                                    <Text style={styles.section}>FAYDALANAN ŞƏXS KİMDİR:{'\n\n'}</Text>
                                    {'\u2022 '}Sığorta olunanın müqavilədə qeyd etdiyi şəxs.{'\n'}
                                    {'\n'}
                                Əlavə məlumat üçün 1540 qısa nömrəsinə zəng edə bilərsiniz.{'\n'}
                                    {'\n'}
                                </Text>
                            </View>
                        </ScrollViewCard>

                        <ScrollViewCard hideControl={true}>
                            {this.state.currentStep !== "request" &&
                                <View style={{ flex: 1, padding: 20 }}>
                                    <ModalPicker
                                        error={this.state.errors['sex']}
                                        onChange={(item) => { this.onChangeField("sex", item) }}
                                        label="Sığorta olunanın cinsi"
                                        data={[{ label: "Kişi", value: 1 }, { label: "Qadın", value: 2 }]}
                                        selected={this.state.fields['sex']}
                                    />
                                    <DatePicker
                                        label="Sığortalının doğum tarixi"
                                        placeholder="gg.aa.iiii"
                                        error={this.state.errors['birthday']}
                                        onChange={(date) => { this.onChangeField("birthday", date) }}
                                        date={this.state.fields['birthday']}

                                    />

                                    <DatePicker
                                        onChange={(date) => { this.onChangeField("insurerStartDate", date) }}
                                        label="Sığorta müqaviləsinin başlanma tarixi"
                                        error={this.state.errors['insurerStartDate']}
                                        placeholder="gg.aa.iiii"
                                        date={this.state.fields['insurerStartDate']}

                                    />

                                    <ModalPicker
                                        label="Müqavilənin müddəti (illik)"
                                        error={this.state.errors['insuranceLength']}
                                        data={[1, 2, 3, 4, 5]}
                                        onChange={(item) => { this.onChangeField("insuranceLength", item) }}
                                        selected={this.state.fields['insuranceLength']}
                                    />

                                    <QalaInputText
                                        placeholder="500-dən 50000-ə kimi"
                                        label="Sığorta məbləği"
                                        editable={true}
                                        maxLength={5}
                                        value={this.state.fields['insurerAmount']}
                                        error={this.state.errors['insurerAmount']}
                                        keyboardType={'numeric'}
                                        onChangeText={text => this.onChangeField('insurerAmount', text)}
                                        labelStyle={{ color: colors.primaryDark }}
                                        style={styles.inputStyle}
                                    />
                                    <ModalPicker
                                        label="Təminatlar"
                                        error={this.state.errors['warranty']}
                                        onChange={(item) => this.onChangeField("warranty", item)}
                                        data={[
                                            { value: 2, label: "Bədbəxt hadisə nəticəsində ölüm halından sığorta" },
                                            { value: 3, label: "Bədbəxt hadisə nəticəsində 1-ci Qrup əlillik" },
                                            { value: 4, label: "Bədbəxt hadisə nəticəsində 2-ci Qrup əlillik" },
                                            { value: 5, label: "Bədbəxt hadisə nəticəsində 3-cü Qrup əlillik" },
                                            { value: 6, label: "Bədbəxt hadisə nəticəsində 1 və 2-ci Qrup əlillik" },
                                            { value: 7, label: "Bədbəxt hadisə nəticəsində 1,2 və 3-cü Qrup əlillik" },
                                            { value: 8, label: "Bədbəxt hadisə nəticəsində ölüm və 1-ci Qrup əlillik" },
                                            { value: 9, label: "Bədbəxt hadisə nəticəsində ölüm və 2-ci Qrup əlillik" },
                                            { value: 10, label: "Bədbəxt hadisə nəticəsində ölüm və 3-cü Qrup əlillik" },
                                            { value: 11, label: "Bədbəxt hadisə nəticəsində ölüm, 1 və 2-ci Qrup əlillik" },
                                            { value: 12, label: "Bədbəxt hadisə nəticəsində ölüm, 1,2 və 3-cü Qrup əlillik" },
                                            { value: 13, label: "Həyatın istənilən səbəbdən ölüm halından sığortası" },
                                            { value: 14, label: "Həyatın istənilən səbəbdən ölüm və 1-ci Qrup əlillik" },
                                            { value: 15, label: "Həyatın istənilən səbəbdən ölüm və 2-ci Qrup əlillik" },
                                            { value: 16, label: "Həyatın istənilən səbəbdən ölüm və 3-cü Qrup əlillik" },
                                            { value: 17, label: "Həyatın istənilən səbəbdən ölüm, 1 və 2-ci Qrup əlillik" },
                                            { value: 18, label: "Həyatın istənilən səbəbdən ölüm, 1, 2 və 3-cü Qrup əlillik" }
                                        ]}
                                        selected={this.state.fields['warranty']}
                                    />

                                    <Text style={styles.belowText}>
                                        Təqaüd yaşı: 65{'\n'}
                                    Sığorta məbləği minimum: 500 AZN{'\n'}
                                    Sığorta məbləği maxsimum: 50 000 AZN{'\n'}
                                    Sağalmaz xəstəliklərdən sığorta: sığorta haqqı birdəfəlik və ya illik (hər il üçün yaşlanmaya uyğun sığorta haqqı dəyişir) ödənilir.{'\n'}
                                    Bədbəxt hadisə nəticəsində ölüm halından sığorta: sığorta haqqı birdəfəlik və ya illik ödənilir.{'\n'}
                                    Həyatın istənilən səbəbdən ölüm halından sığorta: sığorta haqqı birdəfəlik, illik və ya aylıq ödənilir.{'\n'}
                                    </Text>
                                </View>

                            }
                            {this.state.currentStep === "request" &&
                                < View
                                    style={{ flex: 1, padding: 20 }}
                                >
                                    <Text style={styles.header}>Nəticə</Text>
                                    <View style={styles.row}>
                                        <CardView
                                            style={[styles.headerCard]}
                                            cardElevation={4}
                                            cornerRadius={8}
                                        >
                                            <Text style={styles.headerLabel}>Yaş (İllərlə)</Text>
                                            <Text style={styles.headerText}>{this.state.result['yearDifference']}</Text>
                                        </CardView>

                                        <CardView
                                            style={[styles.headerCard]}
                                            cardElevation={4}
                                            cornerRadius={8}
                                        >
                                            <Text style={styles.headerLabel}>Müddət (aylarla)</Text>
                                            <Text style={styles.headerText}>{this.state.result['contractLengthMonth']}</Text>
                                        </CardView>

                                    </View>

                                    <CardView
                                        style={[styles.headerCard]}
                                        cardElevation={4}
                                        cornerRadius={8}
                                    >
                                        <Text style={styles.headerLabel}>Sığorta məbləği</Text>
                                        <Text style={styles.headerText}>{this.state.result['amount']} ₼</Text>
                                    </CardView>

                                    <CardView
                                        style={[styles.headerCard]}
                                        cardElevation={4}
                                        cornerRadius={8}
                                    >
                                        <Text style={styles.headerLabel}>Birdəfəlik sığorta haqqı</Text>
                                        <Text style={styles.headerText}>{this.state.result['oneTimePayment']} ₼</Text>
                                    </CardView>


                                    <CardView
                                        style={[styles.headerCard]}
                                        cardElevation={4}
                                        cornerRadius={8}
                                    >
                                        <Text style={styles.headerLabel}>İllik sığorta haqqı</Text>
                                        <Text style={styles.headerText}>{this.state.result['yearlyPayment']} {this.state.result['yearlyPayment'] === "-" ? '' : '₼'}</Text>
                                    </CardView>


                                    <QalaInputText
                                        placeholder="Ad, Soyad"
                                        label="Ad, Soyad"
                                        editable={true}
                                        value={this.state.fields['requestName']}
                                        onChangeText={(text) => { this.onChangeField("requestName", text) }}
                                        labelStyle={{ color: colors.primaryDark }}
                                        style={styles.inputStyle}
                                        containerStyle={{ marginTop: 20 }}
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
                                        label="E-mail"
                                        editable={true}
                                        value={this.state.fields['email']}
                                        onChangeText={(text) => { this.onChangeField("email", text) }}
                                        labelStyle={{ color: colors.primaryDark }}
                                        style={styles.inputStyle}
                                        error={this.state.errors['email']}
                                    />

                                    <Text style={styles.belowText}>
                                        Aşağıda yerləşən "Sorğu Göndər" düyməsinə basıb öz müraciətinizi bizə göndərin
                                       </Text>

                                </View>
                            }
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
    section: {
        fontSize: constants.fonts.medium,
        color: colors.primary,
    },
    belowText: {
        fontSize: constants.fonts.xxsmall,
        color: colors.blackLight,
        padding: 10
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
    header: {
        color: colors.primaryDark,
        fontWeight: "bold",
        marginBottom: 10,
        fontSize: constants.fonts.xlarge
    },
    headerCard: {
        flex: 1,
        height: moderateScale(70),
        margin: 3,
        backgroundColor: colors.primary
    },
    row: {
        flexDirection: "row"
    },
    headerLabel: {
        color: "white",
        fontSize: constants.fonts.xxsmall,
        fontWeight: "bold"
    },
    headerText: {
        color: "white",
        paddingTop: verticalScale(5),
        fontSize: constants.fonts.xlarge
    },
})
