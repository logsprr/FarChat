import React from  'react';
import {View, Text, Modal } from 'react-native';
import MapView, { AnimatedRegion, Marker }  from  'react-native-maps';
import ImageViewer from 'react-native-image-zoom-viewer';

export default  class MapViewScreen extends React.Component{
    static navigationOptions = ({navigation})=> {
        return{
            title: 'Localização',
        }
      }
      state = {
          region : null
      }
    async componentDidMount(){
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
    animate(){
        let r = {
            latitude: 42.5,
            longitude: 15.2,
            latitudeDelta: 7.5,
            longitudeDelta: 7.5,
        };
        this.mapView.root.animateToRegion(r, 2000);
    }
    handleMarkPress = () =>{
        const region = this.state;

        region.AnimatedRegion(region, 2000);

    }
    render(){
        const { region } = this.state; 
        return(
            <MapView
            style={{
                flex: 1,
            }}
            Region={region}
            ref = {(ref)=>this.mapView=ref}
            onMarkerPress={() => this.animate()}
            showsUserLocation
            loadingEnabled
            >

                <Marker
                    title={"Gabriel"}
                    coordinate={{ latitude: region.latitude, longitude: region.longitude }} onPress={this.handleMarkerPress}/>
                
            </MapView>
        )
    }
}