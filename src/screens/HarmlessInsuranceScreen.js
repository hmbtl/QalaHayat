import React, { Component } from 'react'
import { Text, StyleSheet, View, SafeAreaView, StatusBar, Platform, TouchableHighlight, Image } from 'react-native'
import { Dialog, CardFlip, LoadingView, StepIndicator, Button, ScrollViewCard, ModalPicker, DatePicker, QalaInputText, CardView } from '@component/views';
import { verticalScale, moderateScale, scale } from "react-native-size-matters"
import { constants, images, colors } from '@config';
import Snackbar from 'react-native-snackbar';
import api from '@services/api';
import moment from "moment"
import AsyncStorage from '@react-native-community/async-storage';
import { HeaderBackButton } from 'react-navigation-stack'




export default class HarmlessInsuranceScreen extends Component {

    _isMounted = false;


    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            steps: ["info", "calculator", "request"],
            currentStep: "info",
            scrollPosition: "top",
            buttonText: "Kalkluyatora keç",
            calculatorType: "first",
            showDialog: false,
            infoDialog: false,
            flip: false,
            errors: {},
            fields: {
                insurerStartDate: moment().format('DD.MM.YYYY')
            },
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
            const data = await api.calculateHarmless(
                this.state.calculatorType === "first" ? 1 : 2,
                fields['sex'].value,
                fields['birthday'],
                fields['insurerStartDate'],
                fields['insurerAmount'],
                fields['percentage'].value
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
            errors['insurerStartDate'] = 'Sığorta müqaviləsinin başlanma tarixində sığortalının yaşı minimum 18 olmalıdır.'
            isFormValid = false
        } else if (diff > 64) {
            errors['insurerStartDate'] = 'Sığorta müqaviləsinin müddətinin sonunda sığortalının yaşı təqaüd yaşından çox olmamalıdır.'
            isFormValid = false
        }

