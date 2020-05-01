import  React from 'react';
import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import Homemain from  './screens/Homemain';
import Login from './screens/Login';
import AuthLoadingScreen from  './screens/AuthLoadingScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import CreateAccount from './screens/CreateAccount';
import MapScreen from  './screens/MapScreen';
import MapViewScreen from './screens/MapViewScreen';
import Seetings from './screens/Seetings';
import MapUser from './screens/MapUser';
import Contacts from './screens/Contact';
import ChatMain from './screens/ChatMain';
import Check from './screens/CheckScreen';
import Splash from './screens/Splash';
import Intro from './screens/IntroScreen';
const Appstack = createStackNavigator({ ChatMain: ChatMain, Check: Check , Home: Homemain, Chat: ChatScreen, Profile: ProfileScreen, Map: MapScreen, MapView: MapViewScreen, Seetings: Seetings, MapUser: MapUser, Cont: Contacts, });
const AuthStack = createStackNavigator({ Login: Login, Create: CreateAccount });

export default createAppContainer(createSwitchNavigator(
  {
    Intro: Intro,
    AuthLoading: AuthLoadingScreen,
    Splash: Splash,
    App: Appstack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'Intro',
  }
));