import React from 'react';
import {View, Text, Image,  AsyncStorage} from 'react-native';
import logo from '../src/assets/firebaseload.gif';
import User from '../User';
export default class Splash extends React.Component{
    static navigationOptions = {
        header: null
      };
    componentDidMount(){
        setTimeout(() => this._bootstrapAsync(),3000);
    }
    _bootstrapAsync = async () => {
        User.phone = await AsyncStorage.getItem('userPhone');
        this.props.navigation.navigate(User.phone ? 'App' : 'Auth');
      };
    render(){
        return(
            <View style={{
                flex: 1,
                justifyContent:'center',
                alignItems: 'center',
                backgroundColor: 'rgb(234, 238, 239)',

            }}>
                <Image style={{
                    marginTop: 200,
                    marginBottom: 200,
                    flex: 1,
                    width: 200,
                    height: 100,
                    justifyContent: 'center',
                
                }}
                source={logo}
                />
            </View>
        )
    }
}