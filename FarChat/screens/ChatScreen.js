import React from 'react';
import {View, Text, TextInput, Image, KeyboardAvoidingView, Platform,  Dimensions,TouchableOpacity, FlatList} from 'react-native';
import styles from '../constants/styles';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/FontAwesome';
import User from '../User';
import firebase from 'firebase';
import ImagePicker from 'react-native-image-picker';
import  aws from '../constants/awskey';
import AWS from 'aws-sdk';
export default class ChatScreen extends React.Component{
    static navigationOptions = ({navigation}) =>{
        return {
            title: navigation.getParam('name',null),
            headerRight: (
                <TouchableOpacity onPress={() => navigation.navigate('Map',{name: navigation.getParam('name'), avatar : navigation.getParam('avatar'), phone: navigation.getParam('phone')})}>
                    <Image source={{uri: navigation.getParam('avatar')}} style={{
                        width: 38,
                        height: 38,
                        borderRadius: 18,
                        marginRight: 10,
                    }}/>
                </TouchableOpacity>
            )
        }
    }
    constructor(props){
        super(props);
        this.state = {
            person: {
                name: props.navigation.getParam('name'),
                phone: props.navigation.getParam('phone'),
                avatar: props.navigation.getParam('avatar'),
                id: props.navigation.getParam('id'),
            },
            textMessage: '',
            messageList:[],
            refwidth : null,
            type : '',
            random: '',
            arr : [],
        }
    }
    componentDidMount(){
        var usersRef = firebase.database().ref('users/');
        var hopperRef = usersRef.child(User.phone);
        hopperRef.update({
          "status": "online"
        });
        firebase.database().ref('messages').child(User.phone).child(this.state.person.phone)
        .on('child_added', (value)=>{
            this.setState((prevState)=>{
                return {
                    messageList: [value.val(), ...prevState.messageList]
                }
            })
        })
    }
    componentWillUnmount(){
        var usersRef = firebase.database().ref('users/');
        var hopperRef = usersRef.child(User.phone);
        hopperRef.update({
          "status": "offline"
        });
        const _id = this.state.person.id * -1;
        console.log(_id);
        firebase.database().ref('users/'+User.phone+'/friends/'+_id+'/badge').once('value', snapshot=>{
            if(snapshot.val() == null){
                console.log(snapshot.val())
            }
            else{
                const val = 0;
                firebase.database().ref('users/'+User.phone+'/friends/'+_id).update({
                    badge: val
                })
                console.log(val);
            }
        })
      }
    convertTime = (time) =>{
        let d = new Date(time);
        console.log(d);
        let c = new Date();
        console.log(c);
        let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
        result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
        if(c.getDay() !== d.getDay()){
            result = d.getDay() + ' ' + d.getMonth() + ' ' + result; 
        }
        console.log(result);
        return result;
    }
    handleChange = key => val =>{
        this.setState({[key]: val})
    }
    sendMessage = async () =>{
        const type = this.state.type;
        if(this.state.textMessage.length > 0){
            firebase.database().ref('users/'+this.state.person.phone+'/friends').once('value', snapshot=>{
                this.setState({
                    arr : snapshot.val(),
                })
                console.log(this.state.arr);
                const newArr = this.state.arr.filter(item=>{
                    return item.phone == User.phone;
                });
                console.log(this.state.arr);
                console.log(newArr); 
            });
            let msgId = firebase.database().ref('messages').child(User.phone).child(this.state.person.phone).push().key;
            let updates = {};
            let message = {
                message : this.state.textMessage,
                time: firebase.database.ServerValue.TIMESTAMP,
                from: User.phone,
                type : type == 1 ? 'image' : 'text',
                id: this.state.person.id
            } 
            const id = this.state.person.id * (-1);
            updates['messages/'+ this.state.person.phone+'/'+User.phone+'/'+msgId] = message;
            updates['messages/'+ User.phone+'/'+this.state.person.phone+'/'+msgId] = message;
            firebase.database().ref().update(updates);
            this.setState({textMessage:''});
            firebase.database().ref('users/'+this.state.person.phone+'/friends/'+id+'/badge').once('value', snapshot=>{
                if(snapshot.val() == null){
                    const val = 1;
                    console.log(val);
                    firebase.database().ref('users/'+this.state.person.phone+'/friends/'+id).update({
                        badge: val
                    })
                    console.log(snapshot.val())
                }
                else{
                    const val = snapshot.val() +1;
                    firebase.database().ref('users/'+this.state.person.phone+'/friends/'+id).update({
                        badge: val
                    })
                }
            })
            
        }
    }
    getwith =  ({item}) =>{
        if(item>5){
            this.setState.refwidth ('20%');
        }
        else if(item>10){
            this.setState.refwidth ('40%');
        }
        else if(item>20){
            this.setState.refwidth ('60%');
        }
        else if(item>30){
            this.setState.refwidth ('80%');
        }
        else if(item>40){
            this.setState.refwidth ('90%');
        }
    }
    sendImage =() =>{
        const options = {
            title: 'Selecionar Foto',
            cancelButtonTitle : 'cancelar',
            takePhotoButtonTitle: 'Tirar foto',
            chooseFromLibraryButtonTitle: 'Selecionar da galeria',
            noData: true,
            maxWidth : 1024,
            maxHeight : 1024,
            allowsEditing: true,
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
          };
        
          ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            var s3 = new AWS.S3({accessKeyId: aws.accesKeyId, secretAccessKey: aws.secretAccesKey, region:'us-east-1'});
            var params = {Bucket: 'imagesfarchat', Key: 'images.jpg', ContentType: 'image/jpeg'};
            s3.getSignedUrl('putObject', params, function (err, url) {
                console.log('URL DO AWS', url);
            });
            let rand = Math.floor(100000 + Math.random() * 900000) + User.phone * this.state.person.phone;
            this.setState({
                random : 'https://imagesfarchat.s3.amazonaws.com/images/'+rand+'.jpg',
            })
            const xhr = new XMLHttpRequest()
                xhr.open('PUT', 'https://imagesfarchat.s3.amazonaws.com/images/'+rand+'.jpg');
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                        console.log('Sucesso');
            
                    } else {
                        console.log('ERRO PORRA')
                        Alert.alert('Erro ao fazer o upload');
                    }
                }
            }
            this.renderPhoto();
            xhr.setRequestHeader('Content-Type', 'image/jpeg')
            xhr.send({ uri: response.uri, type: 'image/jpeg', name: rand+'.jpg'})
          });    
    }
    renderPhoto = () =>{
        const rand = this.state.random;
        this.setState({
            textMessage : rand,
        })
        this.setState({
            type : 1,
        })
        this.sendMessage();

    }
    
    renderRow = ({ item }) =>{
        return(
            <View style={{
                flexDirection:'row',
                width: this.getwith(item.message),
                alignSelf: item.from===User.phone ? 'flex-end' : 'flex-start',
                backgroundColor: item.from===User.phone ? '#ced6e0' : '#ffffff',
                borderColor: item.from===User.phone ? '#ced6e0' : '#a4b0be',
                borderWidth: item===User.phone ? 0 : 1,
                borderRadius: 10,
                marginBottom: 10,
            }}>
                {item.type == 'text' ? <Text style={{
                    color: '#2f3542',
                    padding: 10,
                    fontSize: 16,

                }}>
                    {item.message} <Text style={{
                        color: item.from===User.phone ? '#ced6e0' : '#ffffff',
                    }}>
                        .....
                    </Text>
                        <Text style={{
                            color:'#57606f',
                            paddingRight: -20,
                            fontSize: 12,
                        }}>
                        {this.convertTime(item.time)}
                    </Text>
                </Text> : <View style={{
                    width: 320,
                    height: 320,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                            <Image
                                source={{uri : item.message}}
                                style={{
                                    width: 300,
                                    height: 300,
                                    alignContent: 'center',
                                    justifyContent: 'center',
                                    paddingTop: 10,
                                    paddingRight: 10,
                                }}
                        />
                </View>}


            </View>
        )
    }
    render(){
        let {height, width} = Dimensions.get('window');
        return (
            <KeyboardAvoidingView 
                style={styles.container}
                behavior='position' keyboardVerticalOffset={70}
                enabled={Platform.OS === 'ios'}   
            >
            <FlatList
                inverted
                style={{padding: 10, height: height * 0.08, paddingBottom:40}}
                data={this.state.messageList}
                renderItem={this.renderRow}
                contentInset={{top: 0, bottom: 30, left: 0, right: 0}}
                contentInsetAdjustmentBehavior="automatic"
                keyExtractor={(item, index)=> index.toString()}
                />    
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <TouchableOpacity
                        onPress={this.sendImage}
                        style={{
                            paddingLeft: -20,
                            paddingTop: 25,
                            paddingBottom: 20,
                            
                        }}
                    >
                        <Icon2 name="pluscircle" size={28}  />
                </TouchableOpacity>
                <TextInput 
                    style={[styles.input2, {marginLeft:5 , borderRadius: 15}]}
                    value={this.state.textMessage}
                    placeholder="Digite aqui"
                    placeholderTextColor="#000"
                    onChangeText={this.handleChange('textMessage')}
                />
                <TouchableOpacity onPress={this.sendMessage}
                    style={{
                        paddingLeft: 10,
                        paddingTop: 25,
                        paddingBottom: 20,
                        
                    }}
                >
                    <Icon name="md-send" size={28}  />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        paddingLeft: 10,
                        paddingTop: 25,
                        paddingBottom: 20,
                        
                    }}
                >
                    <Icon3 name="microphone" size={28}  />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
        )
    }
}