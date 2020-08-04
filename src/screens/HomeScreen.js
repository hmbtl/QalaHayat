import React, { Component } from 'react';
import {
  StyleSheet,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
  Image,
  View,
} from 'react-native';
import { images} from '@config';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { QalaProductButton } from '@component/layouts'

export default class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate({ routeName: 'Setting' })}
          style={{
            right: 10,
            alignItems: 'flex-end',
            backgroundColor: 'transparent',
            paddingLeft: 15,
          }}>
          <Image style={{ width: 35, height: 35, marginRight: 5 }} source={images.slider} />
        </TouchableOpacity>
      ),
    };
  };

  render() {
    return (
      <ImageBackground
        source={images.background}
        style={{ width: '101%', height: '100%', backgroundColor: "white" }}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent={true}
        />
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
            margin: moderateScale(20),
          }}>

          <View
            style={{
              justifyContent: 'flex-start',
              height: verticalScale(376),
            }}>
            <View style={styles.cardRow}>
              <QalaProductButton
                text="Müqavilələrim"
                onPress={() => this.props.navigation.navigate({ routeName: 'Contract' })}
                icon={images.contracts}
                disabled={false}
              />
              <View style={{ width: scale(10) }}></View>

              <QalaProductButton
                text="Məhsullar"
                onPress={() => this.props.navigation.navigate({ routeName: 'Products' })}
                icon={images.products}
                disabled={false}
              />
            </View>


            <View style={styles.cardRow}>
              <QalaProductButton
                text="Online ödəniş"
                onPress={() => this.props.navigation.navigate({ routeName: 'OnlinePayment' })}
                icon={images.onlinePayment}
                disabled={false}
              />
              <View style={{ width: scale(10) }}></View>

              <QalaProductButton
                text="Əlaqə"
                onPress={() => this.props.navigation.navigate({ routeName: 'Map' })}
                icon={images.phone}
                disabled={false}
              />
            </View>

          </View>

        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(100),
    alignItems: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    height: verticalScale(115),
    marginBottom: verticalScale(7),
  },
  image: {
    height: verticalScale(150),
  },
});
