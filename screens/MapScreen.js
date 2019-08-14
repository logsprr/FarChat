import React from 'react';
import {View, Text, Image, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import styles from  '../constants/styles';
import usericon from '../src/assets/user.png';
import firebase from   'firebase';
import User from  '../User';
import ImageView from 'react-native-image-view';

export default class MapScreen extends React.Component{
    static navigationOptions = ({navigation}) =>{
        return {
            title: navigation.getParam('name',null),
        }
    }
    constructor(props){
        super(props)
        this.state = {
            avatar: props.navigation.getParam('avatar'),
            name : props.navigation.getParam('name'),
            phone: props.navigation.getParam('phone'),
            isImageViewVisible: false,
        }
    }
    componentWillUnmount(){
        var usersRef = firebase.database().ref('users/');
        var hopperRef = usersRef.child(User.phone);
        hopperRef.update({
          "status": "offline"
        });
      }
      componentDidMount(){
        var usersRef = firebase.database().ref('users/');
        var hopperRef = usersRef.child(User.phone);
        hopperRef.update({
          "status": "online"
        });
    }
    showimage = async () =>{
        const images = [
    {
        source: {
            uri: this.state.avatar,
        },
        title: 'Paris',
        width: 806,
        height: 720,
    },
];
    }
    render(){
        return(
           <KeyboardAvoidingView
           behavior="padding"
           enabled={Platform.OS==='ios'}
           style={styles.container}
         >
           <View>
               <TouchableOpacity>
                    <Image source={{uri : this.state.avatar}}  style={[styles.logo, {
                        borderRadius: 110,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 220,
                        height: 220,
                        marginLeft:40,
                        
                    }]} />
                </TouchableOpacity>
              
                <TouchableOpacity
                    style={styles.btn}
                >
                    <Text style={{
                    color: '#ecf0f1',
                    fontSize: 20,
                    fontWeight:'bold',    
                    }}>{this.state.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btn}
                >
                    <Text style={{
                    color: '#ecf0f1',
                    fontSize: 18,
                    fontWeight:'bold',    
                    }}>{this.state.phone}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => this.props.navigation.navigate('MapView')}
                >
                    <Text style={{
                    color: '#ecf0f1',
                    fontSize: 18,
                    fontWeight:'bold',    
                    }}>Localização</Text>
                </TouchableOpacity>
            </View>
         </KeyboardAvoidingView>
        )
    }
}