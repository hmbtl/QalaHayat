import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  StatusBar,
  Image,
  View,
} from 'react-native';
import { images } from '@config';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { CardView } from '@component/views';

export default class AboutScreen extends Component {
  render() {
    return (
      <SafeAreaView>
        <StatusBar
          backgroundColor="black"
          barStyle="light-content"
          translucent={false}
        />
        <ImageBackground
          source={images.background}
          style={{ width: '100%', height: '100%' }}>
          <View style={styles.container}>
            <Image
              source={images.logoSmallWhite}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          <View
            style={{
              justifyContent: 'flex-end',
              flex: 1,
              margin: moderateScale(15),
            }}>
            <View style={styles.cardRow}>
              <CardView
                onPress={() => {
                  this.props.navigation.navigate('ISBForm');
                }}
                style={{
                  flex: 1,
                  marginRight: scale(5),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                cornerRadius={10}
                cardElevation={4}>
                <Image
                  source={images.car}
                  style={{ height: 60, width: 60 }}
                  resizeMode="stretch"></Image>
                <Text style={styles.cardText}>
                  İcbari Nəqliyyat Sığortasının yazılması
                </Text>
              </CardView>
              <CardView
                style={{
                  flex: 1,
                  marginLeft: scale(5),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                cornerRadius={10}
                cardElevation={4}>
                <Image
                  source={images.money}
                  style={{ height: 60, width: 60 }}
                  resizeMode="stretch"></Image>
                <Text style={styles.cardText}>
                  İcbari Nəqliyyat Sığortasının ödənişi
                </Text>
              </CardView>
            </View>

          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    alignItems: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    height: verticalScale(130),
    marginBottom: verticalScale(10),
  },
  cardText: {
    textAlign: 'center',
    color: '#414141',
    paddingLeft: scale(20),
    paddingRight: scale(20),
    fontSize: 14,
  },
  image: {
    height: verticalScale(150),
  },
});
