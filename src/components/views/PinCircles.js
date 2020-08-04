import React, { PureComponent } from 'react'
import { StyleSheet, View } from 'react-native'
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { constants } from "@config"

export default class PinCircles extends PureComponent {

    renderCircle() {
        let circles = [];

        for (let i = 0; i < this.props.pinCount; i++) {

            if (i < this.props.value.length) {
                circles.push(<View
                    key={i}
                    style={styles.circle}
                />)
            } else {
                circles.push(<View
                    key={i}
                    style={styles.circleEmpty}
                />)
            }

        }

        return circles;
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderCircle()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row"
    },
    circle: {
        height: constants.ratio < 1.90 ? (constants.ratio < 1.6 ? moderateScale(20) : verticalScale(20)) : moderateScale(22),
        width: constants.ratio < 1.90 ? (constants.ratio < 1.6 ? moderateScale(20) : verticalScale(20)) : moderateScale(22),
        backgroundColor: "white",
        borderRadius: 50,
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 4,
        margin: moderateScale(3),
    },
    circleEmpty: {
        height: constants.ratio < 1.90 ? (constants.ratio < 1.6 ? moderateScale(20) : verticalScale(20)) : moderateScale(22),
        width: constants.ratio < 1.90 ? (constants.ratio < 1.6 ? moderateScale(20) : verticalScale(20)) : moderateScale(22),
        backgroundColor: "#414141",
        borderRadius: 50,
        margin: moderateScale(3),
        shadowOffset: { width: 2, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 4,
    }
})
