import React, { PureComponent } from "react";
import { Text, View, Platform, StyleSheet, Image } from "react-native";
import { constants, colors } from "@config";
export default class HeaderTitle extends PureComponent {
  render() {
    const textStyle = {
      textAlign: "center",
      fontSize: constants.fonts.large,
      fontWeight: "bold",
      bottom: 0,
      color: this.props.textColor
    };

    if(constants.IS_ANDROID){
      textStyle.fontFamily = "Roboto";
    }

    return (
      <View style={styles.container}>
        <Text style={[textStyle, this.props.style]}>{this.props.title}</Text>
      </View>
    );
  }
}

HeaderTitle.defaultProps = {
  title: "PlayVideo",
  textColor: "black"
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    ...Platform.select({
      android: {
        marginLeft: 160
      }
    })
  },
  image: {
    height: 16,
    marginRight: 10,
    marginTop: 4
  }
});
