import React, { Component } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { CardView, LoadingView } from '@component/views';
import api from '@services/api';
import { images, constants } from '@config';
import { verticalScale } from 'react-native-size-matters';

export default class MemorySheetsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      memorysheets: [],
    };

    this.getMemorySheets = this.getMemorySheets.bind(this);
    this.onClickPDF = this.onClickPDF.bind(this);
  }

  componentDidMount() {
    this.getMemorySheets();
  }


  onClickPDF(index) {
    let pdf = this.state.memorysheets[index];
    this.props.navigation.navigate('PDF', {
      pdf: pdf.pdf,
      title: pdf.name
    });
  }

  getMemorySheets() {
    api
      .getIcbariMemorySheets()
      .then(res => {
        if (res.status == 'success') {
          console.log(res.data);
          this.setState({
            memorysheets: res.data,
          });
        }
        this.setState({
          isLoading: false,
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  renderMemorySheets() {
    return this.state.memorysheets.map((data, index) => {
      return (
        <CardView
          key={data.id}
          style={styles.card}
          color="#F7F7F7"
          onPress={() => this.onClickPDF(index)}
          cornerRadius={10}
          cardElevation={4}>
          <Image
            source={images.pdf}
            style={{ height: verticalScale(40), width: verticalScale(40) }}
            resizeMode="stretch"
          />
          <Text style={styles.text}>{data.name}</Text>
        </CardView>
      );
    });
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <LoadingView style={styles.container} isLoading={this.state.isLoading}>
          <ScrollView style={{ flex: 1 }}>
            <View style={{ flex: 1, padding: 15 }}>
              {this.renderMemorySheets()}
            </View>
          </ScrollView>
        </LoadingView>
        <StatusBar
          backgroundColor="black"
          barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
          translucent={Platform.OS === 'ios'}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flex: 1,
    marginBottom: 10,
    height: verticalScale(110),
    padding: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: constants.fonts.xsmall,
    flex: 1,
    textTransform: 'uppercase',
    paddingLeft: 10,
    textDecorationLine: 'underline',
    textAlign: 'right',
  },
});
