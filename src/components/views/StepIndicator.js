import React, { PureComponent } from 'react'
import { Text, StyleSheet, View, Image, TouchableHighlight } from 'react-native'
import { colors, constants, images } from "@config"
import PropTypes from 'prop-types'


export default class StepIndicator extends PureComponent {

    constructor(props) {
        super(props);

        this.onPressStep = this.onPressStep.bind(this);
    }

    onPressStep = (step) => {
        if (this.props.onPressStep) {
            this.props.onPressStep(step)
        }
    }

    render() {
        const currentIndex = this.props.steps.indexOf(this.props.currentStep);

        const calculatorIndex = this.props.steps.indexOf("calculator");
        const requestIndex = this.props.steps.indexOf("request")

        return (
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 5, marginTop: 0 }}>
                {this.props.steps.includes("info") &&
                    <TouchableHighlight underlayColor={colors.blackLight} onPress={() => this.onPressStep("info")} style={[styles.circleFilled]}><Image style={{ tintColor: "white", height: 20, width: 20 }} source={images.info} /></TouchableHighlight>
                }
                {(this.props.steps.includes("calculator")) &&
                    <>
                        <View style={[styles.divider, { backgroundColor: currentIndex >= calculatorIndex ? colors.primary : "white" }]} />
                        <TouchableHighlight underlayColor={colors.blackLight} onPress={() => this.onPressStep("calculator")} style={currentIndex >= calculatorIndex ? styles.circleFilled : styles.circle}><Image style={{ tintColor: currentIndex >= calculatorIndex ? "white" : colors.primary, height: 20, width: 20 }} source={images.calculator} /></TouchableHighlight>
                    </>
                }
                {this.props.steps.includes("request") &&
                    <>
                        <View style={[styles.divider, { backgroundColor: currentIndex >= requestIndex ? colors.primary : "white" }]} />
                        <TouchableHighlight style={currentIndex >= requestIndex ? styles.circleFilled : styles.circle}><Image style={{ tintColor: currentIndex >= requestIndex ? "white" : colors.primary, height: 20, width: 20 }} source={images.send} /></TouchableHighlight>
                    </>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    divider: {
        width: 30,
        backgroundColor: "white",
        marginLeft: -5,
        marginRight: -5,
        zIndex: -100,
        borderColor: colors.primary,
        borderWidth: 1,
        height: 20,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.3,
        elevation: 4
    },
    circleFilled: {
        backgroundColor: colors.primary,
        width: 40,
        height: 40,
        alignItems: "center",
        borderColor: "white",
        borderWidth: 2,
        justifyContent: "center",
        borderRadius: 50,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        elevation: 4,
        shadowOpacity: 0.3,
    },
    circle: {
        backgroundColor: "white",
        width: 40,
        height: 40,
        borderColor: colors.primary,
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        elevation: 4,
        shadowOpacity: 0.3,
    }
})

StepIndicator.propTypes = {
    steps: PropTypes.array,
    currentStep: PropTypes.string,
    onPressStep: PropTypes.func,
}

StepIndicator.defaultProps = {
    steps: [],
    currentStep: '',
    onPressStep: () => { }
}