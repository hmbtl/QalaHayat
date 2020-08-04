import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { moderateScale, verticalScale, scale } from 'react-native-size-matters';
import { colors, constants, images } from "@config"
import moment from "moment"




export default class DatePicker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
        }

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.confirm = this.confirm.bind(this);
    }

    componentDidMount() {
        if (this.props.date) {

            if (this.props.onChange) {
                this.props.onChange(this.props.date);
            }
        }
    }

    open = () => {
        this.setState({
            showModal: true
        })
    }

    close = () => {
        this.setState({
            showModal: false
        })
    }

    confirm = (date) => {
        let dateStr = moment(date).format('DD.MM.YYYY');

        this.setState({
            showModal: false,
        })

        /*
        if (this.props.onChangeDate) {
            this.props.onChangeDate(date);
        }
        */
        if (this.props.onChange) {
            this.props.onChange(dateStr);
        }
    }

    render() {
        const { labelStyle, containerStyle, style, textStyle, placeholder, error, date } = this.props;

        return (
            <View style={[styles.inputContainer, containerStyle]}>
                <DateTimePickerModal
                    isVisible={this.state.showModal}
                    mode="date"
                    date={date ? moment(date, 'DD.MM.YYYY').toDate() : new Date()}
                    onConfirm={this.confirm}
                    onCancel={this.close}
                />
                <Text style={[styles.label, labelStyle]}>{this.props.label}</Text>
                <TouchableOpacity onPress={this.open} style={{ backgroundColor: "transparent" }}>
                    <View style={[styles.input, style, { borderColor: error ? colors.inputBackgroundError : colors.inputBackground }]}>
                        {(!date && placeholder) &&
                            <Text style={[styles.inputTextStyle, { color: colors.disabled }]}>{placeholder}</Text>
                        }
                        {(date || !placeholder) &&
                            <Text style={[styles.inputTextStyle, textStyle]}>{date}</Text>
                        }
                    </View>
                    {(typeof error !== "undefined" && error !== "") &&
                        <Text style={{ fontSize: moderateScale(9), paddingLeft: 5, paddingTop: 5, color: colors.inputBackgroundError }}>{error}</Text>
                    }
                </TouchableOpacity>

            </View>
        )
    }
}

const styles = StyleSheet.create({
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
    inputContainer: {
        margin: 5,
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
})
