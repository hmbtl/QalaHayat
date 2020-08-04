import React, { Component } from 'react'
import { Text, StyleSheet, View, SafeAreaView, StatusBar, Platform } from 'react-native'
import { Dialog, CardFlip, QalaInputText, LoadingView, StepIndicator, Button, ScrollViewCard, ModalPicker, CardView } from '@component/views';
import { constants, colors } from '@config';
import { moderateScale, verticalScale } from "react-native-size-matters"
import AsyncStorage from '@react-native-community/async-storage';
import api from '@services/api';
import Snackbar from 'react-native-snackbar';
import { HeaderBackButton } from 'react-navigation-stack'




export default class CapitalInsuranceScreen extends Component {

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
            fields: {},
            errors: {},
            result: {},
            flip: false
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
            const data = await api.calculateCapital(
                fields['job'].value,
                fields['sex'].value,
                fields['age'],
                fields['insurance_length'],
                fields['is_usd'].value,
                fields['gross']
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

        if (!fields['age']) {
            errors['age'] = 'Zəhmət olmasa, yaşınızı daxil edin.'
            isFormValid = false;
        } else if (fields['age'] < 18) {
            errors['age'] = 'Sığorta müqaviləsinin başlanma tarixində sığortalının yaşı minimum 18 olmalıdır.'
            isFormValid = false
        } else if (fields['age'] > 62) {
            errors['age'] = 'Sığortalının yaşı maksimum 62 ola bilər.'
            isFormValid = false
        }

        if (!fields['gross']) {
            errors['gross'] = 'Zəhmət olmasa, gross sığorta haqqını daxil edin.'
            isFormValid = false;
        } else if (fields['gross'] < 50) {
            errors['gross'] = 'Sığortalının gross sığorta haqqı 50-dən çox olmalıdır.'
            isFormValid = false
        } else if (fields['gross'] > 50000) {
            errors['gross'] = 'Sığortalının gross sığorta haqqı 50000-dən aşağı olmalıdır.'
            isFormValid = false
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
                //this.card.flip();
                flip = true;
            } else if (nextStep === "info") {
                //this.card.flip();
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
                currentStep: nextStep,
                buttonText: buttonText,
                flip: flip
            })
        }
    }

    onPressButton = async () => {
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

                    <CardFlip style={{ flex: 1 }} flip={this.state.flip} flipHorizontal={true} flipVertical={false} clickable={false} friction={10}>

                        <ScrollViewCard>
                            <View style={{ flex: 1, padding: 20 }}>

                                <Text style={styles.header}>
                                    “Kapital” Sığorta Məhsulu
                                </Text>

                                <Text style={styles.content}>
                                    Yığım sığorta məhsulları sırasında üstünlüyü ilə sığortalanacaq şəxsin gəlirlərini artırmaqda ən yaxşı seçim imkanını “Kapital” sığorta məhsulu yaradır.
                                    {'\n\n'}
                                    Bu sığorta məhsulu Vergilər Məcəlləsinə və Sosial Sığorta haqqında qanununa əsaslanaraq əmək haqqından məcburi ayırmalardan azad olma hüququnu yaradır. Bu güzəştdən həm işçi, həm də işəgötürən yararlana bilir.
                                    {'\n\n'}
                                    Siz yığım etməklə yanaşı, “Qala Həyat” Sığorta Şirkəti bu sığorta məhsulu üzrə həyatın istənilən səbəbdən ölüm halından sığortalamaq imkanı verir.
                                    {'\n\n'}
                                    Nəticə etibarı ilə “Kapital” sığorta məhsulu həm sizə öz kapitalınızı toplamaqda yardım edir, həm həyatınızı gözlənilməz hadisələrdən olan risklərə qarşı sığortalayır, həmçinin yığılan məbləğə bonus proqramı tətbiq etməklə Sizə daha gəlirli gələcəyə doğru addımlamaqda yardım edir.
                                    {'\n\n'}
                                    “Kapital” sığorta məhsulu günün 24 saatı və dünyanın istənilən yerində keçərlidir.
                                    {'\n\n'}
                                    Siz “Kapital” Proqramı üzrə tətbiq olunmuş kalkulyator vasitəsi ilə hesablama apara bilərsiniz.
                                    {'\n\n'}
                                    Əlavə məlumat üçün 1540 qısa nömrəsinə zəng edə bilərsiniz.
                                    {'\n\n'}
                                </Text>
                            </View>
                        </ScrollViewCard>

                        <ScrollViewCard hideControl={true}>
                            {this.state.currentStep !== "request" &&
                                <View style={{ flex: 1, padding: 20 }}>
                                    <Text style={styles.header}>Kalkulyator</Text>
                                    <ModalPicker
                                        label="İş kateqoriyası"
                                        error={this.state.errors['job']}
                                        onChange={(item) => { this.onChangeField("job", item) }}
                                        data={[
                                            { label: "Qeyri-neft-qaz və qeyri-dövlət müəsisələri üçün", value: 1 },
                                            { label: "Neft-Qaz və Dövlət müəsisələri üçün", value: 2 }]}
                                        selected={this.state.fields['job']}
                                    />
                                    <ModalPicker
                                        label="Sığorta olunanın cinsi"
                                        error={this.state.errors['sex']}
                                        onChange={(item) => { this.onChangeField("sex", item) }}
                                        data={[{ label: "Kişi", value: 1 }, { label: "Qadın", value: 2 }]}
                                        selected={this.state.fields['sex']}

                                    />
                                    <QalaInputText
                                        placeholder="18-62"
                                        label="Sığorta olunanın yaşı"
                                        editable={true}
                                        maxLength={2}
                                        keyboardType="numeric"
                                        error={this.state.errors['age']}
                                        value={this.state.fields['age']}
                                        onChangeText={(text) => this.onChangeField("age", text)}
                                        labelStyle={{ color: colors.primaryDark }}
                                        style={styles.inputStyle}
                                    />
                                    <ModalPicker
                                        label="Sığorta müqaviləsinin müddəti (aylar)"
                                        error={this.state.errors['insurance_length']}
                                        onChange={(item) => { this.onChangeField("insurance_length", item) }}
                                        data={[36, 48, 60]}
                                        selected={this.state.fields['insurance_length']}
                                    />

                                    <ModalPicker
                                        error={this.state.errors['is_usd']}
                                        onChange={(item) => { this.onChangeField("is_usd", item) }}
                                        label="Sığorta haqqı ABŞ dollarına konvertasiya olunacaq?"
                                        data={[{ label: "Xeyr", value: false }, { label: "Bəli", value: true }]}
                                        selected={this.state.fields['is_usd']}
                                    />
                                    <QalaInputText
                                        placeholder="50-dən 50000-ə qədər"
                                        label="Gross Sığorta Haqqı"
                                        editable={true}
                                        value={this.state.fields['gross']}
                                        error={this.state.errors['gross']}
                                        onChangeText={text => this.onChangeField("gross", text)}
                                        labelStyle={{ color: colors.primaryDark }}
                                        style={styles.inputStyle}
                                    />

                                    <Text style={styles.belowText}>
                                        Gross sığorta haqqı Gross əmək haqqının 45% dən çox olmamalıdır.
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

                                    <View style={styles.row}>


                                        <CardView
                                            style={[styles.headerCard]}
                                            cardElevation={4}
                                            cornerRadius={8}
                                        >
                                            <Text style={styles.headerLabel}>Sığorta məbləği</Text>
                                            <Text style={styles.headerText}>{this.state.result['payment']} ₼</Text>
                                        </CardView>

                                        <CardView
                                            style={[styles.headerCard]}
                                            cardElevation={4}
                                            cornerRadius={8}
                                        >
                                            <Text style={styles.headerLabel}>Yekun Sığorta Haqqı</Text>
                                            <Text style={styles.headerText}>{this.state.result['amount']} ₼</Text>
                                        </CardView>

                                    </View>
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
    belowText: {
        fontSize: constants.fonts.xxsmall,
        color: colors.blackLight,
        padding: 10
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
    header: {
        color: colors.primaryDark,
        fontWeight: "bold",
        marginBottom: 10,
        fontSize: constants.fonts.xlarge
    }
})
