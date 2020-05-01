import  React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  AsyncStorage,
} from 'react-native';
import logo from '../src/assets/logo.png';
import User from '../User';
import styles from '../constants/styles';
import firebase from 'firebase';
import Key from '../constants/key';
class Login extends React.Component{
  static navigationOptions = {
    header: null
  };
  state = {
    phone: '',
    name: '',
    password: '',
    avatar: '',
    check: '',
  }

  handleChange = key => val =>{
    this.setState({ [key] : val})
  }
  passwordsubmit = () =>{
    const password = this.state.password;

    if(password.length <=5 ){
        const pass = password.toString();
        const newpass = pass * Key.key2+ pass + Key.key8+ Key.key4 * (pass + Key.key2+ pass + Key.key8+ Key.key4) / Key.key10 ;
        this.setState({
            check : newpass
        })
    }
    else if(password.length <=10){
        const pass = password.toString();
        const newpass = pass * Key.key4+ pass + Key.key5+ Key.key4 * (pass + Key.key8+ pass + Key.key8+ Key.key9) / Key.key7 ;
        this.setState({
            check : newpass
        })
    }
    else if(password .length>=10 && password.length <=20){
        const pass = password.toString();
        const newpass = pass * Key.key2+ pass + Key.key7+ Key.key2 * (pass + Key.key5+ pass + Key.key8+ Key.key4) / Key.key9 ;
            this.setState({
                check : newpass
        })
    }
}
  submitForm = async () => {
    this.passwordsubmit();
    User.phone = this.state.phone;
    User.password = this.state.password;
    const login = true;
    if(this.state.phone.length <10){
      Alert.alert('Erro','Numero de telefone inválido');
    }
    else{
      await AsyncStorage.setItem('userPhone',this.state.phone);
      firebase.database().ref('users/'+User.phone+'/logged').once('value', snapshot => {
        console.log(snapshot.val());
          if(login === snapshot.val()){
            Alert.alert('Usuário já logado');
          }
          else{
            firebase.database().ref('users/'+User.phone+'/password').once('value', snapshot=>{
              console.log(snapshot.val());
              if(User.password <=0 ){
                Alert.alert('Insira sua senha');
              }else if(snapshot.val() == null){
                Alert.alert('Usuário não cadastrado');
              }
              else if(this.state.check == snapshot.val()){
                var usersRef = firebase.database().ref('users/');
                var hopperRef = usersRef.child(User.phone);
                  hopperRef.update({
                    "status": "online",
                    "logged": true
                  });
                firebase.database().ref('users/' + User.phone);
                this.props.navigation.navigate('App');
              }else{
                Alert.alert('Senha ou Usuários errados');
              }
            });
          }
      })
    } 
  }
  render() {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        enabled={Platform.OS==='ios'}
        style={styles.container2}
      >
        <View>
          <Image source={logo} style={styles.logo} />
          <TextInput
            placeholder="Número de telefone"
            placeholderTextColor='#000'
            style={styles.input}
            keyboardType='phone-pad'
            value={this.state.phone}
            onChangeText={this.handleChange('phone')}
            returnKeyType="next"
          />
          <TextInput
            placeholder="Senha"
            placeholderTextColor='#000'
            secureTextEntry={true}
            style={styles.input}
            value={this.state.password}
            onChangeText={this.handleChange('password')}
          />
          <TouchableOpacity
            style={styles.btn}
            onPress={this.submitForm}
          >
            <Text style={{
              color: '#ecf0f1',
              fontSize: 18,
              fontWeight:'bold',      
            }}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity  onPress={()=> this.props.navigation.navigate("Create")}
            style={styles.btn}
          >
            <Text style={{
              color: '#ecf0f1',
              fontSize: 18,
              fontWeight:'bold',      
            }}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
};
export default Login;