import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator, TransitionPresets } from 'react-navigation-stack';
import { fromRight } from 'react-navigation-transitions';
import {
  HomeScreen,
  LoginScreen,
  SplashScreen,
  MapScreen,
  ProfileScreen,
  AboutScreen,
  ContractScreen,
  SettingScreen,
  OnlinePaymentScreen,
  PaymentScreen,
  PDFScreen,
  PinScreen,
  ProductsScreen,
  LifeBorrowerInsuranceScreen,
  LifeClassicInsuranceScreen,
  LifeCompulsoryInsuranceScreen,
  LossOfAbilityInsuranceScreen,
  FutureInsuranceScreen,
  HarmlessInsuranceScreen,
  CapitalInsuranceScreen,
  DiseasesInsuranceScreen,
  TestScreen
} from '@screens';
import { constants, colors } from '@config';
import { Platform } from 'react-native';

const navigationOptions = {
  headerStyle: {
    elevation: 0, // remove shadow on Android
    shadowOpacity: 0, // remove shadow on iOS
  },
  headerTintColor: 'black',
};

const wizardNavOptions = {
  headerTransparent: true,
  headerTintColor: 'black',
  headerShown: Platform.OS === "ios",
  headerTitle: ""
}

const AppStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        headerTransparent: true,
        headerTintColor: 'white',
        headerTitle: ""
      },
    },
    Products: {
      screen: ProductsScreen,
      navigationOptions: {
        headerTransparent: true,
        headerTintColor: 'white',
        headerTitle: ""
      },
    },
    Test: {
      screen: TestScreen,
      navigationOptions: {
        headerTransparent: false,
        headerTintColor: 'white',
        headerTitle: ""
      },
    },
    LifeCompulsoryInsurance: {
      screen: LifeCompulsoryInsuranceScreen,
      navigationOptions: wizardNavOptions,
    },
    LifeBorrowerInsurance: {
      screen: LifeBorrowerInsuranceScreen,
      navigationOptions: wizardNavOptions,
    },
    LifeClassicInsurance: {
      screen: LifeClassicInsuranceScreen,
      navigationOptions: wizardNavOptions,
    },
    LossOfAbilityInsurance: {
      screen: LossOfAbilityInsuranceScreen,
      navigationOptions: wizardNavOptions,
    },
    DiseasesInsurance: {
      screen: DiseasesInsuranceScreen,
      navigationOptions: wizardNavOptions,
    },
    FutureInsurance: {
      screen: FutureInsuranceScreen,
      navigationOptions: wizardNavOptions,
    },
    CapitalInsurance: {
      screen: CapitalInsuranceScreen,
      navigationOptions: wizardNavOptions,
    },
    HarmlessInsurance: {
      screen: HarmlessInsuranceScreen,
      navigationOptions: wizardNavOptions,
    },
    Payment: {
      screen: PaymentScreen,
      navigationOptions: {
        headerTransparent: false,
        headerBackTitleVisible: false,
        headerTintColor: 'white',
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: colors.primary,
        },
        title: 'Sığorta ödənişi',
      },
    },
    PDF: {
      screen: PDFScreen,
      navigationOptions: {
        headerTransparent: false,
        headerBackTitleVisible: false,
        headerTintColor: 'black',
        headerTitleAlign: "center",
      },
    },
    About: {
      screen: AboutScreen,
      navigationOptions: {
        headerTransparent: true,
        headerTintColor: 'white',
      },
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        headerTransparent: false,
        headerBackTitleVisible: false,
        headerTintColor: 'white',
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: colors.primary,
        },
      },
    },
    OnlinePayment: {
      screen: OnlinePaymentScreen,
      navigationOptions: {
        headerTransparent: false,
        headerBackTitleVisible: false,
        headerTintColor: 'white',
        headerTitleAlign: "center",
        title: 'Onlayn Ödəniş',
        headerStyle: {
          backgroundColor: colors.primary,
        },
      },
    },
    Setting: {
      screen: SettingScreen,
      navigationOptions: {
        headerTransparent: false,
        headerTintColor: 'white',
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTitle: "Məlumatlarım"
      },
    },
    Map: {
      screen: MapScreen,
      navigationOptions: {
        headerTransparent: true,
        headerTintColor: 'black',
        headerTitle: ""
      },
    },
    Contract: {
      screen: ContractScreen,
      navigationOptions: {
        headerTransparent: false,
        headerTintColor: 'white',
        headerTitleAlign: "center",

        headerStyle: {
          backgroundColor: colors.primary,

        },
        headerTitle: "Müqavilələrim"
      },
    },
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerBackTitleVisible: false,
      ...TransitionPresets.SlideFromRightIOS,
    }
  },
);

/*
const AuthStack = createStackNavigator(
  {
    SMSAuth: SMSAuthScreen,
    SMSVerify: SMSVerifyScreen,
    SMSFinal: SMSFinalScreen,
  },
  { defaultNavigationOptions: navigationOptions, initialRouteName: 'SMSAuth' },
);
*/


const AuthStack = createStackNavigator(
  {
    Login: LoginScreen,
  },
  { defaultNavigationOptions: navigationOptions, initialRouteName: 'Login', headerMode: "none" },
);


export default createAppContainer(
  createSwitchNavigator(
    {
      Splash: SplashScreen,
      App: AppStack,
      Pin: { screen: PinScreen },
      Auth: AuthStack,
    },
    {
      initialRouteName: 'Splash',
    },
  ),
);
