import React, { Component } from 'react'
import { Text, StyleSheet, View, Image } from 'react-native'
import { CardView } from "@component/views"
import { constants, colors } from '@config';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';



export default class QalaProductButton extends Component {
    render() {
        const { icon, text, subText, onPress, disabled, containerStyle } = this.props


        if (disabled) {
            return (
                <CardView
                    style={[styles.container, { backgroundColor: "#F7F7F7" }, containerStyle]}
                    cornerRadius={10}
                    cardElevation={4}>
                    <View style={{
                        flex: 1,
                        backgroundColor: "green",
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Image
                            source={icon}
                            style={styles.icon}
                            resizeMode="stretch"></Image>
                        <Text style={styles.cardTextDisabled}>{text}</Text>
                        <View style={styles.soonContainer}>
                            <Text style={styles.soon}>Tezliklə</Text>
                        </View>
                    </View>

                </CardView>
            )
        } else {
            return (
                <View style={[{
                    flex: 1,
                }, containerStyle]}>
                    <CardView
                        onPress={onPress}
                        style={[styles.container,]}
                        cornerRadius={10}
                        cardElevation={4}>

                        <Image
                            source={icon}
                            style={styles.icon}
                            resizeMode="stretch"></Image>
                        <Text style={styles.cardText}>
                            {text}
                        </Text>
                        {subText &&
                            <Text style={[styles.cardText]}>{subText}</Text>
                        }

                    </CardView>
                </View>

            )
        }


    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        height: verticalScale(45),
        width: verticalScale(45),
    },
    cardText: {
        textAlign: 'center',
        color: '#414141dd',
        paddingLeft: scale(20),
        paddingRight: scale(20),
        paddingTop: verticalScale(7),
        fontSize: constants.fonts.xxsmall,
        fontWeight: "bold"
    },
    cardTextDisabled: {
        textAlign: 'center',
        color: colors.disabled,
        paddingLeft: scale(20),
        paddingRight: scale(20),
        fontSize: constants.fonts.xxsmall,
    },
    soonContainer: {
        position: 'absolute',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 3,
        paddingBottom: 3,
        flex: 1,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        bottom: 0,
        width: '100%',
        backgroundColor: colors.disabled,
    },
    soon: {
        color: 'white',
        textAlign: 'center',
        fontSize: moderateScale(7),
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
})
