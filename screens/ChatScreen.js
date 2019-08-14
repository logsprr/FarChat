import React from 'react';
import {View, Text, TextInput, Image, KeyboardAvoidingView, Platform,  Dimensions,TouchableOpacity, FlatList} from 'react-native';
import styles from '../constants/styles';
import Icon from 'react-native-vector-icons/Ionicons';
import User from '../User';
import firebase from 'firebase';
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
            },
            textMessage: '',
            messageList:[],
            refwidth : null
        }
    }
    componentDidMount(){
        var usersRef = firebase.database().ref('users/');
        var hopperRef = usersRef.child(User.phone);
        hopperRef.update({
          "status": "online"
        });
    }
    componentWillMount(){
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
      }
    convertTime = (time) =>{
        let d = new Date(time);
        let c = new Date();
        let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
        result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
        if(c.getDay() !== d.getDay()){
            result = d.getDay() + ' ' + d.getMonth() + ' ' + result; 
        }
        return result;
    }
    handleChange = key => val =>{
        this.setState({[key]: val})
    }
    sendMessage = async () =>{
        if(this.state.textMessage.length > 0){
            let msgId = firebase.database().ref('messages').child(User.phone).child(this.state.person.phone).push().key;
            let updates = {};
            let message = {
                message : this.state.textMessage,
                time: firebase.database.ServerValue.TIMESTAMP,
                from: User.phone
            }     
            updates['messages/'+ this.state.person.phone+'/'+User.phone+'/'+msgId] = message;
            updates['messages/'+ User.phone+'/'+this.state.person.phone+'/'+msgId] = message;
            firebase.database().ref().update(updates);
            this.setState({textMessage:''});
            
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
                <Text style={{
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
                </Text>


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
                <TextInput 
                    style={[styles.input2, {marginLeft:10 , borderRadius: 15}]}
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
            </View>
        </KeyboardAvoidingView>
        )
    }
}