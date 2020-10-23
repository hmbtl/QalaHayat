import React, { Component } from 'react'
import { Text, StyleSheet, View, ImageBackground, Image } from 'react-native'
import { QalaProductButton } from "@component/layouts"
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Swiper from 'react-native-swiper'

import { images, constants, colors } from "@config"


export default class ProductsScreen extends Component {

    constructor(props) {
        super(props);


        let products =
            [
                { id: "life_compulsory", title: "İcbari həyat sığortası", icon: images.heart, screen: "LifeCompulsoryInsurance" },
                { id: "life_borrower", title: "Borcalanın həyat sığortası", icon: images.credit, screen: "LifeBorrowerInsurance" },
                { id: "harmless", title: "Zərərsiz və itkisiz", icon: images.protect, screen: "HarmlessInsurance" },
                { id: "capital", title: "Kapital", icon: images.capital, screen: "CapitalInsurance" },
                { id: "life_classic", title: "Klassik həyat sığortası", icon: images.trust, screen: "LifeClassicInsurance" },
                { id: "diseases", title: "Sağalmaz xəstəliklərdən sığorta", icon: images.check, screen: "DiseasesInsurance" },
                { id: "loss_of_ability", title: "Əmək qabiliyyətinin itirilməsi", icon: images.work, screen: "LossOfAbilityInsurance" },
                { id: "future", title: "Təminatlı gələcək", icon: images.future, screen: "FutureInsurance" },
            ];

        let pages = this.createPages(products);

        this.state = {
            pages: pages
        }

        this.renderPages = this.renderPages.bind(this);

    }



    createPages = (products) => {
        let rows = [], pages = [];
        const rowItemCount = 2, pageRowCount = 3;

        // divide products to rows
        while (products.length) {
            const row = products.splice(0, rowItemCount);
            rows.push(row);
        }


        // divide rows to pages
        while (rows.length) {
            const page = rows.splice(0, pageRowCount);
            pages.push(page);
        }

        return pages;
    }



    renderPages() {
        return this.state.pages.map((page, index) => {
            return (
                <View
                    style={{ flex: 1, width: constants.screenWidth }}
                    key={"page_" + index}
                >
                    <View
                        key={"view_container_" + index}
                        style={{
                            flex: 1,
                            justifyContent: 'flex-end',
                            margin: moderateScale(18),
                        }}>

                        <View
                            key={"view_sub_container_" + index}
                            style={{
                                justifyContent: 'flex-start',
                                height: verticalScale(376),
                            }}>

                            {
                                page.map((rows, rowIndex) => {
                                    return (
                                        <View style={styles.cardRow}
                                            key={"row_" + rowIndex}
                                        >
                                            {
                                                rows.map((item, itemIndex) => {
                                                    return (
                                                        <QalaProductButton
                                                            key={item.id}
                                                            text={item.title}
                                                            onPress={() => this.props.navigation.navigate(item.screen, {
                                                                id: item.id, title: item.title, icon: item.icon
                                                            })}
                                                            icon={item.icon}
                                                            containerStyle={{ marginRight: itemIndex === 0 ? scale(10) : 0 }}
                                                            disabled={false}
                                                        />
                                                    )
                                                })
                                            }
                                        </View>
                                    )
                                })
                            }

                        </View>
                    </View>
                </View >);
        })



    }

    render() {
        return (

            <ImageBackground
                //source={images.newBackground}
                source={images.backgroundWhite}
                style={{ width: '100%', height: '100%', backgroundColor: colors.primaryLight }}>

                <View style={styles.container}>
                    <Image
                        // source={images.logoSmallWhite}
                        source={images.logoQarabag}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>


                <Swiper style={styles.wrapper} showsButtons={false} loop={false}
                    paginationStyle={{ bottom: 0, margin: 0, marginBottom: verticalScale(15) }}
                    activeDotColor={colors.primaryDark}
                    buttonWrapperStyle={{ color: colors.primary, paddingHorizontal: moderateScale(3), top: moderateScale(10) }}
                    nextButton={<Text style={{ fontSize: 35, color: colors.primaryDark }}>›</Text>}
                    prevButton={<Text style={{ fontSize: 35, color: colors.primaryDark }}>‹</Text>}
                >
                    {this.renderPages()}
                </Swiper>

            </ImageBackground >

        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: verticalScale(100),
        alignItems: 'center',
        justifyContent: "flex-start"
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: "flex-start",
        height: verticalScale(115),
        marginBottom: verticalScale(7),
    },

    image: {
        height: verticalScale(150),
    },
    wrapper: {
    }

})
