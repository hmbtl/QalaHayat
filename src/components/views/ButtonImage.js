import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Image } from "react-native";
import PropTypes from "prop-types";

export default class ButtonImage extends Component {
  render() {
    let styles = StyleSheet.create({
      view: {
        position: "absolute",
        backgroundColor: "transparent"
      },
      image: {},
      touchable: {
        alignItems: "center",
        justifyContent: "center"
      },
      text: {
        color: this.props.color,
        fontSize: 18,
        textAlign: "center"
      }
    });

    let onPress = this.props.disabled ? null : this.props.onPress;
    return (
      <TouchableOpacity style={styles.touchable} onPress={onPress}>
        <View style={styles.view}>
          <Text style={styles.text}>{this.props.text}</Text>
        </View>
        <Image source={this.props.image} style={styles.image} />
      </TouchableOpacity>
    );
  }
}

ButtonImage.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  onPress: PropTypes.func,
  disabled: PropTypes.bool
};

ButtonImage.defaultProps = {
  text: "",
  disabled: false,
  color: "red"
};