        if (!fields['insurerAmount']) {
            errors['insurerAmount'] = 'Zəhmət olmasa, sığorta ' + (this.state.calculatorType === "second" ? "məbləğini" : "haqqını") + ' daxil edin.'
            isFormValid = false;
        } else if (fields['insurerAmount'] < 150 || fields['insurerAmount'] > 650000) {
            errors['insurerAmount'] = 'Sığorta ' + (this.state.calculatorType === "second" ? "məbləği" : "haqqı") + ' 150 AZN-dən 650 000 AZN-ə qədər olmalıdır.'
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
                buttonText: buttonText
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
                    this.calculate();
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

        let header = this.state.calculatorType === "first" ? "SIĞORTA MƏBLƏĞİ TAPILAN HAL" : "SIĞORTA HAQQI TAPILAN HAL";


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

                        <View style={{ flex: 3, alignItems: "center", }}>
                            <StepIndicator
                                steps={this.state.steps}
                                currentStep={this.state.currentStep}
                                onPressStep={this.onPressStep}
                            />
                        </View>

                        <View style={{ flex: 1 }}></View>

                    </View>

                    <CardFlip style={{ flex: 1 }} flip={this.state.flip} flipHorizontal={true} flipVertical={false} clickable={false}>

                        <ScrollViewCard
                        >
                            <View style={{ flex: 1, padding: 20 }}>
                                <Text style={styles.header}>
                                    “Zərərsiz və İtkisiz” Sığorta Məhsulu
                                </Text>

                                <Text style={styles.content}>
                                    “Qala Həyat” Sığorta Şirkəti olaraq Sizin üçün “Zərərsiz və İtkisiz” adlı yeni məhsul yaratdıq.
                                    {'\n\n'}
                                    Şərtlərimiz çox sadədədir:
                                    {'\n\n'}
                                    {'\u2022 '}Sizə uyğun olaraq, istədiyiniz və ödəyə biləcəyiniz sığorta haqqını özünüz təyin edirsiniz;
                                    {'\n'}
                                    {'\u2022 '}Biz isə Sizə həyatın ölüm halından və yaşam sığortası (sığorta müddəti ərzində heç bir hadisə baş vermədikdə belə sığorta ödənişi verilir) üzrə təminat veririk.
                                    {'\n\n'}
                                    <Text style={styles.section}>MƏHSULU NECƏ ƏLDƏ ETMƏK OLAR?{'\n\n'}</Text>

                                    {'\u2022 '}Onlayn kalkulyator vasitəsi ilə “A” və ya “B” paketlərindən özünüzə uyğun olanını seçirsiniz;
                                    {'\u2022 '}Daha sonra onlayn müraciət göndərirsiniz.
                                    {'\n\n'}
                                    <Text style={styles.section}>MƏHSULU KİMLƏR ALA BİLƏR:{'\n\n'}</Text>

                                    {'\u2022 '}Əmək qabiliyyəti olan fiziki şəxslər.{'\n\n'}
                                    <Text style={styles.section}>PAKETLƏR ÜZRƏ TƏMİNAT:{'\n\n'}</Text>

                                    {'\u2022 '}Yaşam halı (sığorta müddəti ərzində heç bir hadisə baş vermədikdə sığorta ödənişi verilir);
                                    {'\u2022 '}İstənilən səbəbdən ölüm halı (sığorta müddəti ərzində ölüm halında sığorta ödənişi verilir);
                                    {'\n\n'}
                                    <Text style={styles.section}>ŞƏRTLƏRİMİZ:{'\n\n'}</Text>

                                    {'\u2022 '}Müqavilənin minimum müddəti: 1 il;
                                    {'\u2022 '}Sığortalanın yaşı: 18-60 yaş;
                                    {'\u2022 '}Sığortanın qüvvədə olduğu ərazi: Bütün dünya.
                                    {'\n\n'}
                                    <Text style={styles.section}>“A PAKETİ” ÜZRƏ:{'\n\n'}</Text>

                                    {'\u2022 '}Sığorta məbləği: 500 AZN-dən başlayaraq;
                                    {'\u2022 '}Sığorta haqqı: 150 AZN-dən başlayaraq.
                                    {'\n\n'}
                                    <Text style={styles.section}>“B PAKETİ” ÜZRƏ:{'\n\n'}</Text>

                                    {'\u2022 '}Sığorta məbləği: 1000 AZN-dən başlayaraq;
                                    {'\u2022 '}Sığorta haqqı: 150 AZN-dən başlayaraq.
                                    {'\u2022 '}AŞAĞIDAKI HALLARDA SIĞORTA ÖDƏNİŞİ VERİLİR:
                                    {'\n\n'}
                                    <Text style={styles.section}>A PAKETİ:{'\n\n'}</Text>

                                    {'\u2022 '}Ölüm halında: Sığorta məbləğinin 100%-i faydalanan şəxsə ödənilir;
                                    {'\u2022 '}Yaşam halında sığorta haqqının 100%-i həcmində sığorta olunan və ya faydalanan şəxsə qaytarılır.
                                    {'\n\n'}
                                    <Text style={styles.section}>B PAKETİ:{'\n\n'}</Text>

                                    {'\u2022 '}Ölüm riski üzrə: Sığorta məbləğinin 100%-i faydalanan şəxsə ödənilir;
                                    {'\u2022 '}Yaşam halında sığorta haqqının 60%-i həcmində sığorta olunan və ya faydalanan şəxsə qaytarılır.
                                    {'\n\n'}
                                    <Text style={styles.section}>FAYDALANAN ŞƏXS:{'\n\n'}</Text>

                                    {'\u2022 '}Sığorta olunanın müqavilədə qeyd etdiyi şəxs.
                                    {'\n\n'}

                                </Text>
                            </View>
                        </ScrollViewCard>

                        <ScrollViewCard hideControl={true} >
                            {this.state.currentStep !== "request" &&
                                <View style={{ flex: 1, padding: 20 }}>
                                    <View style={{ flexDirection: "row", marginBottom: 20, justifyContent: "flex-start" }}>
                                        <TouchableHighlight
                                            style={{ flex: 1, marginRight: 5, borderRadius: 3 }} onPress={() => this.setStateWithMount({ calculatorType: "first" })}>
                                            <View style={[styles.calcSelector, { backgroundColor: this.state.calculatorType === "first" ? colors.primary : "white" }]}>
                                                <Text style={{ color: this.state.calculatorType === "first" ? "white" : colors.primary }}>Sığorta məbləği</Text>
                                            </View>
                                        </TouchableHighlight>
                                        <TouchableHighlight style={{ flex: 1, marginLeft: 5, borderRadius: 3 }} onPress={() => this.setStateWithMount({ calculatorType: "second" })}>
                                            <View style={[styles.calcSelector, { backgroundColor: this.state.calculatorType === "second" ? colors.primary : "white" }]}>
                                                <Text style={{ color: this.state.calculatorType === "second" ? "white" : colors.primary }}>Sığorta haqqı</Text>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                    <Text style={styles.header}>
                                        {header}
                                    </Text>

                                    <ModalPicker
                                        label="Sığortalının cinsi"
                                        error={this.state.errors['sex']}
                                        onChange={(item) => { this.onChangeField("sex", item) }}
                                        selected={this.state.fields['sex']}
                                        data={[{ label: "Kişi", value: 1 }, { label: "Qadın", value: 2 }]}

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

                                    <QalaInputText
                                        placeholder="150-dən 650000-ə kimi"
                                        label={this.state.calculatorType === "first" ? "Sığorta haqqı" : "Sığorta məbləği"}
                                        editable={true}
                                        maxLength={6}
                                        value={this.state.fields['insurerAmount']}
                                        error={this.state.errors['insurerAmount']}
                                        keyboardType={'numeric'}
                                        onChangeText={text => this.onChangeField('insurerAmount', text)}
                                        labelStyle={{ color: colors.primaryDark }}
                                        style={styles.inputStyle}
                                    />

                                    <ModalPicker
                                        label="Sığorta haqqının geri qaytarılma Faizi"
                                        error={this.state.errors['percentage']}
                                        data={[{ label: "60%", value: 60 }, { label: "100%", value: 100 }]}
                                        onChange={(item) => { this.onChangeField("percentage", item) }}
                                        selected={this.state.fields['percentage']}
                                    />
                                    <Text style={styles.belowText}>
                                        Ölüm halında 100% sığorta məbləği{'\n'}
                                    Yaşam halında sığorta haqqının 100% həcmində{'\n'}
                                    Minimum sığorta haqqı: 150 AZN{'\n'}
                                    Minumum sığorta məbləği: 450 AZN{'\n'}
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
                                            <Text style={styles.headerText}>{this.state.result['contractLength']}</Text>
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
                                        <Text style={styles.headerLabel}>Sığorta məbləği (yaşam halında)</Text>
                                        <Text style={styles.headerText}>{this.state.result['insuranceAmountOnLife']} ₼</Text>
                                    </CardView>


                                    <CardView
                                        style={[styles.headerCard]}
                                        cardElevation={4}
                                        cornerRadius={8}
                                    >
                                        <Text style={styles.headerLabel}>Sığorta məbləği (ölüm halında)</Text>
                                        <Text style={styles.headerText}>{this.state.result['insuranceAmountOnDeath']} ₼</Text>
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
    belowText: {
        fontSize: constants.fonts.xxsmall,
        color: colors.blackLight,
        padding: 10
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
    section: {
        fontSize: constants.fonts.medium,
        color: colors.primary,
    },
    header: {
        color: colors.primaryDark,
        fontWeight: "bold",
        marginBottom: 10,
        fontSize: constants.fonts.large
    },
    calcSelector: {
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
