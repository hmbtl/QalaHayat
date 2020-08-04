import React, { Component } from 'react'
import { Text, StyleSheet, View, Modal, TouchableWithoutFeedback, TouchableOpacity, Image } from 'react-native'
import { colors, constants } from "@config"
import { LoadingView } from "@component/views"
import { moderateScale, verticalScale } from 'react-native-size-matters';


export default class Dialog extends Component {
    render() {

        const { onOutsidePress, title, headerStyle, footerStyle, style,
            onCancelPress, onAcceptPress, acceptText, cancelText, headerIcon, headerIconStyle,
            headerTextStyle, isLoading,
            acceptTextStyle, cancelTextStyle, content, contentStyle, containerStyle,
            ...otherProps } = this.props;
        return (
         
                <Modal
                    animationType="fade"
                    transparent={false}
                    statusBarTranslucent={true}
                    {...otherProps}
                >
                    <TouchableWithoutFeedback
                        onPress={onOutsidePress}
                    >


                        <View
                            style={[styles.container, containerStyle]}>


                            <TouchableWithoutFeedback>
                                <View style={[styles.bodyContainer, style]}>
                                    <LoadingView
                                        isLoading={isLoading}
                                        showBlur={true}
                                    >
                                        {title &&
                                            <View style={[styles.headerContainer, headerStyle]}>
                                                {headerIcon &&
                                                    <Image
                                                        style={[styles.headerIconStyle, headerIconStyle]}
                                                        resizeMode="contain"
                                                        source={headerIcon} />
                                                }
                                                <Text style={[styles.headerText, headerTextStyle]}>{title}</Text>
                                            </View>
                                        }
                                        <View
                                            style={{ padding: 10 }}
                                        >
                                            {!content &&
                                                this.props.children}
                                            {content &&
                                                <Text style={[{ color: "#414141", padding: moderateScale(10), fontSize: constants.fonts.small }, contentStyle]}>
                                                    {content}
                                                </Text>
                                            }
                                        </View>

                                        <View style={[styles.footerContainer, footerStyle]}>

                                            {acceptText &&

                                                <TouchableOpacity
                                                    onPress={onAcceptPress}
                                                >
                                                    <Text style={[{ color: colors.primaryDark, padding: 5, marginRight: 10, fontSize: constants.fonts.small, fontWeight: "bold" }, acceptTextStyle]}>{acceptText}</Text>
                                                </TouchableOpacity>
                                            }

                                            <TouchableOpacity
                                                onPress={onCancelPress}
                                            >
                                                <Text style={[{ color: "#414141", padding: 5, fontSize: constants.fonts.small, fontWeight: "bold" }, cancelTextStyle]}>{cancelText}</Text>
                                            </TouchableOpacity>

                                        </View>
                                    </LoadingView>

                                </View>
                            </TouchableWithoutFeedback>

                        </View>

                    </TouchableWithoutFeedback>

                </Modal >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: verticalScale(30),
        paddingRight: verticalScale(30),
        backgroundColor: "#000000aa",
        alignItems: 'center'
    },
    bodyContainer: {
        width: "100%",
        borderRadius: 5,
        backgroundColor: "white"
    },
    headerIconStyle: {
        height: 25,
        width: 25,
        tintColor: "white"
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        paddingLeft: 12,
        padding: 17,
        borderBottomWidth: 1,
        borderBottomColor: "#41414122",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    footerContainer: {
        backgroundColor: "white",
        paddingLeft: 12,
        padding: 12,
        justifyContent: "flex-end",
        borderTopWidth: 1,
        flexDirection: "row",
        borderTopColor: "#41414122",
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5
    },
    headerText: {
        color: colors.blackLight,
        paddingLeft: moderateScale(5),
        fontSize: constants.fonts.small,
        fontWeight: "bold"
    }
})
