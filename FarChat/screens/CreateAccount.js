import React from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Image, TextInput, Alert, Platform,  AsyncStorage, Button, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../constants/styles';
import User from '../User';
import firebase from 'firebase';
import ImagePicker from 'react-native-image-picker';
import Key from '../constants/key';
export default class CreateAccount extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Criar Conta',
            headerTitleStyle: {
                textAlign: 'center',
                flexGrow:1,
                paddingRight: Platform.OS === 'ios' ? 0 : 50,
                alignSelf:'center',
            },
            headerLeft: () => <TouchableOpacity style={{
                paddingLeft: 5,
            }} onPress={() => navigation.goBack()}>
                <Icon name="ios-arrow-back" size={25} color='#0652DD'
                    style={{
                        marginTop: 0,
                    }}
                />
                <Text style={{
                    fontSize: 18,
                    color: '#0652DD',
                    marginLeft: 15,
                    marginTop: -25,
                }}>Voltar</Text>
            </TouchableOpacity>
        }
    }
    state = {
        phone: '',
        name: '',
        password: '',
        avatar: '',
        photo: null
    }
    handleChange = key => val => {
        this.setState({ [key]: val })
    }
    
    passwordsubmit = () =>{
        const password = this.state.password;
        const name = this.state.name;

        if(password.length <=5 ){
            const pass = password.toString();
            const newpass = pass * Key.key2+ pass + Key.key8+ Key.key4 * (pass + Key.key2+ pass + Key.key8+ Key.key4) / Key.key10 ;
            this.setState({
                password : newpass
            })
        }
        else if(password.length <=10){
            const pass = password.toString();
            const newpass = pass * Key.key4+ pass + Key.key5+ Key.key4 * (pass + Key.key8+ pass + Key.key8+ Key.key9) / Key.key7 ;
            this.setState({
                password : newpass
            })
        }
        else if(password .length>=10 && password.length <=20){
            const pass = password.toString();
            const newpass = pass * Key.key2+ pass + Key.key7+ Key.key2 * (pass + Key.key5+ pass + Key.key8+ Key.key4) / Key.key9 ;
                this.setState({
                    password : newpass
            })
        }
    }
    submitForm = async () => {
        this.passwordsubmit();
        if (this.state.phone.length < 10) {
            Alert.alert('Erro', 'Numero de telefone inváli do');
        } else if (this.state.name.length <= 5) {
            Alert.alert('Erro', 'Nome inválido');
        }
        else {
            await AsyncStorage.setItem('userPhone', this.state.phone);
            User.phone = this.state.phone;
            firebase.database().ref('users/' + User.phone).set({ name: this.state.name, password: this.state.password, lastindex : 0 , avatar: 'https://img.icons8.com/ios-glyphs/50/000000/cat-profile--v1.png'});
            firebase.database().ref('users/' + User.phone+ '/friends/' + 0).set({ name : 'ChatBot', avatar : 'https://firebasestorage.googleapis.com/v0/b/fir-chatapp-341b9.appspot.com/o/images%2F101010101010?alt=media&token=5346cbb1-995c-4eb5-8dae-987a75c5d7d9', id: 0, phone : 'ChatBot' });
            Alert.alert('Conta criada ! Por favor carregue sua imagem de perfil');
            this.props.navigation.navigate('Login');
        }
    }
    render() {
        const { photo } = this.state
        return (
            <KeyboardAvoidingView
                behavior="padding"
                enabled={Platform.OS === 'ios'}
                style={styles.container}
            >
                <View>
                        <Text style={{
                            width: 300,
                            marginBottom: 10,
                            flexDirection: 'column',
                        }}
                        >
                            Por motivos de segurança sua foto será enviada através do navegador!
                        </Text>
                        <Text style={{
                            width: 300,
                            marginBottom: 10,
                            flexDirection: 'column',
                        }}
                        >
                            Isso somente após a confirmação de seus dados sejam validos! 
                            
                        </Text>
                        <Text style={{
                            width: 300,
                            marginBottom: 10,
                            flexDirection: 'column',
                        }}
                        >
                            Faça  o cadastro e depois faça o login para continuar o processo.
                        </Text>
                  
                    <TextInput
                        placeholder="Nome"
                        placeholderTextColor='#000'
                        style={styles.input}
                        keyboardType='default'
                        value={this.state.name}
                        onChangeText={this.handleChange('name')}
                    />
                    <TextInput
                        placeholder="Telefone"
                        placeholderTextColor='#000'
                        style={styles.input}
                        keyboardType='phone-pad'
                        value={this.state.email}
                        onChangeText={this.handleChange('phone')}
                    />
                    <TextInput
                        placeholder="Senha"
                        secureTextEntry={true}
                        placeholderTextColor='#000'
                        style={styles.input}
                        value={this.state.password}
                        onChangeText={this.handleChange('password')}
                    />
                    <TouchableOpacity onPress={this.submitForm}
                        style={styles.btn}
                    >
                        <Text style={{
                            color: '#ecf0f1',
                            fontSize: 18,
                            fontWeight: 'bold',
                        }}>Cadastrar</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}