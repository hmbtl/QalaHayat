import React, { Component } from 'react';
import {
  View,
  Text,
  Animated,
  StatusBar,
  Image,
  Platform,
  Linking,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LoadingView } from '@component/views';
import MapView from 'react-native-maps';
import { constants, colors, images } from '@config';
import api from '@services/api';

export default class MapScreen extends Component {
  constructor(props) {
    super(props);


    this.state = {
      branches: [],
      animation: new Animated.Value(-500),
      bottomAnimation: new Animated.Value(-300),
      circleAnimation: new Animated.Value(0),
      address: 'Azərbaycan, AZ1065, Bakı şəhəri,Yasamal rayonu, İzmir küçəsi 5a',
      email: 'office@qala.az',
      latitude: 40.388900,
      longitude: 49.823514,
      name: 'Baş Ofis',
      isLoading: false,
      allowScroll: false,
    };

    this.bottomUp = this.bottomUp.bind(this);
    this.markerDown = this.markerDown.bind(this);
    this.circleScale = this.circleScale.bind(this);

    //this.loadBranches = this.loadBranches.bind(this);
  }


  markerDown = () => {
    Animated.spring(
      this.state.animation,
      {
        toValue: 0,
        delay: 500,
        tension: 30,
        useNativeDriver: false,
      }
    ).start();
  }

  circleScale = () => {
    Animated.spring(
      this.state.circleAnimation,
      {
        toValue: 50,
        tension: 1,
        delay: 1100,
        useNativeDriver: false,
      }
    ).start();
  }

  bottomUp = () => {

    Animated.spring(
      this.state.bottomAnimation,
      {
        toValue: 0,
        tension: 5,
        delay: 800,
        useNativeDriver: false,
      }
    ).start();
  }

  componentDidMount() {
    this.bottomUp();
    this.markerDown();
    this.circleScale();
  }

