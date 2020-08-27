import React, { Component } from 'react'
import { Text, StyleSheet, View, SafeAreaView, StatusBar, Platform } from 'react-native'
import { LoadingView, StepIndicator, ScrollViewCard } from '@component/views';
import { constants, colors } from '@config';
import { HeaderBackButton } from 'react-navigation-stack'



export default class DiseasesInsuranceScreen extends Component {

    _isMounted = false;


    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            steps: ["info"],
            currentStep: "info",
            scrollPosition: "top"
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
                                    Korporativ müştərilər üçün “Sağalmaz Xəstəliklərdən Sığorta” Məhsulu
                                </Text>

                                <Text style={styles.content}>
                                    “Sağalmaz xəstəliklərdən sığorta” məhsulu haqqında ideya dünya əhalisinin çox hissəsinin əziyyət çəkdiyi həyatı təhlükə törədən xəstəliklərlə mübarizədə dəstək olmaq məqsədi ilə düşünülmüşdür.
                                    {'\n\n'}
                                    Sağalmaz xəstəliklərdən sığorta məhsulu üzrə təminat verilən xəstəliklər qrupuna aşağıdakılar daxildir:
                                    {'\n\n'}
                                    {'\u2022 '}Xərçəng;{'\n'}
                                    {'\u2022 '}Miokard infarktı;{'\n'}
                                    {'\u2022 '}İnsult;{'\n'}
                                    {'\u2022 '}Terminal böyrək çatışmazlığı;{'\n'}
                                    {'\u2022 '}Tac arteriyaların cərrahi yolla müalicəsi;{'\n'}
                                    {'\u2022 '}Həyati əhəmiyyətə malik orqanların köçürülməsi;{'\n'}
                                    {'\u2022 '}Xroniki qaraciyər çatışmazlığın III-IV mərhələsi;{'\n'}
                                    {'\u2022 '}Dağınıq skleroz;{'\n'}
                                    {'\u2022 '}Termiki yanıqlar;{'\n'}
                                    {'\u2022 '}Bakterial meningit (meninqoensefalit);{'\n'}
                                    {'\u2022 '}Parkinson xəstəliyi (60 yaşadək tutulma);{'\n'}
                                    {'\u2022 '}Görmə qabiliyyətinin hər iki gözdə tam itirilməsi.{'\n'}
                                    {'\u2022 '}Müasir tibb ilkin mərhələdə müəyyən olunmuş bu xəstəliklərin müayinə və müalicəsində yetərli uğur əldə etmişdir.
                                    {'\n\n'}
                                    Lakin, sadalanan xəstəliklər nəticəsində müalicə xərclərinin ödənilməsi, həmçinin xəstə olan şəxsin uzun müddət qazancını itirməsi qaçılmazdır. Bu sığorta növü sayəsində ciddi maliyyə problemlərinin qarşısını almaq və xəstəlikdən qurtulmaq üçün sərfəli imkan əldə etmək mümkündür.
                                    {'\n\n'}
                                    Sığorta hadisəsi baş verdiyi halda, sığortalıya ödənilmiş sığorta məbləğinin məhz hansı xərclər üzrə sərf edilməsi ilə bağlı heç bir hesabat tələb olunmur.
                                    {'\n\n'}
                                    Məhsul günün 24 saatı və dünyanın istənilən yerində keçərlidir.
                                    {'\n\n'}
                                    Məhsulla bağlı əlavə məlumat üçün 1540 qısa nömrəsinə zəng edə bilərsiniz.
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
    header: {
        color: colors.primaryDark,
        fontWeight: "bold",
        marginBottom: 10,
        fontSize: constants.fonts.xlarge
    }
})
