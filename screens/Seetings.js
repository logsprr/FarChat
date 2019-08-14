import React from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet, Switch} from 'react-native';
import styles from '../constants/styles';
import { bold } from 'ansi-colors';
export default class Seetings extends React.Component{
    static navigationOptions = ({navigation})=> {
        return{
            title: 'Configurações',
        }
    }

    constructor(props){
        super(props);
        this.state = {
            data: [
                { id: 0, full_name: 'Localização' },
                { id: 1, full_name: 'Online/Offline' },
                { id: 2, full_name: 'Foto' },
                { id: 3, full_name: 'Background' },
                { id: 4, full_name: 'Excluir conta' },
                { id: 5, full_name: 'Ver localização'}
              ],
        }
    }
    renderItem = ({ item }) => (
        <View style={styles2.listItem}>
          <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#7f8c8d',
          }}>{item.full_name}</Text>
          <Switch style={{
              alignSelf:'flex-end',
              marginLeft: 140,
              marginTop: -20,
          }}
            />
        </View>
    );
    render(){
        return(
            <FlatList
                style={{ marginTop: 5 }}
                contentContainerStyle={styles2.list}
                data={this.state.data}
                renderItem={this.renderItem}
                keyExtractor={item => item.id}
            />



        )
    }
}

const styles2 = StyleSheet.create({
    list: {
      paddingHorizontal: 10,
    },
  
    listItem: {
      backgroundColor: '#EEE',
      height: 80,
      marginTop: 10,
      padding: 30,
      flexDirection: 'column',
    },
  });