  render() {
    return (
      <LoadingView style={{ flex: 1 }} isLoading={this.state.isLoading}>
        <MapView
          style={{ flex: 1 }}
          scrollEnabled={true}
          initialRegion={{
            latitude: Number(this.state.latitude),
            longitude: Number(this.state.longitude),
            latitudeDelta: 0.0322,
            longitudeDelta: 0.0821,
          }}>

          <MapView.Marker
            isPreselected={true}
            coordinate={{
              latitude: Number(this.state.latitude),
              longitude: Number(this.state.longitude),
            }}
            title="MƏRKƏZİ OFİS"
          >
            <Animated.View
              style={{ top: this.state.animation }}
            >
              <Image
                style={{ height: 100, padding: 0, margin: 0 }}
                resizeMode="contain"
                source={images.marker}
              />

            </Animated.View>
          </MapView.Marker>



        </MapView>

        <View style={[styles.buttonsContainer]} >
          <View
            style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", marginRight: 40 }}
          >
            <View style={{ width: 65, height: 50, alignItems: "center", justifyContent: "center" }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => Linking.openURL('tel:1540')}
              >
                <Animated.View style={[styles.circle, { backgroundColor: "#5CAED6", height: this.state.circleAnimation, width: this.state.circleAnimation, alignItems: "center", justifyContent: "center" }]} >
                  <Image
                    source={images.call}
                    resizeMode="contain"

                    style={{ flex: 1, margin: 5 }}
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>
            <View style={{ width: 65, height: 50, alignItems: "center", justifyContent: "center" }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {

                  console.log("clicked")
                  const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:' });
                  const latLng = `${this.state.latitude},${this.state.longitude}`;
                  const label = 'Qala Hayat';
                  const url = Platform.select({
                    ios: `${scheme}${label}@${latLng}`,
                    android: `${scheme}${latLng}?q=${latLng}?(${label})`
                  });
                  Linking.openURL(url);
                }}
              >
                <Animated.View style={[styles.circle, { backgroundColor: "#58A850", height: this.state.circleAnimation, width: this.state.circleAnimation, alignItems: "center", justifyContent: "center" }]} >
                  <Image
                    source={images.gps}
                    resizeMode="contain"
                    style={{ flex: 1, margin: 5, marginLeft: 8 }}
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>

            <View style={{ width: 65, height: 50, alignItems: "center", justifyContent: "center" }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => Linking.openURL('mailto:' + this.state.email)}
              >

                <Animated.View style={[styles.circle, { backgroundColor: "#EEBD59", height: this.state.circleAnimation, width: this.state.circleAnimation, alignItems: "center" }]} >

                  <Image
                    source={images.email}
                    resizeMode="contain"

                    style={{ flex: 1, margin: 5 }}
                  />

                </Animated.View>
              </TouchableOpacity>

            </View>

          </View>

        </View>

        <Animated.View style={[styles.bottomContainer, { bottom: this.state.bottomAnimation }]} >
          <View style={styles.bottomCard} >
            <Text style={{
              fontSize: constants.fonts.medium,
              color: colors.primary,
              paddingBottom: 5,
              textTransform: "uppercase",
              fontWeight: "bold"
            }}>Mərkəzi Ofis</Text>
            <Text style={{
              fontSize: constants.fonts.medium,
              textAlign: "left",
            }}>Azərbaycan, AZ1065, Bakı şəhəri Yasamal rayonu, İzmir küçəsi 5a</Text>
            <Text style={{ fontWeight: "bold" }}>İş-vaxtı:  BE-CM: 9:00-18:00</Text>
            <Text>Telefon:   1540 | +(99412) 404-77-74</Text>
            <Text>Faks:       +(99412) 530-60-03</Text>
            <Text>E-mail:    office@qala.az</Text>
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton} onPress={() => Linking.openURL('https://www.facebook.com/QalaHeyat/')}>
                <Image source={images.socialFacebook} style={styles.social} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} onPress={() => Linking.openURL('https://www.instagram.com/qala_life_insurance/')}>
                <Image source={images.socialInstagram} style={styles.social} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} onPress={() => Linking.openURL('https://www.youtube.com/channel/UC3cSCpQfjggT6qOIWxZ9fAQ')}>
                <Image source={images.socialYoutube} style={styles.social} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} onPress={() => Linking.openURL('https://api.whatsapp.com/send?phone=+994502513390')}>
                <Image source={images.socialWhatsapp} style={styles.social} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} onPress={() => Linking.openURL('https://www.linkedin.com/company/qala-h%C9%99yat-s%C4%B1%C4%9Forta-%C5%9Firk%C9%99ti-asc/about/?viewAsMember=true')}>
                <Image source={images.socialLinkedin} style={styles.social} />
              </TouchableOpacity>
            </View>
          </View>

        </Animated.View>





        <StatusBar
          backgroundColor="transparent"
          barStyle={'dark-content'}
          translucent={true}
        />
      </LoadingView >
    );
  }
}
const styles = StyleSheet.create({
  bottomContainer: {
    position: "absolute",
    height: 290,
    width: "100%",
    padding: 0,
    zIndex: 10
  },
  bottomCard: {
    flex: 1,
    backgroundColor: "white",
    margin: 20,
    marginBottom: 30,
    borderRadius: 8,
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 0.2,
    borderWidth: 1,
    borderColor: colors.primary,
    elevation: 4,
    paddingTop: 30,
    paddingLeft: 30,
    paddingRight: 30,
    shadowRadius: 4,
  },
  circle: {
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: "#5CAED6",
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    borderWidth: 0.3,
    shadowRadius: 3,
    borderColor: "#41414133",
    elevation: 4,
  },
  buttonsContainer: {
    position: "absolute",
    bottom: 245,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    zIndex: 100
  },
  socialButton: {
    marginRight: 15,
  },
  socialContainer: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-start",
    alignContent: "flex-end",
    marginTop: 20,
    marginLeft: -10,

  },
  social: {
    height: 27,
    width: 27
  },
  address: {},
});
