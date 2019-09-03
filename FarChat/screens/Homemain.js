import React from 'react';
import { SafeAreaView,KeyboardAvoidingView, View, Image, FlatList ,AsyncStorage, Text, Alert, TouchableOpacity, TextInput, Platform , ActivityIndicator, StatusBar  } from 'react-native';
import User from '../User';
import usericon from '../src/assets/user.png';
import styles from '../constants/styles';
import firebase from   'firebase';
import Icon2 from 'react-native-vector-icons/Entypo';
import { ListItem, SearchBar } from 'react-native-elements';
import { MapView } from 'react-native-maps';
import Contacts from 'react-native-contacts';

class Homemain extends React.Component{
  static navigationOptions = ({navigation})=> {
    return{
        title: 'Usuários',
    }
  }
  constructor(props) {
    super(props);

    this.state = {
        users:[],
        search: '',
        data:[],
        loading: false,
        text: '',
        profile: '',
        avatar: '',
        last : '',

    };
    this.arrayholder = [];
  }
  componentDidMount(){
    const login = false;
    let dbRef = firebase.database().ref('users');
      this.setState({ loading: true });
      dbRef.on('child_added', (val)=>{
          let person = val.val();
          person.phone = val.key;
          if(person.phone === User.phone) {
              User.name = person.name
          }else{
              this.setState((prevState)=> {
              return  {
                  users : [...prevState.users, person]
              }
          })
          this.setState({
            loading: false,
          })
          this.arrayholder = this.state.users;
          
        }
      })
  }
  _logOut = async () =>{
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%',
        }}
      />
    );
  };
  searchaddContact = (item) =>{
    firebase.database().ref('users/' + User.phone+ '/friends/'+item.phone).once('value', val=>{
      if(val.val()== null || val.val() == undefined){
        
      }
    })
    firebase.database().ref('users/'+User.phone+'/lastindex').once('value', snapshot=>{
      console.log(snapshot.val())
      const lt = snapshot.val();
      if(snapshot.val() == 0){
        firebase.database().ref('users/' + User.phone+ '/friends/' + -1).once('value', snapshot=>{
          if(snapshot.val()==null){
            firebase.database().ref('users/' + User.phone+ '/friends/' + -1).set({ name : item.name, avatar : item.avatar, id: 1, phone : item.phone });
            Alert.alert('Contato adicioanado');
            firebase.database().ref('users/'+User.phone).update({
              lastindex : -1
            })
          }else{
            Alert.alert('Usuario ja adicionado')
          }
        })
      }else if( snapshot.val() == -1){
        const index = -2;
        console.log(index);
        const pindex = 1;
        console.log(pindex);
        firebase.database().ref('users/' + User.phone+ '/friends/' + -2).once('value', snapshot=>{
          if(snapshot.val() == null){
            firebase.database().ref('users/' + User.phone+ '/friends/' + -2).set({ name : item.name, avatar : item.avatar, id: 2, phone : item.phone });
            Alert.alert('Contato adicioanado');
            firebase.database().ref('users/'+User.phone).update({
              lastindex : index
            })
          }else{
            Alert.alert('Usuario ja adicionado')
          }
        })
      }else{
        const index = lt +( -1 ) ;
        console.log(index);
        const pindex = index * (-1);
        console.log(pindex);
        firebase.database().ref('users/' + User.phone+ '/friends/' + lt).once('value', snapshot=>{
          if(snapshot.val() == null){
            firebase.database().ref('users/' + User.phone+ '/friends/' + lt).set({ name : item.name, avatar : item.avatar, id: pindex, phone : item.phone });
            Alert.alert('Contato adicioanado');
            firebase.database().ref('users/'+User.phone).update({
              lastindex : index
            })
          }else{
            Alert.alert('Usuario ja adicionado')
          }
        })
      }  
    })
  }
  searchFilterFunction = text => {
    this.setState({
      value: text,
    });

    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.name.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      users: newData,
    });
  };

  renderHeader = () => {
    return (
      <SearchBar
        placeholder="Pesquisar ..."
        lightTheme
        round
        platform={Platform.OS}
        containerStyle={{backgroundColor: 'white'}}
        onChangeText={text => this.searchFilterFunction(text)}
        autoCorrect={false}
        value={this.state.value}
        autoFocus={false}
      />
    );
  };
  render(){
    if (this.state.loading) {
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
          </View>
        );
      }
      return (
        <View style={{ flex: 1 }} >
        <FlatList
          keyboardShouldPersistTaps="handled"
          data={this.state.users}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={()=> this.searchaddContact(item)}>
              <ListItem
              leftAvatar={{source: { uri : item.avatar}}}
              title={`${item.name}`}
            />
              <Icon2 style={{
                marginLeft: 300,
                marginTop: -45,
                marginBottom: 10,
              }}
              name='add-user' size={25}/>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.name}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
        />
      </View>
      
      );
  }
};

export default Homemain;