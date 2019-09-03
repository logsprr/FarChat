import React from 'react';
import {View, Text, Image,AsyncStorage , Alert,KeyboardAvoidingView, TextInput, TouchableOpacity, Animated, Linking} from 'react-native';
import User from '../User';
import cosplayer from '../src/assets/cosplayer.png';
import styles from '../constants/styles';
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/AntDesign';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import ImagePicker from 'react-native-image-picker';
import {RNS3} from  'react-native-aws3';
import  aws from '../constants/awskey';
import AWS from 'aws-sdk';

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
        name: '',
        profile: '',
        visible: false,
        verification: false,
        url : '',
    }
    handleChange = key => val =>{
        this.setState({[key]: val})
    }
    openBrowser= ()  =>{
        Linking.openURL('https://fir-chatapp-341b9.firebaseapp.com/');
    }
    sendImage =() =>{
      const options = {
        title: 'Selecionar Foto',
        cancelButtonTitle : 'cancelar',
        takePhotoButtonTitle: 'Tirar foto',
        chooseFromLibraryButtonTitle: 'Selecionar da galeria',
        customButtons: [{ name: 'fb', title: 'Selecionar foto do Facebook' }],
        noData: true,
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
      ImagePicker.showImagePicker(options, (response) => {
        const file ={
          uri: response.uri,
          name : User.phone,
          type: 'image/jpg',
        }
        var s3 = new AWS.S3({accessKeyId: aws.accesKeyId, secretAccessKey: aws.secretAccesKey, region:'us-east-1'});
        var params = {Bucket: 'imagesfarchat', Key: 'images.jpg', ContentType: 'image/jpeg'};
        s3.getSignedUrl('putObject', params, function (err, url) {
            console.log('URL DO AWS', url);
        });
        const xhr = new XMLHttpRequest()
            xhr.open('PUT', 'https://imagesfarchat.s3.amazonaws.com/images/'+User.phone+'.jpg')
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                    console.log('Sucesso');
                    Alert.alert('Upload feito com sucesso');
                    firebase.database().ref('users/'+User.phone).update({
                      avatar: 'https://imagesfarchat.s3.amazonaws.com/images/'+User.phone+'.jpg'
                    })
                    this.props.navigation.navigate('ChatMain');
                } else {
                    console.log('ERRO PORRA')
                    Alert.alert('Erro ao fazer o upload');
                }
            }
        }
        xhr.setRequestHeader('Content-Type', 'image/jpeg')
        xhr.send({ uri: response.uri, type: 'image/jpeg', name: User.phone+'.jpg'})
        this.props.navigation.navigate('ChatMain');
      });
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
        this.namedin();
        this.profilepicture();
        var usersRef = firebase.database().ref('users/');
        var hopperRef = usersRef.child(User.phone);
        hopperRef.update({
          "status": "online"
        });
    }
    componentWillUnmount(){
        var usersRef = firebase.database().ref('users/');
        var hopperRef = usersRef.child(User.phone);
        hopperRef.update({
          "status": "offline"
        });
      }
    namedin = () =>{
        firebase.database().ref('users/'+User.phone+'/name').once('value', snapshot=>{
            console.log(snapshot.val());
            this.setState({
                name : snapshot.val(),
            })
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
                       {this.state.profile == null ?  <Image style={{
                            width: 250,
                            height: 250,
                            borderRadius: 125,
                            marginBottom: 40,
                        }}source={cosplayer}/> :  <Image style={{
                            width: 250,
                            height: 250,
                            borderRadius: 125,
                            marginBottom: 40,
                        }}source={{uri : this.state.profile}}/>}
                    </TouchableOpacity>
                </ShimmerPlaceHolder>
                <Text style={{
                    fontSize: 20,
                    textAlign: 'center',
                    marginBottom: 10,
                }}>Usuario :{this.state.name}</Text>
                <Text style={{
                    fontSize: 20,
                    marginBottom: 10,
                    textAlign: 'center',
                }}>Numero:{User.phone}</Text>
                <TouchableOpacity
                    onPress={this.sendImage}
                    style={[styles.btn,{backgroundColor: '#f1c40f'}]}>
                    <Text style={{
                        color: '#ecf0f1',
                        fontSize: 18,
                        fontWeight:'bold',
                    
                    }}> Selecionar foto de perfil</Text>
                </TouchableOpacity>
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