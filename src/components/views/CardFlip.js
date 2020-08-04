import React, { Component } from "react";
import PropTypes from "prop-types";
import { polyfill } from 'react-lifecycles-compat';

import { Platform, StyleSheet, Animated } from "react-native";

class CardFlip extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      duration: 5000,
      isFlipped: this.props.flip,
      side: 0,
      sides: [],
      progress: new Animated.Value(this.props.flip ? 100 : 0),
      rotation: new Animated.ValueXY({ x: 50, y: this.props.flip ? 100 : 50 }),
      zoom: new Animated.Value(0),
      rotateOrientation: "",
      flipDirection: "y"
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.duration !== prevState.duration ||
      nextProps.flipZoom !== prevState.flipZoom ||
      nextProps.children !== prevState.sides) {
      return {
        duration: nextProps.duration,
        flipZoom: nextProps.flipZoom,
        sides: nextProps.children
      }
    }
    return null;
  }


  componentDidUpdate(prevProps) {
    if (prevProps.flip !== this.props.flip) {
      this.flip()
    }
  }


  componentDidMount() {
    this.setState({
      duration: this.props.duration,
      flipZoom: this.props.flipZoom,
      sides: this.props.children
    });
  }


  flip() {
    this.flipY();
  }


  flipY() {
    const { side, isFlipped } = this.state;
    this._flipTo({
      x: 50,
      y: !isFlipped ? 100 : 50
    });
    this.setState({
      isFlipped: !isFlipped,
    });
  }


  _flipTo(toValue) {
    const { duration, rotation, progress, zoom, side, isFlipped } = this.state;
    this.props.onFlip(!isFlipped);
    this.props.onFlipStart(!isFlipped);
    Animated.parallel([
      Animated.timing(progress, {
        toValue: !isFlipped ? 100 : 0,
        duration,
        useNativeDriver: false
      }),
      Animated.sequence([
        Animated.timing(zoom, {
          toValue: 100,
          duration: duration / 2,
          useNativeDriver: false
        }),
        Animated.timing(zoom, {
          toValue: 0,
          duration: duration / 2,
          useNativeDriver: false
        })
      ]),
      Animated.timing(rotation, {
        toValue,
        duration: duration,
        useNativeDriver: false
      })
    ]).start(() => {
      this.props.onFlipEnd(!isFlipped);
    });
  }

  getCardATransformation() {
    //0, 50, 100
    const { progress, rotation, isFlipped, rotateOrientation } = this.state;

    const sideAOpacity = progress.interpolate({
      inputRange: [50, 51],
      outputRange: [100, 0],
      extrapolate: "clamp"
    });


    const sideATransform = {
      opacity: sideAOpacity,
      zIndex: !isFlipped ? 1 : 0,
      transform: [{ perspective: this.props.perspective }]
    };

    // cardA Y-rotation
    const aYRotation = rotation.y.interpolate({
      inputRange: [0, 50, 100, 150],
      outputRange: ["-180deg", "0deg", "180deg", "0deg"],
      extrapolate: "clamp"
    });
    sideATransform.transform.push({ rotateY: aYRotation });
    return sideATransform;
  }

  getCardBTransformation() {
    const { progress, rotation, isFlipped, rotateOrientation } = this.state;
    const sideBOpacity = progress.interpolate({
      inputRange: [50, 51],
      outputRange: [0, 100],
      extrapolate: "clamp"
    });

    const sideBTransform = {
      opacity: sideBOpacity,
      zIndex: !isFlipped ? 0 : 1,
      transform: [{ perspective: -1 * this.props.perspective }]
    };
    let bYRotation;

    if (Platform.OS === "ios") {
      // cardB Y-rotation
      bYRotation = rotation.y.interpolate({
        inputRange: [0, 50, 100, 150],
        outputRange: ["0deg", "180deg", "0deg", "-180deg"],
        extrapolate: "clamp"
      });
    } else {
      // cardB Y-rotation
      bYRotation = rotation.y.interpolate({
        inputRange: [0, 50, 100, 150],
        outputRange: ["0deg", "-180deg", "0deg", "180deg"],
        extrapolate: "clamp"
      });
    }
    sideBTransform.transform.push({ rotateY: bYRotation });
    return sideBTransform;
  }

  render() {
    const { side, progress, rotateOrientation, zoom, sides } = this.state;
    const { flipZoom } = this.props;



    // Handle cardA transformation
    let cardATransform = this.getCardATransformation();

    // Handle cardB transformation
    let cardBTransform = this.getCardBTransformation();


    // Handle cardPopup
    const cardZoom = zoom.interpolate({
      inputRange: [0, 100],
      outputRange: [1, 1 + flipZoom],
      extrapolate: "clamp"
    });

    const scaling = {
      transform: [{ scale: cardZoom }]
    };

    return (
      <Animated.View style={[this.props.style, scaling]}>
        <Animated.View style={[styles.cardContainer, cardATransform]}>
          {sides[0]}
        </Animated.View>
        <Animated.View style={[styles.cardContainer, cardBTransform]}>
          {sides[1]}
        </Animated.View>
      </Animated.View>
    );
  }
}
const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  }
});

CardFlip.defaultProps = {
  style: {},
  duration: 400,
  flipZoom: 0,
  flipDirection: "y",
  perspective: 800,
  onFlip: () => { },
  onFlipStart: () => { },
  onFlipEnd: () => { }
};

CardFlip.propTypes = {
  style: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array
  ]),
  duration: PropTypes.number,
  flipZoom: PropTypes.number,
  flipDirection: PropTypes.string,
  onFlip: PropTypes.func,
  onFlipEnd: PropTypes.func,
  onFlipStart: PropTypes.func,
  perspective: PropTypes.number
};

polyfill(CardFlip)
export default CardFlip 