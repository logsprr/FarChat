import React from  'react';
import {View, Text} from 'react-native';
import MapView, { AnimatedRegion } from 'react-native-maps';

export default  class MapUser extends React.Component{
    static navigationOptions = ({navigation})=> {
        return{
            title: 'Localização',
        }
      }
      state = {
          region : null,
          mapRegion: 0,
          lastLat: 0,
          lastLng: 0,
          initialRegion: 0,

      }
    componentDidMount(){
        this.getCurrentPosition();
    }
    getCurrentPosition = async ()  =>{
         navigator.geolocation.getCurrentPosition(
            ({ coords: { latitude, longitude}}) =>{
                this.setState({
                    initialRegion : {
                        latitude, 
                        longitude, 
                        latitudeDelta: 0.0143, 
                        longitudeDelta: 0.0134
                    }
                })
            },
            () => {},
            {
                timeout: 2000,
                enableHighAccuracy: true,
                maximumAge: 1000,

            }
        )
    }
    goToInitialLocation = async () => {
        let initialRegion = Object.assign({}, this.state.initialRegion);
        initialRegion["latitudeDelta"] = 0.005;
        initialRegion["longitudeDelta"] = 0.005;
        this.mapView.animateToRegion(initialRegion, 2000);
    }
    render(){
        return(
            <MapView
            style={{
                flex: 1,
            }}
            region={this.state.mapRegion}
            followUserLocation={true}
            ref={ref => (this.mapView = ref)}
            zoomEnabled={true}
            showsUserLocation={true}
            onMapReady={this.goToInitialRegion}
            initialRegion={this.state.initialRegion}></MapView>

        )
    }
}