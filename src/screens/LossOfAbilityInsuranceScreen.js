import React, { Component } from 'react'
import { Text, StyleSheet, View, SafeAreaView, StatusBar, Platform } from 'react-native'
import { LoadingView, StepIndicator, ScrollViewCard } from '@component/views';
import { constants, colors } from '@config';
import { HeaderBackButton } from 'react-navigation-stack'



export default class LossOfAbilityInsuranceScreen extends Component {

    _isMounted = false;


    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            steps: ["info"],
            currentStep: "info",
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
                                    Əmək qabiliyyətinin itirilmәsi halından sığorta olunanın həyat sığortası
                                </Text>

                                <Text style={styles.content}>
                                    Biz, “Qala Həyat” Sığorta Şirkəti olaraq Sizin üçün “Əmək qabiliyyətinin itirilmәsi halından sığorta olunanın həyat sığortası” adlı məhsulu yaratdıq.
                                    {'\n\n'}
                                    <Text style={styles.section}>“QALA HƏYAT” SIĞORTA ŞİRKƏTİ SİZƏ BU FÜRSƏTİ TƏQDİM EDİR!{'\n\n'}</Text>
                                    İstehsalatda bədbəxt hadisə dedikdə əmək funksiyasını həyata keçirərkən sığorta olunanın bədən üzvlərinin, toxumalarının zədələnməsi ilə sağlamlığının qəflətən və kəskin pozulması halı nəzərdə tutulur. Bununla yanaşı, sığorta hadisəsi sığorta olunanın peşə əmək qabiliyyətinin müvəqqəti itirilməsi, əmək qabiliyyətinin olmaması vərəqəsi əsasında müəyyən edilir.
                                    {'\n\n'}
                                    <Text style={styles.section}>SIĞORTA TƏMİNATI:{'\n\n'}</Text>
                                    Sığortalı ilə bağlanmış əmək müqaviləsi əsasında əmək funksiyasını həyata keçirən sığorta olunanın istehsalatda bədbəxt hadisə nəticəsində peşə əmək qabiliyyətinin müvəqqəti itirməsi.{'\n\n'}
                                    <Text style={styles.section}>SIĞORTA ÖDƏNİŞİ:{'\n\n'}</Text>
                                    Sığorta hadisəsi üzrə sığorta ödənişinin həcmi aşağıdakı həddə müəyyən edilib:
                                    {'\n\n'}
                                    {'\u2022 '}sığorta olunan istehsalatda bədbəxt hadisə nəticəsində peşə əmək qabiliyyətini 7-14 gün müddətinə müvəqqəti itirmәsi halında 150 manat;{'\n'}
                                    {'\u2022 '}sığorta olunan istehsalatda bədbəxt hadisə nəticəsində peşə əmək qabiliyyətini 15-20 gün müddətinə müvəqqəti itirmәsi halında 300 manat;{'\n'}
                                    {'\u2022 '}sığorta olunan istehsalatda bədbəxt hadisə nəticəsində peşə əmək qabiliyyətini 21 gün və daha artıq müddətə müvəqqəti itirilməsi halında isə 500 manat.{'\n\n'}
                                    <Text style={styles.section}>FAYDALANAN ŞƏXS:{'\n\n'}</Text>
                                    Sığorta olunan.{'\n\n'}
                                    <Text style={styles.section}>SIĞORTANIN MÜDDƏTI:{'\n\n'}</Text>
                                    1 il.{'\n\n'}
                                    <Text style={styles.section}>GÖZLƏMƏ MÜDDƏTİ:{'\n\n'}</Text>
                                    7 (yeddi) gün{'\n\n'}
                                    Məhsulla bağlı ətraflı məlumat üçün 1540 qısa nömrəsinə zəng edə bilərsiniz.
                                    {'\n\n'}
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
