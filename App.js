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
const Appstack = createStackNavigator({ Home: Homemain, Chat: ChatScreen, Profile: ProfileScreen, Map: MapScreen, MapView: MapViewScreen, Seetings: Seetings, MapUser: MapUser });
const AuthStack = createStackNavigator({ Login: Login, Create: CreateAccount });

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: Appstack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }

));