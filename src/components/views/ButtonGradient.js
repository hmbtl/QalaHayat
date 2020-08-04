import React, {PureComponent} from 'react';
import {Text, TouchableHighlight, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import {colors, constants} from '@config';
import LinearGradient from 'react-native-linear-gradient';

export default class ButtonGradient extends PureComponent {
  render() {
    /*
        Default style for Button you can change button
        style with props: containerStyle;
    */
    let buttonStyle = {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: this.props.radius,
      minWidth: constants.button.width,
      height: constants.button.height,
      shadowColor: 'black',
      shadowOffset: {width: 2, height: 10},
      shadowOpacity: 0.3,
      shadowRadius: this.props.shadowRadius,
      elevation: this.props.elevation,
    };

    /*
        Default style for Text within Button. You can change 
        text style with props: textStyle
    */
    let textStyle = {
      fontSize: this.props.textSize,
      color: this.props.textColor,
      textAlign: 'center',
    };

   

    let colors = this.props.disabled
      ? ['#9b9b9b', '#9b9b9b']
      : this.props.colors;
    let onPress = this.props.disabled ? null : this.props.onPress;

    let title = this.props.isLoading ? 'Gözləyin' : this.props.text;
    let indicator;

    if (this.props.isLoading) {
      onPress = null;
      colors = ['#9b9b9b', '#9b9b9b'];
      indicator = (
        <ActivityIndicator
          size="small"
          color="white"
          style={{marginRight: 5}}
        />
      );
    }

    return (
      <TouchableHighlight
        onPress={onPress}
        style={[buttonStyle, this.props.containerStyle]}>
        <LinearGradient
          useAngle={true}
          angle={45}
          angleCenter={{x: 0.5, y: 0.5}}
          style={[buttonStyle, this.props.style]}
          colors={colors}>
          {indicator}
          <Text style={[textStyle, this.props.textStyle]}>
            {this.props.allCaps ? title.toUpperCase() : title}
          </Text>
        </LinearGradient>
      </TouchableHighlight>
    );
  }
}

ButtonGradient.propTypes = {
  colors: PropTypes.array,
  text: PropTypes.string,
  isLoading: PropTypes.bool,
  textColor: PropTypes.string,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  textSize: PropTypes.number,
  elevation: PropTypes.number,
  radius: PropTypes.number,
  allCaps: PropTypes.bool,
  containerStyle: PropTypes.object,
  textStyle: PropTypes.object,
  style: PropTypes.object,
  shadowRadius: PropTypes.number,
};

ButtonGradient.defaultProps = {
  colors: colors.gradient.green,
  text: 'Button',
  isLoading: false,
  textSize: constants.fonts.small,
  disabled: false,
  textColor: 'white',
  elevation: 10,
  radius: 50,
  allCaps: true,
  shadowRadius: 10,
};
