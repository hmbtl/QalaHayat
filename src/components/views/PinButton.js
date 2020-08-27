import React, { PureComponent } from 'react'
import { Text, StyleSheet, View, TouchableHighlight, Image } from 'react-native'
import { constants, colors } from "@config"
import { verticalScale, moderateScale } from 'react-native-size-matters';


export default class PinButton extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            isUnderlay: false
        }
    }

    render() {

        const { text, image, imageStyle, ...otherProps } = this.props

        let textStyle = {
            color: this.state.isUnderlay ? colors.primary : "white"
        }

        if (text) {
            return (
                <View style={styles.container}>

                    <TouchableHighlight style={[styles.buttonContainer, { backgroundColor: "#41414144", }]}
                        underlayColor="white"
                        {...otherProps}

                        onShowUnderlay={() => this.setState({
                            isUnderlay: true
                        })}
                        onHideUnderlay={() => this.setState({
                            isUnderlay: false
                        })}

                    >
                        <View>
                            <Text style={[styles.text, textStyle]}>{text}</Text>

                        </View>
                    </TouchableHighlight>
                </View>

            )
        } else {
            return (
                <View style={styles.container}>

                    <TouchableHighlight style={styles.buttonContainer}
                        underlayColor={"transparent"}
                        {...otherProps}

                    >
                        <View>
                            <Image style={[styles.image, imageStyle]} source={image} />

                        </View>
                    </TouchableHighlight>
                </View>

            )
        }
    }


}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        margin: verticalScale(4),
        marginLeft: constants.ratio < 1.6 ? moderateScale(10) : moderateScale(7),
        marginRight: constants.ratio < 1.6 ? moderateScale(10) : moderateScale(7)

    },
    buttonContainer: {
        borderRadius: 50,
        height: constants.ratio < 1.93 ? (constants.ratio < 1.6 ? moderateScale(58) : verticalScale(65)) : moderateScale(72),
        width: constants.ratio < 1.93 ? (constants.ratio < 1.6 ? moderateScale(58) : verticalScale(65)) : moderateScale(72),
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        width: moderateScale(25),
        height: moderateScale(25),
        tintColor: "white"
    },
    text: {
        fontSize: constants.ratio < 1.93 ? (constants.ratio < 1.6 ? moderateScale(30) : verticalScale(30)) : moderateScale(35),
        color: "white"
    }
})
