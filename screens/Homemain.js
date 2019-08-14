import React from 'react';
import { SafeAreaView,KeyboardAvoidingView, View, Image, FlatList ,AsyncStorage, Text, Alert, TouchableOpacity, TextInput, Platform , ActivityIndicator, StatusBar  } from 'react-native';
import User from '../User';
import styles from '../constants/styles';
import firebase from   'firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ListItem, SearchBar } from 'react-native-elements';
import BackgroundTask from 'react-native-background-task';
import { MapView } from 'react-native-maps';
BackgroundTask.define(() => {
  console.log('EStou no back')
    var usersRef = firebase.database().ref('users/');
    var hopperRef = usersRef.child(User.phone);
    hopperRef.update({
      "status": "offline"
    });
  BackgroundTask.finish()
})
class Homemain extends React.Component{
  static navigationOptions = ({navigation})=> {
    return{
        title: 'Conversas',
        headerRight: (
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}
                
                style={{
                paddingRight: 12,
            }}>
                <Icon name='edit' size={25} />
            </TouchableOpacity>
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

    };
    this.arrayholder = [];
  }
  componentDidMount(){
    const login = false;
    var usersRef = firebase.database().ref('users/');
    var hopperRef = usersRef.child(User.phone);
    hopperRef.update({
      "status": "online"
    });
    BackgroundTask.schedule()
    firebase.database().ref('users/'+User.phone+'/logged').once('value', snapshot => {
      if(login === snapshot.val()){
        Alert.alert("Usuário não logado");
        this.props.navigation.navigate('Login');
      }
    })
    
  }
 
  componentWillMount(){
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
            <TouchableOpacity onPress={()=> this.props.navigation.navigate('Chat', item)}>
            <ListItem
              leftAvatar={{ source: { uri: item.avatar } }}
              title={`${item.name}`}
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

export default Homemain;