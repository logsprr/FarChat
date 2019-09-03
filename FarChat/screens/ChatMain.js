import React from 'react';
import { SafeAreaView,KeyboardAvoidingView, View, Image, FlatList ,AsyncStorage, Text, Alert, TouchableOpacity, TextInput, Platform , ActivityIndicator, StatusBar  } from 'react-native';
import User from '../User';
import styles from '../constants/styles';
import firebase from   'firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ListItem, SearchBar } from 'react-native-elements';
import { MapView } from 'react-native-maps';
import Contacts from 'react-native-contacts';
export default class ChatMain extends React.Component{
  static navigationOptions = ({navigation})=> {
    return{
        title: 'Conversas',
        headerRight: (
            <View  style={{
                flexDirection: 'row'
            }}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}
                
                style={{
                paddingRight: 12,
                marginTop: -3,
            }}>
                <Icon name='user-plus' size={25} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Profile')}
                
                style={{
                paddingRight: 12,
            }}>
                <Icon name='edit' size={25} />
            </TouchableOpacity>
            </View>
        )
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
        region: null,
        contacts: null,
        verification: false,
        id: null

    };
    this.arrayholder = [];
  }
  componentDidMount(){
    firebase.database().ref('users/'+User.phone+'/permission').once('value', snapshot=>{
      console.log(snapshot.val());
      if(snapshot.val() == true){
        console.log("uhu");
      }else{
        this.props.navigation.navigate('Check');
      }
    })
    const login = false;
    var usersRef = firebase.database().ref('users/');
    var hopperRef = usersRef.child(User.phone);
    hopperRef.update({
      "status": "online"
    });
    firebase.database().ref('users/'+User.phone+'/logged').once('value', snapshot => {
      if(login === snapshot.val()){
        Alert.alert("Usuário não logado");
        this.props.navigation.navigate('Login');
      }
    })
    this.getContact();
  }

  getContact = async () =>{
    let dbRef = firebase.database().ref('users/'+User.phone+'/friends');
    this.setState({ loading: true });
    dbRef.on('child_added', (val)=>{
      this.addContact(val);
    })
    dbRef.on('child_changed', (val)=>{
      console.log(val.val());
      this.updateContact(val);
    })
    
  }


  removeContact = async (val) =>{

  }

  addContact = async (val) =>{
    let person = val.val();
    console.log('Personn',person);
    if(person.phone === User.phone) {
      User.name = person.name
      console.log('User',User.name)
    }else{
      this.setState((prevState)=> {
      return  {
        users : [...prevState.users, person ]
      }
    })
    console.log('State user',this.state.users)
    this.setState({
      loading: false,
    })
    this.arrayholder = this.state.users;
    }
  }

  updateContact = async (val) =>{
    let person = val.val();
    console.log('Personn',person);
    firebase.database().ref('users/'+User.phone+'/friends/'+val.key+'/id').once('value', snapshot=>{
      console.log(snapshot.val());
      const id_ = snapshot.val();
      this.setState({
        id : id_
      })
    })
    console.log(person.phone);
    if(person.phone === User.phone) {
      User.name = person.name
      console.log('User',User.name)
    }else{
      const data = this.state.users;
      const id_ = this.state.id;
      if(id_ == person.id){
        data.splice(id_, 1);
        data.splice(id_, 0, person);
      }else{
        data.splice(person.id,1);
        data.splice(person.id, 0, person);
        console.log(data);
      }
      console.log(data); 

      this.setState((prevState)=> {
        return  {
          users : [...data]
        }
      })
      console.log('State user',this.state.users)
      this.setState({
      loading: false,
    })
    this.arrayholder = this.state.users;
    }
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
          data={this.state.users.sort((a, b) => a.id  - b.id)}
          onS
          renderItem={({ item }) => (
            <TouchableOpacity onPress={()=> this.props.navigation.navigate('Chat', item)}>
            <ListItem
              leftAvatar={{ source: { uri: item.avatar } }}
              title={`${item.name}`}
              subtitle={item.status}
              badge={{ value: item.badge  , textStyle: { color: item.badge == 0 ? 'white' : '#2c3e50' }, badgeStyle: { width: 20, height: 20, backgroundColor: item.badge == null || item.badge == 0 ? 'white' : '#7f8c8d' }}}
            />
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
