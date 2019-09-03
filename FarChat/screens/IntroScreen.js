import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {StyleSheet, View,} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-community/async-storage';

const styles = StyleSheet.create({
 
    MainContainer: {
      flex: 1,
      paddingTop: (Platform.OS) === 'ios' ? 20 : 0,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    },
    buttonCircle: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(0, 0, 0, .2)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
      fontSize: 26,
      color: 'black',
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 20,
    },
    text: {
      color: 'black',
      fontSize: 20,
    },
    image: {
      width: 200,
      height: 200,
      resizeMode: 'contain'
    }
}); 
  const slides = [
    {
      key: 'k1',
      title: 'Bem Vindo',
      text: 'FarChat App é o inicio',
      image: require('../src/assets/logointro.gif'),
      titleStyle: styles.title,
      textStyle: styles.text,
      imageStyle: styles.image,
      backgroundColor: 'white',
    },
    {
      key: 'k2',
      title: 'Muito Seguro',
      text: 'Somente você e seu contato tem os dados',
      image: require('../src/assets/logointro2.gif'),
      titleStyle: styles.title,
      textStyle: styles.text,
      imageStyle: styles.image,
      backgroundColor: 'white',
    },
    {
      key: 'k3',
      title: 'Excelência',
      text: 'Somos em tempo real',
      image: require('../src/assets/logointro3.gif'),
      titleStyle: styles.title,
      textStyle: styles.text,
      imageStyle: styles.image,
      backgroundColor: 'white',
    },
  ];
export default class IntroScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            showRealApp: false
        }
    }
    componentDidMount(){
      this.getData();
    }
    getData = async () => {
      const status = await AsyncStorage.getItem('status');
      console.log(status);
      if(status === null || status === undefined){
        this.setState({
          showRealApp : false,
        })
      }else{
        this.setState({
          showRealApp : true,
        })
      }
      console.log(this.state.showRealApp);
    }
    storeData = async () => {
      const status = await AsyncStorage.setItem('status', 'true');
      console.log(status);
    }
    _onDone = () => {
      this.storeData();
      this.props.navigation.navigate('AuthLoading');
    }
    _renderNextButton = () => {
      return (
        <View style={styles.buttonCircle}>
          <Icon
            name="md-arrow-round-forward"
            color="rgba(255, 255, 255, .9)"
            size={24}
            style={{ backgroundColor: 'transparent' }}
          />
        </View>
      );
    };
    _renderDoneButton = () => {
      return (
        <View style={styles.buttonCircle}>
          <Icon
            name="md-checkmark"
            color="rgba(255, 255, 255, .9)"
            size={24}
            style={{ backgroundColor: 'transparent' }}
          />
        </View>
      );
    };
  render() {
    if (this.state.showRealApp) {
      return this.props.navigation.navigate('AuthLoading');
    } else {
      return <AppIntroSlider  slides={slides} renderDoneButton={this._renderDoneButton} activeDotStyle={{backgroundColor: 'rgba(189, 195, 199,1.0)'}} dotStyle={{backgroundColor: 'rgba(241, 196, 15,1.0)'}}
      renderNextButton={this._renderNextButton} onDone={this._onDone}/>;
    }
  }
}