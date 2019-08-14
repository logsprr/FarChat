import React from 'react';
import {View, Text, Image,AsyncStorage , Alert,KeyboardAvoidingView, TextInput, TouchableOpacity, Animated} from 'react-native';
import User from '../User';
import styles from '../constants/styles';
import firebase from 'firebase';
import usericon from '../src/assets/user.png';
import Icon from 'react-native-vector-icons/AntDesign';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import BackgroundTask from 'react-native-background-task';
BackgroundTask.define(() => {
  console.log('EStou no back')
    var usersRef = firebase.database().ref('users/');
    var hopperRef = usersRef.child(User.phone);
    hopperRef.update({
      "status": "offline"
    });
  BackgroundTask.finish()
})
export default class ProfileScreen extends React.Component{

    static navigationOptions = ({navigation})=> {
        return{
            title: 'Profile',
            headerRight: (
                <TouchableOpacity onPress={() => navigation.navigate('Seetings')}
                    style={{
                    paddingRight: 12,
                }}>
                    <Icon name='setting' size={25} />
                </TouchableOpacity>
            )
        }
      }
    state ={
        name: User.name,
        profile: '',
        visible: false,
    }
    handleChange = key => val =>{
        this.setState({[key]: val})
    }
    changeName = async () =>{
        if(this.state.name.length<3){
            Alert.alert('Erro','Insira nome valido');
        }else if(User.name !== this.state.name){
            var usersRef = firebase.database().ref('users/');
            var hopperRef = usersRef.child(User.phone);
            hopperRef.update({
              "name": this.state.name,
            });
            User.name= this.state.name;
            Alert.alert('Sucesso', 'Nome alterado');
        }
    }
    componentDidMount(){
        this.profilepicture();
        var usersRef = firebase.database().ref('users/');
        var hopperRef = usersRef.child(User.phone);
        hopperRef.update({
          "status": "online"
        });
        BackgroundTask.schedule();
    }
    componentWillUnmount(){
        var usersRef = firebase.database().ref('users/');
        var hopperRef = usersRef.child(User.phone);
        hopperRef.update({
          "status": "offline"
        });
      }
    profilepicture = () =>{
        firebase.database().ref('users/'+User.phone+'/avatar').once('value', snapshot=>{
            console.log(snapshot.val());
            this.state.profile = snapshot.val();
            console.log(this.state.profile);
            this.setState({
                profile: snapshot.val(),
            })
            console.log(this.state.profile);
            setTimeout(()=> this.setState({visible:!this.state.visible}), 5000);         
        })
      }
    logout = async () =>{
        var usersRef = firebase.database().ref('users/');
        var hopperRef = usersRef.child(User.phone);
        hopperRef.update({
              "status": "offline",
              "logged": false,
        });
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    }
    render(){
        const photo = this.state.profile;
        return(
            <KeyboardAvoidingView
            style={styles.container}
            behavior='position' 
            enabled={Platform.OS === 'ios'} 
            >  
                <ShimmerPlaceHolder style={{
                    width:250,
                    height: 250,
                    borderRadius: 125,
                    marginBottom: 40,
                    marginLeft: 20,
                    backgroundColor: '#bdc3c7',
                    }}
                    autoRun={true}
                    visible={this.state.visible}>
                    <TouchableOpacity style={{
                        marginLeft: 20,
                    }}>
                        <Image style={{
                            width: 250,
                            height: 250,
                            borderRadius: 125,
                            marginBottom: 40,
                        }}source={{uri:this.state.profile}}/>
                    </TouchableOpacity>
                </ShimmerPlaceHolder>
                <Text style={{
                    fontSize: 20,
                    textAlign: 'center',
                    marginBottom: 10,
                }}>Usuario :{User.name}</Text>
                <Text style={{
                    fontSize: 20,
                    marginBottom: 10,
                    textAlign: 'center',
                }}>Numero:{User.phone}</Text>
                {/* <TextInput
                    placeholder="Trocar nome"
                    placeholderTextColor='#000'
                    style={styles.input}
                    value={this.state.name}
                    onChangeText={this.handleChange('name')}
                />
                <TouchableOpacity 
                    onPress={this.changeName}
                    style={styles.btn}>
                    <Text style={{
                        color: '#ecf0f1',
                        fontSize: 18,
                        fontWeight:'bold',
                    
                    }}>Atualizar</Text>
                </TouchableOpacity> */}
                <TouchableOpacity 
                    onPress={this.logout}
                    style={[styles.btn,{backgroundColor: '#c0392b'}]}>
                    <Text style={{
                        color: '#ecf0f1',
                        fontSize: 18,
                        fontWeight:'bold',
                    
                    }}> Sair</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        )
    }
}