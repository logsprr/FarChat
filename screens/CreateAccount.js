import React from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Image, TextInput, Alert, Platform,  AsyncStorage, Button, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../constants/styles';
import User from '../User';
import firebase from 'firebase';
import ImagePicker from 'react-native-image-picker';
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
    openBrowser= ()  =>{
        Linking.openURL('https://fir-chatapp-341b9.firebaseapp.com/');
    }
    submitForm = async () => {
        if (this.state.phone.length < 10) {
            Alert.alert('Erro', 'Numero de telefone inváli do');
        } else if (this.state.name.length <= 5) {
            Alert.alert('Erro', 'Nome inválido');
        }
        else {
            await AsyncStorage.setItem('userPhone', this.state.phone);
            User.phone = this.state.phone;
            firebase.database().ref('users/' + User.phone).set({ name: this.state.name, password: this.state.password });
            Alert.alert('Conta criada ! Por favor carregue sua imagem de perfil');
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
                            marginBottom: 50,
                        }}>
                            Por motivos de segurança sua foto será enviada através do navegador!
                            Clique no botão para abrir o navegador!
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
                    <TouchableOpacity onPress={this.openBrowser}
                        style={styles.btn}

                    >
                        <Text style={{
                            color: '#ecf0f1',
                            fontSize: 18,
                            fontWeight: 'bold',
                        }}>Selecionar foto</Text>
                    </TouchableOpacity>
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