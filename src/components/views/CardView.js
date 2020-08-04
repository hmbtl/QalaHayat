import React, { PureComponent } from 'react';
import { View, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';

export default class CardView extends PureComponent {
  render() {
    const localStyle = {
      backgroundColor: this.props.color,
      shadowColor: 'black',
      shadowOffset: {
        width: this.props.cardElevation,
        height: this.props.cardElevation,
      },
      shadowOpacity: this.props.cardElevation === 0 ? 0 : 0.2,
      borderWidth: 0.3,
      borderColor: "#41414133",
      elevation: this.props.cardElevation,
      padding: 10,
      borderRadius: this.props.cornerRadius,
      shadowRadius: this.props.cardElevation,
    };

    return (
      <TouchableHighlight
        underlayColor={this.props.pressedColor}
        style={[localStyle, this.props.style, this.props.containerStyle]}
        onPress={this.props.onPress}>
        <View style={this.props.style} onLayout={this.props.onLayout}>{this.props.children}</View>
      </TouchableHighlight>
    );
  }
}
CardView.propTypes = {
  cardElevation: PropTypes.number,
  cornerRadius: PropTypes.number,
  onPress: PropTypes.func,
};

CardView.defaultProps = {
  cardElevation: 4,
  cornerRadius: 2,
  color: 'white',
  pressedColor: '#E7E7E7',
};
