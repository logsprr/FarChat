import React from  'react';
import {StyleSheet} from 'react-native';


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent:'center',
      alignItems: 'center',
      backgroundColor: '#f1f2f6',
    },
    input: {
      padding: 10,
      borderWidth: 1,
      borderColor: '#ced6e0',
      width: 300,
      marginTop: 10,
      borderRadius: 5,
    },
    input2 :{
        height: 46,
        width: 300,
        alignSelf : 'stretch',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginTop: 20,
        paddingHorizontal: 15,
    },
    logo: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 220,
      height: 300,
      marginLeft:40,
    },
    btn :{
      marginTop: 30,
      justifyContent: 'center',
      alignItems: 'center',
      width: 300,
      height: 50,
      backgroundColor: '#f1c40f',
    },
    searchBar: {
        width:400,

    },
  });

export default styles;