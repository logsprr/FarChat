import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  View,
} from 'react-native';
import User from '../User';
import firebase from 'firebase';
class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }
  componentWillMount(){
    const config = {
      apiKey: "AIzaSyBwdBnAVo58tvKf-v-5mZOiRD6g7DIEpyw",
      authDomain: "fir-chatapp-341b9.firebaseapp.com",
      databaseURL: "https://fir-chatapp-341b9.firebaseio.com",
      projectId: "fir-chatapp-341b9",
      storageBucket: "fir-chatapp-341b9.appspot.com",
      messagingSenderId: "220998864775"
    };
    firebase.initializeApp(config);
  }
  _bootstrapAsync = async () => {
    User.phone = await AsyncStorage.getItem('userPhone');
    this.props.navigation.navigate(User.phone ? 'App' : 'Auth');
  };
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

export default AuthLoadingScreen;