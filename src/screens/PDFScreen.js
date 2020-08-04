import React, { Component } from 'react';
import { StyleSheet, StatusBar, TouchableOpacity, Image } from 'react-native';
import { LoadingView, Dialog } from '@component/views';
import Pdf from 'react-native-pdf';
import { images } from '@config'
import Share from "react-native-share";


export default class PDFScreen extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title', 'PDF'),
            headerRight: () => (
                <TouchableOpacity
                    onPress={navigation.getParam('share')}
                    style={{
                        right: 10,
                        alignItems: 'flex-end',
                        backgroundColor: 'transparent',
                        paddingLeft: 15,
                    }} >
                    <Image style={{ width: 30, height: 30, tintColor: "#414141" }} source={images.share} />
                </TouchableOpacity >
            ),
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            showDialog: false,
            path: ""
        };
        this.share = this.share.bind(this);
    }

    share = () => {
         Share.open({
            url: `file:///` + this.state.path,
            message: this.state.title,
            title: 'PDF'
        })
            .then((res) => { console.log(res) })
            .catch((err) => { err && console.log(err); });
    }

    componentDidMount() {
        this.props.navigation.setParams({ share: this.share });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.showDialog === true && this.state.showDialog === false) {
            this.props.navigation.goBack();
        }
    }

    render() {


        let pdf = this.props.navigation.getParam(
            'pdf',
            '',
        );



        const source = { uri: "https://personal.qala.az" + pdf, cache: true };

        return (
            <LoadingView
                isLoading={this.state.isLoading}
                showBlur={true}
                style={{ flex: 1 }}>
                <StatusBar
                    backgroundColor="transparent"
                    barStyle="dark-content"
                    translucent={true}
                />
                <Dialog
                    onCancelPress={() => { this.setState({ showDialog: false }) }}
                    animationType="fade"
                    title="Xəta"
                    cancelText="Bağla"
                    transparent={true}
                    visible={this.state.showDialog}
                    content="Təəssüf ki, axtardığınız pdf fayl tapılmadı."
                />
                <Pdf
                    source={source}
                    onError={(error) => {
                        this.setState({ showDialog: true, isLoading: false })
                    }}
                    onLoadComplete={(numberOfPages, filePath) => {
                        this.setState({ isLoading: false, path: filePath })
                    }}

                    style={styles.pdf} />
            </LoadingView>
        );
    }
}


const styles = StyleSheet.create({
    pdf: {
        flex: 1,
    },
});
