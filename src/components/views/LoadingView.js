import React, { PureComponent } from 'react';
import { SafeAreaView, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { anims } from '@config';

export default class LoadingView extends PureComponent {
  render() {
    const { isLoading, showBlur, style, ...otherProps } = this.props;
    if (isLoading) {
      return (
        <SafeAreaView style={style} {...otherProps}>
          {showBlur ? this.props.children : null}
          <SafeAreaView
            style={{
              position: 'absolute',
              backgroundColor: '#00000055',
              top: 0,
              left: 0,
              right: 0,
              opacity: 0.9,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <LottieView style={{ width: 120, height: 100 }} source={anims.wave} autoPlay loop />
          </SafeAreaView>
        </SafeAreaView>
      );
    }
    return (
      <View style={style} {...otherProps}>
        {this.props.children}
      </View>
    );
  }
}

LoadingView.defaultProps = {
  isLoading: false,
};
