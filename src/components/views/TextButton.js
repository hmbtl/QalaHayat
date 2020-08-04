import React, { PureComponent } from "react";
import { Text, TouchableOpacity, Platform} from "react-native";
import PropTypes from "prop-types";
import { colors, constants} from "@config";

export default class TextButton extends PureComponent {
  render() {

    let textStyle = {
      fontSize:constants.fonts.small,
      color:this.props.color,
      fontWeight:'bold',
      textTransform:'uppercase'
    }

    if(constants.IS_ANDROID){
      textStyle.fontFamily = "Roboto";
    }

    let color = this.props.disabled ? colors.disabled : this.props.color;
    let onPress = this.props.disabled ? null : this.props.onPress;

    return (
      <TouchableOpacity onPress={onPress}>
        <Text style={[textStyle, this.props.style]}>
          {this.props.text}
        </Text>
      </TouchableOpacity>
    );
  }
}

TextButton.propTypes = {
  text: PropTypes.string,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  color: PropTypes.string
};

TextButton.defaultProps = {
  text: "Button",
  color: "black",
  disabled: false
};
