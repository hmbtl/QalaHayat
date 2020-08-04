import React, { Component } from 'react'
import { StyleSheet, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import { constants, images, colors } from '@config';
import { verticalScale, moderateScale, scale } from "react-native-size-matters"


export default class ScrollViewCard extends Component {

    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            scrollPosition: "top"
        }

        this.setStateWithMount = this.setStateWithMount.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    setStateWithMount = data => {
        if (this._isMounted) {
            this.setState(data);
        }
    };

    isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        // console.log(layoutMeasurement.height + contentOffset.y, contentSize.height, contentOffset.y)
        const paddingToBottom = 5;
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    }

    isCloseToTop = ({ contentOffset }) => {
        return contentOffset.y <=
            5;
    }

    renderBottomChevron = () => {

        if (this.state.scrollPosition !== "bottom") {
            return (
                <View style={{
                    position: "absolute",
                    zIndex: 200, bottom: 0, height: 30, backgroundColor: "#ffffffaa", borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%"
                }}>
                    <TouchableOpacity
                        onPress={() => this.scrollView.scrollToEnd({ animated: true })}
                    >
                        <Image source={images.chevronRight} style={{
                            height: 25, width: 25,
                            tintColor: colors.blackLight, transform: [
                                { rotate: "90deg" },
                            ]
                        }} />
                    </TouchableOpacity>
                </View>)
        }
    }

    renderTopChevron = () => {

        if (this.state.scrollPosition !== "top") {
            return (
                <View style={{
                    position: "absolute",
                    zIndex: 200, top: 0, height: 30, backgroundColor: "#ffffff", borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    justifyContent: "center",
                    opacity: 0.5,
                    alignItems: "center",
                    width: "100%"
                }}>
                    <TouchableOpacity
                        onPress={() => this.scrollView.scrollTo({ y: 0, animated: true })}
                    >
                        <Image source={images.chevronRight} style={{
                            height: 25, width: 25,
                            tintColor: colors.blackLight, transform: [
                                { rotate: "-90deg" },
                            ]
                        }} />
                    </TouchableOpacity>

                </View>
            )
        }
    }



    render() {
        return (

            <View style={styles.card}>

                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}
                    ref={ref => { this.scrollView = ref }}
                    onScroll={({ nativeEvent }) => {
                        if (this.isCloseToBottom(nativeEvent)) {
                            if (this.state.scrollPosition !== "bottom") {
                                this.setState({ scrollPosition: "bottom" })
                            }
                        } else if (this.isCloseToTop(nativeEvent)) {
                            if (this.state.scrollPosition !== "top") {
                                this.setState({ scrollPosition: "top" })
                            }
                        } else {
                            if (this.state.scrollPosition !== "medium") {
                                this.setState({ scrollPosition: "medium" })
                            }
                        }
                    }}
                    scrollEventThrottle={400}
                >
                    {this.props.children}
                </ScrollView>
                {!this.props.hideControl &&
                    this.renderTopChevron()}
                {!this.props.hideControl &&
                    this.renderBottomChevron()}

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    card: {
        flex: 1,
        backgroundColor: "white",
        margin: 10,
        borderRadius: 8,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        elevation: 4,
        shadowRadius: 4,
    },
})
