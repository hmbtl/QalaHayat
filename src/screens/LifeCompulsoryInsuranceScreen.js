import React, { Component } from 'react'
import { Text, StyleSheet, View, SafeAreaView, StatusBar, Platform } from 'react-native'
import { LoadingView, StepIndicator, ScrollViewCard } from '@component/views';
import { HeaderBackButton } from 'react-navigation-stack'


import { constants, colors } from '@config';

export default class LifeCompulsoryInsuranceScreen extends Component {

    _isMounted = false;


    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            steps: ["info"],
            currentStep: "info",
            scrollPosition: "top"
        }

        this.setStateWithMount = this.setStateWithMount.bind(this);
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

                    <View style={{ flex: 1 }} ref={(card) => this.card = card} >

                        <ScrollViewCard
                        >
                            <View style={{ flex: 1, padding: 20 }}>
                                <Text style={styles.header}>
                                    İstehsalatda bədbəxt hadisələr və peşə xəstəlikləri nəticəsində peşə əmək qabiliyyətinin itirilməsi hallarından icbari sığorta
                                </Text>

                                <Text style={styles.content}>
                                    <Text style={styles.section}>İŞÇİLƏRİNİZİ İCBARİ QAYDADA SIĞORTALAMAQLA ONLARIN VƏ AİLƏLƏRİNİN GƏLƏCƏYİNİ QORUMUŞ OLURSUNUZ!{'\n\n'}</Text>
                                "İstehsalatda bədbəxt hadisələr və peşə xəstəlikləri nəticəsində peşə əmək qabiliyyətinin itirilməsi hallarından icbari sığorta haqqında" Qanun, Azərbaycan Respublikasında istehsalatda bədbəxt hadisələr və peşə xəstəlikləri nəticəsində peşə əmək qabiliyyətinin itirilməsi hallarından icbari sığorta sahəsində münasibətləri tənzimləyir, bu münasibətlərin hüquqi, iqtisadi və təşkilati əsaslarını müəyyən edir, başqa sözlə, sığorta olunanların həyatına və sağlamlığına dəyən zərər nəticəsində onların peşə əmək qabiliyyətinin itirilməsi və ya ölümü ilə bağlı sığorta ödənişinin verilməsini nəzərdə tutur.
                                <Text style={styles.section}>{'\n\n'}BU NÖV ÜZRƏ AŞAĞIDAKI HALLARDA QEYD OLUNAN SIĞORTA TƏMİNATLARI NƏZƏRDƏ TUTULUB:{'\n\n'}</Text>
                                    {'\u2022 '}İstehsalatda bədbəxt hadisə və ya peşə xəstəliyi nəticəsində ölüm;{'\n'}
                                    {'\u2022 '}İstehsalatda bədbəxt hadisə və ya peşə xəstəlikləri nəticəsində peşə əmək qabiliyyətinin daimi və ya tam itirilməsi.{'\n'}
                                    <Text style={styles.section}>{'\n\n'}SIĞORTA TARİFİ:{'\n\n'}</Text>
                                Peşə risk dərəcəsindən və sığorta olunanların kateqoriyalarından asılı olaraq sığorta tarifi aşağıdakı kimi müəyyən edilir:{'\n\n'}
                                    {'\u2022 '}Qulluqçular üçün (rəhbərlər, mütəxəssislər, texniki icraçılar) illik əmək haqqı fondunun 0.2-0.5%;{'\n'}
                                    {'\u2022 '}Fəhlələr üçün illik əmək haqqı fondunun 0.4 - 2.0%;{'\n\n'}
                                Bu sığorta məhsulunun adından da məlum olduğu kimi mülkiyyət və təşkilati-hüquqi formasında asılı olmayaraq müəssisə, idarə və təşkilatlar, onların filial və nümayəndəlikləri, dövlət orqanları və digər qurumlar İcbari sığorta növü üzrə sığortalanmalıdır.{'\n\n'}

                                Sığorta müqaviləsi bağlanmadığı təqdirdə sığorta hadisəsi baş verərsə işəgötürən öz işçisi qarşısında bu qanunla müəyyən edilmiş sığorta təminatı həcmində məsuliyyət daşıyacaq. Həmçinin, qanunvericiliklə nəzərdə tutulmuş məbləğdə cərimələnəcək.{'\n\n'}

                                Əlavə məlumat üçün 1540 qısa nömrəmizlə əlaqə saxlaya bilərsiniz.
                            </Text>
                            </View>
                        </ScrollViewCard>
                    </View>

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
    header: {
        color: colors.primaryDark,
        fontWeight: "bold",
        marginBottom: 10,
        fontSize: constants.fonts.xlarge
    }
})
