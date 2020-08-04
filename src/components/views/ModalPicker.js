import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Text, StyleSheet, View, Modal, TouchableWithoutFeedback, TouchableOpacity, Image, ScrollView } from 'react-native'
import { colors, constants, images } from "@config"
import { moderateScale, verticalScale, scale } from 'react-native-size-matters';


const propTypes = {
    data: PropTypes.array,
    onChange: PropTypes.func,
    initValue: PropTypes.string,
    error: PropTypes.string,
    label: PropTypes.string,
    selectContainerStyle: PropTypes.object,
    selectStyle: PropTypes.object,
    selectTextStyle: PropTypes.object,
    hideHeader: PropTypes.bool,
    style: PropTypes.object,
    labelStyle: PropTypes.object,
    headerStyle: PropTypes.object,
    itemStyle: PropTypes.object,
    headerTextStyle: PropTypes.object,
    footerStyle: PropTypes.object,
    cancelTextStyle: PropTypes.object,
    title: PropTypes.string,
};

const defaultProps = {
    data: [],
    onChange: () => { },
    initValue: '',
    style: {},
    hideHeader: false,
    selectContainerStyle: {},
    error: "",
    selectStyle: {},
    selectTextStyle: {},
    label: 'Azad',
    labelStyle: {},
    headerStyle: {},
    itemStyle: {},
    headerTextStyle: {},
    footerStyle: {},
    sectionTextStyle: {},
    cancelTextStyle: {},
};


export default class ModalPicker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
        }

        this.onChange = this.onChange.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.renderItems = this.renderItems.bind(this);
    }

    componentDidMount() {

        let item = this.props.data[0];

        if (!this.props.selected) {

            this.props.onChange(item, 0)

        }
    }


    onChange = (item, index) => {

        this.props.onChange(item, index);

        this.close();
    }

    renderItems = () => {
        return this.props.data.map((item, index) => {
            return this.renderItem(item, index);
        })
    }
    isObject(obj) {
        return obj === Object(obj);
    }


    renderItem(option, index) {

        let value = option;

        if (this.isObject(option)) {
            if ("label" in option) {
                value = option.label;
            }
        }

        return (
            <TouchableOpacity key={index} onPress={() => this.onChange(option, index)}>
                <View style={[styles.optionStyle, this.props.itemStyle, { borderBottomWidth: index === this.props.data.length - 1 ? 0 : 0.5 }]}>
                    <Text style={[styles.optionTextStyle, this.props.optionTextStyle]}>{value}</Text>
                </View>
            </TouchableOpacity >)
    }

    close = () => {
        this.setState({
            showModal: false
        })
    }

    open = () => {
        this.setState({
            showModal: true
        });
    }

    render() {

        const dp = (
            <Modal animationType="fade" transparent={true} visible={this.state.showModal} >
                <TouchableWithoutFeedback onPress={this.close} >
                    <View style={styles.container}>
                        <TouchableWithoutFeedback>
                            <View style={[styles.bodyContainer, this.props.style]}>
                                <View >
                                    {!this.props.hideHeader &&
                                        <View style={[styles.headerContainer, this.props.headerStyle]}>
                                            <Text style={[styles.headerText, this.props.headerTextStyle]}>{this.props.title ? this.props.title : this.props.label}</Text>
                                        </View>
                                    }
                                    <ScrollView style={{ maxHeight: 400 }}>
                                        <View style={{ padding: 10, paddingTop: 0, paddingBottom: 0 }} >
                                            {this.renderItems()}
                                        </View>
                                    </ScrollView>
                                    <View style={[styles.footerContainer, this.props.footerStyle]}>
                                        <TouchableOpacity onPress={this.close} >
                                            <Text style={[{ color: "#414141", padding: 5, fontSize: constants.fonts.small, fontWeight: "bold" }, this.props.cancelTextStyle]}>Bağla</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal >
        )

        let selected = this.props.selected;

        if (this.isObject(this.props.selected)) {
            if ("label" in this.props.selected) {
                selected = this.props.selected.label;
            }

        }


        return (

            <View style={[styles.inputContainer, this.props.selectContainerStyle]}>
                <Text style={[styles.label, this.props.labelStyle]}>{this.props.label}</Text>
                {dp}
                <TouchableOpacity onPress={this.open} style={{ backgroundColor: "transparent" }}>
                    <View style={[styles.input, this.props.selectStyle, { borderColor: this.props.error ? colors.inputBackgroundError : colors.inputBackground }]}>
                        <Text style={[styles.inputTextStyle, this.props.selectTextStyle]} numberOfLines={1} ellipsizeMode="tail">{selected}</Text>
                        <Image
                            style={styles.chevron}
                            source={images.chevronRight}
                        />
                    </View>
                    {(typeof this.props.error !== "undefined" && this.props.error !== "") &&
                        <Text style={{ fontSize: moderateScale(9), paddingLeft: 5, paddingTop: 5, color: colors.inputBackgroundError }}>{this.props.error}</Text>
                    }
                </TouchableOpacity>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: verticalScale(40),
        paddingRight: verticalScale(40),
        backgroundColor: "#000000aa",
        alignItems: 'center'
    },
    optionStyle: {
        padding: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: "#41414122"
    },
    optionTextStyle: {
        fontSize: constants.fonts.small
    },
    label: {
        fontSize: moderateScale(9),
        fontWeight: 'bold',
        color: "green",
        paddingLeft: 4,
        paddingBottom: 4,
    },
    inputTextStyle: {
        fontSize: moderateScale(14),
        fontWeight: "bold",
        flex: 1,
    },
    chevron: {
        height: 20,
        width: 20,
        marginLeft: 10,
        tintColor: colors.blackLight,
        transform: [
            { rotate: "90deg" },
        ]
    },
    input: {
        flexDirection: "row",
        justifyContent: "flex-start",
        backgroundColor: colors.inputBackground,
        borderColor: colors.inputBorder,
        elevation: 0,
        height: moderateScale(45),
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        fontSize: moderateScale(14),
        borderWidth: 1,
        alignItems: "center",
        fontWeight: 'bold',
        shadowColor: 'black',
        borderRadius: 5,
        paddingLeft: scale(10),
        paddingRight: scale(10)
    },
    inputContainer: {
        margin: 5,
    },
    bodyContainer: {
        width: "100%",
        borderRadius: 5,
        backgroundColor: "white"
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

ModalPicker.propTypes = propTypes;
ModalPicker.defaultProps = defaultProps;
