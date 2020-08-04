import React, { Component } from "react";
import { View, TextInput, Animated } from "react-native";

export default class FloatingLabelInput extends Component {
  state = {
    isFocused: false
  };

  UNSAFE_componentWillMount() {
    this._animatedIsFocused = new Animated.Value(
      this.props.value === "" ? 0 : 1
    );
  }

  handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => this.setState({ isFocused: false });

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.isFocused || this.props.value !== "" ? 1 : 0,
      duration: 200
    }).start();
  }

  render() {
    const { label, ...props } = this.props;
    const labelStyle = {
      position: "absolute",
      left: 3,
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [15, 0]
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 14]
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ["#aaa", "#000"]
      })
    };
    return (
      <View style={[{ paddingTop: 7 }, this.props.style]}>
        <Animated.Text style={labelStyle}>{label}</Animated.Text>
        <TextInput
          {...props}
          style={[{
            height: 50,
            fontSize: 20,
            color: "#000",
          }]}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          blurOnSubmit
        />
      </View>
    );
  }
}
