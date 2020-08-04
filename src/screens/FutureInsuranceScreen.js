import React, { Component } from 'react'
import { Text, StyleSheet, View, SafeAreaView, StatusBar, Platform } from 'react-native'
import { Dialog, CardFlip, LoadingView, CardView, StepIndicator, Button, ScrollViewCard, ModalPicker, QalaInputText, DatePicker } from '@component/views';
import { constants, colors } from '@config';
import { verticalScale, moderateScale } from "react-native-size-matters"
import api from '@services/api';
import moment from "moment"
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-community/async-storage';
import { HeaderBackButton } from 'react-navigation-stack'






export default class FutureInsuranceScreen extends Component {

    _isMounted = false;


    constructor(props) {
        super(props);

        var numbers60To300 = [];

        for (var i = 60; i <= 300; i++) {
            numbers60To300.push(i);
        }

        this.state = {
            isLoading: false,
            steps: ["info", "calculator", "request"],
            currentStep: "info",
            buttonText: "Kalkluyatora keç",
            numbers60To300: numbers60To300,
            showDialog: false,
            infoDialog: false,
            flip: false,
            fields: {
                "gross": "100",
                "paymentLengthOnDeath": "24",
                "paymentLengthOnLife": "1"
            },
            errors: {},
            result: {}
        }

        this.onPressButton = this.onPressButton.bind(this);
        this.setStateWithMount = this.setStateWithMount.bind(this);
        this.changeStep = this.changeStep.bind(this);
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
            const data = await api.calculateFuture(
                fields['birthday'],
                fields['contractLength'],
                fields['job'].value,
                fields['dsmf'].value,
                fields['gross'],
                fields['paymentLengthOnDeath'],
                fields['paymentLengthOnLife'],
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
                        fields: {},
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


    validate = () => {
        let fields = this.state.fields;
        let errors = {};
        let isFormValid = true;

        let today = moment();
        let birthday = moment(fields['birthday'], 'DD.MM.YYYY');
        let contractLengthYears = fields['contractLength'] / 12;

        let age = today.diff(birthday, 'years', true);


        if (!fields['birthday']) {
            errors['birthday'] = 'Zəhmət olmasa, doğum tarixinizi seçin.'
            isFormValid = false;
        } else if (age < 18) {
            errors['birthday'] = 'Sığorta müqaviləsinin başlanma tarixində sığortalının yaşı minimum 18 olmalıdır.'
            isFormValid = false;
        } else if (age + contractLengthYears > 64) {
            errors['birthday'] = 'Sığorta müqaviləsinin müddətinin sonunda sığortalının yaşı təqaüd yaşından çox olmamalıdır.'
            isFormValid = false;
        }

        if (!fields['gross']) {
            errors['gross'] = 'Zəhmət olmasa, aylıq sığorta haqqını daxil edin.'
            isFormValid = false;
        } else if (fields['gross'] < 50) {
            errors['gross'] = 'Aylıq Sığorta haqqı 50 AZN-dən çox olmalıdır.'
            isFormValid = false
        } else if (fields['gross'] > 100000) {
            errors['gross'] = 'Aylıq Sığorta haqqı 100000 AZN-dən aşağı olmalıdır.'
            isFormValid = false
        }

        if (!fields['paymentLengthOnLife']) {
            errors['paymentLengthOnLife'] = 'Zəhmət olmasa, yaşam halından sonra ödəniş olunacaq müddəti daxil edin.'
            isFormValid = false;
        } else if (fields['paymentLengthOnLife'] < 1) {
            errors['paymentLengthOnLife'] = 'Yaşam halından sonra ödəniş olunacaq müddəti 0-dan çox olmalıdır.'
            isFormValid = false;
        }

        if (!fields['paymentLengthOnDeath']) {
            errors['paymentLengthOnDeath'] = 'Zəhmət olmasa, ölüm halından sonra ödəniş olunacaq müddəti daxil edin.'
            isFormValid = false;
        } else if (fields['paymentLengthOnDeath'] < 24) {
            errors['paymentLengthOnDeath'] = 'Ölüm halından sonra ödəniş olunacaq müddəti 24-dən çox olmalıdır.'
            isFormValid = false;
        } else if (fields['paymentLengthOnDeath'] > 120) {
            errors['paymentLengthOnDeath'] = 'Ölüm halından sonra ödəniş olunacaq müddəti 120-dən aşağı olmalıdır.'
            isFormValid = false;
        }

        this.setStateWithMount({ errors })
        return isFormValid;
    }


    onPressStep = (step) => {
        this.changeStep(this.state.currentStep, step);
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

                        <View style={{ flex: 3, alignItems: "center" }}>
                            <StepIndicator
                                steps={this.state.steps}
                                currentStep={this.state.currentStep}
                                onPressStep={this.onPressStep}
                            />
                        </View>

                        <View style={{ flex: 1 }}></View>

                    </View>
                    <CardFlip style={{ flex: 1 }} flip={this.state.flip} clickable={false} flipHorizontal={true} flipVertical={false}  >

                        <ScrollViewCard>
                            <View style={{ flex: 1, padding: 20 }}>
                                <Text style={styles.header}>
                                    Təminatlı gələcək
                                </Text>

                                <Text style={styles.content}>
                                    <Text style={styles.section}>MƏHSULUN YARADILMASINDA MƏQSƏDİMİZ{'\n\n'}</Text>
                                    {'\u2022 '}İnsanların gələcək həyatlarını güvənli, təminatlı, problemsiz etmək;{'\n'}
                                    {'\u2022 '}Gəliri olan hər bir şəxsə və ailə üzvlərinə zəmanətli maliyyə təminatı əldə etmək imkanı vermək, hətda əmək haqqı almayan lakin hər ay övladı üçün müəyyən məbləği qənaət edib saxlayan valideyin belə bu məhsulun üstünlüklərini əldə edə bilər.{'\n'}
                                    {'\n'}
                                    <Text style={styles.section}>ÜMUMİ İZAH VƏ TƏMİNATLAR{'\n\n'}</Text>
                                    {'\u2022 '}Şəxs müqavilə müddəti ərzində müqavilə üzrə müəyyən olunmuş aylıq sığorta haqları ödəyir;{'\n'}
                                    {'\u2022 '}Sığorta ödənişini alan şəxslər (faydalanan şəxslər):{'\n'}
                                    {'    \u2022 '}Sığorta olunan vəfat etdikdə onun ailə üzvləri;{'\n'}
                                    {'    \u2022 '}Yaşaması halında sığorta olunanın özü.{'\n'}
                                    {'\u2022 '}Sığorta ödənişinin alınması qaydası:{'\n'}
                                    {'    \u2022 '}Müqavilə ilə müəyyən edilmiş müddət ərzində hər ay olmaqla təyin edilmiş məbləğdə annuitet (bərabər hissəli) şəkildə;{'\n'}
                                    {'    \u2022 '}Birdəfəlik şəkildə.{'\n'}
                                    {'\u2022 '}Sığorta haqlarının sabit olması mütləq deyildir, hər ay fərqli məbləğdə sığorta haqqı da ödəmək olar. Hər fərqli sığorta haqqı ödənişindən sonra sığorta məbləği yenidən hesablanacaqdır;{'\n'}
                                    {'\u2022 '}Sığorta məbləği hesablanarkən illik investisiya gəliri tətbiq edilir;{'\n'}
                                    {'\u2022 '}Ödənilmiş sığorta haqlarının həcmindən asılı olmayaraq sığorta müddəti ərzində sığorta olunan vəfat etdiyi halda sığorta məbləği tam şəkildə faydalanan şəxsə ödənilir.{'\n'}
                                    {'\n'}
                                    <Text style={styles.section}>MÜQAVİLƏ ÜZRƏ ƏSAS ŞƏRTLƏR{'\n\n'}</Text>
                                    {'\u2022 '}Sığorta olunanın sığorta müqaviləsi müddətinin sonunadək yaşaması halında sığorta məbləğinin 100 %-i ödənilir (sığorta müddəti ərzində ödənilmiş sığorta haqları + investisiya gəliri){'\n'}
                                    {'\u2022 '}Sığorta olunanın sığorta müqaviləsi ərzində ölməsi halında sığorta məbləğinin 100 %-i ödənilir (sığorta müddəti ərzində ödəməli olduğu sığorta haqları + investisiya gəliri){'\n'}
                                    {'\u2022 '}18 yaşından 60 yaşadək olan fiziki şəxslər{'\n'}
                                    {'\u2022 '}Sığorta olunan tərəfindən təyin olunmuş bir və ya bir neçə şəxs{'\n'}
                                    {'\u2022 '}Minimum sığorta haqqı 50 AZN{'\n'}
                                    {'\u2022 '}Müqavilə müddəti 5 ildən 25 ilə dək{'\n'}
                                    {'\n'}
                                </Text>
                            </View>
                        </ScrollViewCard>

                        <ScrollViewCard >
                            {this.state.currentStep !== "request" &&
                                <View style={{ flex: 1, padding: 20 }}>
                                    <DatePicker
                                        onChange={(date) => { this.onChangeField("birthday", date) }}
                                        label="Doğum tarixi"
                                        placeholder="gg.aa.iiii"
                                        error={this.state.errors['birthday']}
                                        date={this.state.fields['birthday']}
                                    />

                                    <ModalPicker
                                        label="Müqavilənin müddəti (aylarla)"
                                        error={this.state.errors['contractLength']}
                                        onChange={(item) => { this.onChangeField("contractLength", item) }}
                                        data={this.state.numbers60To300}
                                        selected={this.state.fields['contractLength']}
                                    />

                                    <ModalPicker
                                        label="İş yeri"
                                        error={this.state.errors['job']}
                                        onChange={(item) => { this.onChangeField("job", item) }}
                                        data={[
                                            { label: "Qeyri-neft-qaz və qeyri-dövlət müəsisələri üçün", value: 1 },
                                            { label: "Neft-Qaz və Dövlət müəsisələri üçün", value: 2 },
                                            { label: "Fiziki şəxs", value: 3 }]}
                                        selected={this.state.fields['job']}
                                    />

                                    <ModalPicker
                                        error={this.state.errors['dsmf']}
                                        onChange={(item) => { this.onChangeField("dsmf", item) }}
                                        label="İşəgötürən DSMF"
                                        data={[{ label: "Var", value: true }, { label: "Yoxdur", value: false }]}
                                        selected={this.state.fields['dsmf']}
                                    />

                                    <QalaInputText
                                        label="Aylıq Sığorta haqqı Gross"
                                        editable={true}
                                        placeholder="50-dən 100000-ə qədər"
                                        value={this.state.fields['gross']}
                                        error={this.state.errors['gross']}
                                        onChangeText={text => this.onChangeField("gross", text)}
                                        labelStyle={{ color: colors.primaryDark }}
                                        style={styles.inputStyle}
                                    />

                                    <QalaInputText
                                        label="Ölüm halından sonra ödəniş olunacaq müddət (Ay)"
                                        editable={true}
                                        placeholder="24-120"
                                        value={this.state.fields['paymentLengthOnDeath']}
                                        error={this.state.errors['paymentLengthOnDeath']}
                                        onChangeText={text => this.onChangeField("paymentLengthOnDeath", text)}
                                        labelStyle={{ color: colors.primaryDark }}
                                        style={styles.inputStyle}
                                    />

                                    <QalaInputText
                                        label="Yaşam halından sonra ödəniş olunacaq müddət (Ay)"
                                        editable={true}
                                        value={this.state.fields['paymentLengthOnLife']}
                                        error={this.state.errors['paymentLengthOnLife']}
                                        onChangeText={text => this.onChangeField("paymentLengthOnLife", text)}
                                        labelStyle={{ color: colors.primaryDark }}
                                        style={styles.inputStyle}
                                    />
                                </View>
                            }
                            {this.state.currentStep === "request" &&
                                <View style={{ flex: 1, padding: 20 }}>
                                    <Text style={styles.header}>Nəticə</Text>
                                    <View style={styles.row}>
                                        <CardView
                                            style={[styles.headerCard]}
                                            cardElevation={4}
                                            cornerRadius={8}
                                        >
                                            <Text style={styles.headerLabel}>Yaş (İllərlə)</Text>
                                            <Text style={styles.headerText}>{this.state.result['age']}</Text>
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
                                        <Text style={styles.headerLabel}>Aylıq Sığorta haqqı</Text>
                                        <Text style={styles.headerText}>{this.state.result['monthlyPayment']} ₼</Text>
                                    </CardView>

                                    <CardView
                                        style={[styles.headerCard]}
                                        cardElevation={4}
                                        cornerRadius={8}
                                    >
                                        <Text style={styles.headerLabel}>Yaşam halında Sığorta Məbləği</Text>
                                        <Text style={styles.headerText}>{this.state.result['insurancePriceOnDeath']} ₼</Text>
                                    </CardView>


                                    <CardView
                                        style={[styles.headerCard]}
                                        cardElevation={4}
                                        cornerRadius={8}
                                    >
                                        <Text style={styles.headerLabel}>Ölüm halında Sığorta Məbləği</Text>
                                        <Text style={styles.headerText}>{this.state.result['insuracePriceOnLife']} ₼</Text>
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
    belowText: {
        fontSize: constants.fonts.xxsmall,
        color: colors.blackLight,
        padding: 10
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
    }
})
