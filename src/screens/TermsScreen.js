import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { LoadingView } from '@component/views';

export default class ISBPaymentScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
    };
  }

  render() {
    return (
      <LoadingView
        isLoading={this.state.isLoading}
        showBlur={true}
        style={{ flex: 1 }}>
        <WebView
          source={{ uri: 'https://qala-app.az/qanun/' }}
          onLoadEnd={syntheticEvent => {
            // update component to be aware of loading status
            const { nativeEvent } = syntheticEvent;
            const url = nativeEvent.url;
            console.log(url);
            this.setState({
              isLoading: false,
            });
          }}
        />
      </LoadingView>
    );
  }
}
