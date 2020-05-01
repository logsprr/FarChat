import React from 'react';
import {View, Text, TouchableOpacity, Alert, TextInput} from 'react-native';
import User from '../User';
import firebase from 'firebase';
import api from '../src/services/api';
export default class Check extends React.Component{
    static navigationOptions = {
        header: null
    };
    state ={
        code: '',
        email: '',
        check: '',
        message: '',
        cron : null ,
        number: 0,
        confirmResult: null,
    }

    handleChange = key => val =>{

        this.setState({ [key] : val})
        console.log(this.state.code.length);
        console.log(val);
        if(val.length == 6){
            this.checkCode(val);
        }else{
            console.log('uhu');
        }
    }

    checkCode = async (val) =>{
        const check = val;
        console.log(check);
        firebase.database().ref('users/'+User.phone+'/code').once('value', snapshot=>{
            if(check == snapshot.val()){
                firebase.database().ref('users/').child(User.phone).update({
                    "permission": true,
                });
                Alert.alert('Conta verificada com sucesso!')
                Alert.alert('Agora faça o upload de sua foto!')
                this.props.navigation.navigate('Profile');
            }

        })
    }
    
    sendCode = async  () =>{
        let rand = Math.floor(100000 + Math.random() * 900000)
        const email = this.state.email;
        await api.post('/send/code', { code: rand, email: email });
        firebase.database().ref('users/'+User.phone+'/').update({
            "code": rand,
        });
        this.cronometer();
    }

    cronometer = () =>{
        if(this.state.cron == null ){
            this.state.cron = setInterval(()=>{
                let newState = this.state;
                newState.number += 0.1;
                this.setState(newState);
                console.log(this.state.number)
                if(this.state.number >= 60.000){
                    this.setState({
                        number: 0
                    })
                    clearInterval(this.state.cron);
                    this.setState({
                        cron: null
                    })
                }
            }, 100);
        }
    }
    render(){
        return(
            <View style={{
                flex: 1,
                justifyContent:'center',
                alignItems: 'center',
            }}>
                <Text style={{
                    textAlign: 'center',
                    fontSize: 18,
                    marginBottom: 30,
                }}>
                    Favor verificar conta!
                    Digite seu email !
                    E clique em enviar codigo!
                </Text>
                <Text style={{
                    textAlign: 'center',
                    fontSize: 18,
                    marginBottom: 10,
                }}>
                    Não verificando sua conta em 24 horas , excluiremos seus dados!
                </Text>
                <Text style={{
                    textAlign: 'center',
                    color : this.state.number == 0 ? 'white' : 'black',
                    fontSize: 18}}>
                        Tente denovo em :   
                    {this.state.number.toFixed(0)}
                </Text>
                <TextInput
                    placeholder="Digite o código"
                    placeholderTextColor='#000'
                    style={{
                        padding: 10,
                        borderWidth: 1,
                        borderColor: '#ced6e0',
                        width: 300,
                        marginTop: 10,
                        borderRadius: 5,
                    }}
                    keyboardType='default'
                    maxLength={6}
                    value={this.state.code}
                    onChangeText={this.handleChange('code')}
                    returnKeyType="next"
            
                />
                <TextInput
                    placeholder="Digite o email"
                    placeholderTextColor='#000'
                    style={{
                        padding: 10,
                        borderWidth: 1,
                        borderColor: '#ced6e0',
                        width: 300,
                        marginTop: 10,
                        borderRadius: 5,
                    }}
                    keyboardType='default'
                    autoCapitalize="none"
                    value={this.state.email}
                    onChangeText={this.handleChange('email')}
                    returnKeyType="next"
            
                />
                <TouchableOpacity style={{
                   marginTop: 30,
                   justifyContent: 'center',
                   alignItems: 'center',
                   width: 300,
                   height: 50,
                   backgroundColor: '#f1c40f',
                }}
                    onPress={this.sendCode}
                >
                    <Text style={{
                        textAlign: 'center',
                        color: '#ecf0f1',
                        fontWeight: 'bold',
                        fontSize: 18
                    }}>
                        Enviar código de verificação
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}