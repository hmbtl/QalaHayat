import React, { Component } from 'react'
import { StyleSheet, View, Vibration } from 'react-native'
import { PinButton } from "@component/views"
import { images } from "@config"


export default class PinBoard extends Component {

    constructor(props) {
        super(props);

        this.onKeyPress = this.onKeyPress.bind(this);
        this.onLongPress = this.onLongPress.bind(this);
    }


    onLongPress() {
        if (this.props.onPinChange) {
            this.props.onPinChange("");
        }
    }

    onKeyPress(key) {

        let pin = this.props.pin;

        Vibration.vibrate(20);

        if (key === "touchId") {
            if (this.props.onTouchIdPress) {
                this.props.onTouchIdPress();
            }
        } else if (key === "backspace") {
            pin = pin.substring(0, pin.length - 1)
        } else {
            if (pin.length < this.props.pinCount) {
                pin += key.toString();
            }
        }

        if (this.props.onPinChange) {
            this.props.onPinChange(pin);
        }

        if (pin.length === this.props.pinCount) {
            if (this.props.onPinFinished) {
                this.props.onPinFinished(pin);
            }
        }
    }

    render() {
        return (

            <View style={styles.pinContainer}>

                <View
                    style={styles.row}
                >

                    <PinButton
                        onPress={() => this.onKeyPress(1)}
                        text="1"
                    />
                    <PinButton
                        onPress={() => this.onKeyPress(2)}
                        text="2"
                    />
                    <PinButton
                        onPress={() => this.onKeyPress(3)}
                        text="3"
                    />
                </View>


                <View
                    style={styles.row}
                >

                    <PinButton
                        onPress={() => this.onKeyPress(4)}
                        text="4"
                    />
                    <PinButton
                        onPress={() => this.onKeyPress(5)}
                        text="5"
                    />
                    <PinButton
                        onPress={() => this.onKeyPress(6)}
                        text="6"
                    />
                </View>


                <View
                    style={styles.row}
                >

                    <PinButton
                        onPress={() => this.onKeyPress(7)}
                        text="7"
                    />
                    <PinButton
                        onPress={() => this.onKeyPress(8)}
                        text="8"
                    />
                    <PinButton
                        onPress={() => this.onKeyPress(9)}
                        text="9"
                    />
                </View>

                <View
                    style={styles.row}
                >
                    <PinButton
                        imageStyle={{ height: 50, width: 50 }}
                    />
                    <PinButton
                        onPress={() => this.onKeyPress(0)}
                        text="0"
                    />
                    <PinButton
                        onPress={() => this.onKeyPress("backspace")}
                        onLongPress={this.onLongPress}
                        image={images.backspace}
                    />
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "center",
        margin: 0,
    },
    pinContainer: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
    }
})
