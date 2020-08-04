import React, { PureComponent } from 'react';
import { Text, View, TextInput } from 'react-native';
import { moderateScale, scale } from 'react-native-size-matters';
import { colors } from '@config';

export default class QalaInputText extends PureComponent {
  render() {
    const styles = {
      label: {
        fontSize: moderateScale(9),
        fontWeight: 'bold',
        color: "white",
        paddingLeft: 4,
        paddingBottom: 4,
      },
      input: {
        fontSize: moderateScale(14),
        borderColor: "#de1623",
        borderWidth: 1,
        height: moderateScale(40),
        paddingVertical:0,
        backgroundColor: "white",
        fontWeight: 'bold',
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
        borderRadius: 5,
        paddingLeft: scale(10),
      },
      inputContainer: {
        margin: 5,
      },

      textInput: {
        borderColor: colors.primary,
        borderWidth: 1,
        alignItems: 'center',
        borderRadius: 5,
        flexDirection: 'row',
        paddingLeft: scale(10),
      },
      preTextStyle: {
        paddingRight: scale(10),
        fontWeight: 'bold',
        fontSize: moderateScale(14),
      },
    };

    const {
      label,
      preText,
      containerStyle,
      labelStyle,
      preTextStyle,
      style,
      error,
      ...otherProps
    } = this.props;


    if (preText !== undefined) {
      return (
        <View style={[styles.inputContainer, containerStyle]}>
          <Text style={[styles.label, labelStyle]}>{label}</Text>
          <View style={[styles.textInput, style, { borderColor: error ? colors.inputBackgroundError : colors.inputBackground }]}>
            <Text style={[styles.preTextStyle, preTextStyle]}>{preText}</Text>
            <TextInput
              style={[
                {
                  fontSize: moderateScale(14),
                  height: moderateScale(40),
                  fontWeight: 'bold',
                  color: "black",
                  paddingLeft: scale(10),
                  flex: 1,
                },
                style,
              ]}
              {...otherProps}
            />
          </View>
          {(typeof error !== "undefined" && error !== "") &&
              <Text style={{ fontSize: moderateScale(9), paddingLeft: 5, paddingTop: 5, color: colors.inputBackgroundError }}>{error}</Text>
            }
        </View>
      );
    } else {
      return (
        <View style={[styles.inputContainer, containerStyle]}>
          <Text style={[styles.label, labelStyle]}>{label}</Text>
          <TextInput style={[styles.input, style, { borderColor: error ? colors.inputBackgroundError : colors.inputBackground }]} {...otherProps} />
          {(typeof error !== "undefined" && error !== "") &&
            <Text style={{ fontSize: moderateScale(9), paddingLeft: 5, paddingTop: 5, color: colors.inputBackgroundError }}>{error}</Text>
          }
        </View>
      );
    }
  }
}
