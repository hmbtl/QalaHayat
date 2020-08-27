import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, Image, StatusBar, Platform } from 'react-native';
import { images, colors, constants } from '@config';
import AsyncStorage from '@react-native-community/async-storage';
import { verticalScale } from 'react-native-size-matters';

export default class SplashScreen extends Component {
  checkToken = async () => {
    try {
      const user = await AsyncStorage.getItem(constants.asyncKeys.user);
      if (user !== null) {
        // value previously stored
        this.props.navigation.navigate('Pin');
      } else {
        this.props.navigation.navigate('Auth');
      }
    } catch (e) {
      // error reading value
      this.props.navigation.navigate('Pin');
    }
  };

  /*
  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Qala Sığorta',
          message:
            'Qala Sığorta applikasiyası müqavilələri endirmək onlara baxmaq üçün' +
            'sizin telefonun yaddaş icazəsi lazımdır.',
          buttonNeutral: 'Daha Sonra Soruş',
          buttonNegative: 'İmtina',
          buttonPositive: 'OK',
        },
      );  
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        this.checkToken();
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  */

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.primary,
        }}>
        <StatusBar
          backgroundColor={colors.primary}
          barStyle="light-content"
          translucent={true}
        />

        <Image
          source={images.logoSmallWhite}
          style={styles.image}
          resizeMode="contain"
        />
      </SafeAreaView>
    );
  }
  componentDidMount() {

    this.checkToken();
    /*
        if (Platform.OS === 'android') {
          this.requestCameraPermission();
        } else {
          this.checkToken();
        }
        */
  }
}

const styles = StyleSheet.create({
  image: {
    height: verticalScale(150)
  }
});
