import React from  'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {MapView, Marker}  from  'react-native-maps';
import usericon from '../src/assets/user.png';
export default  class MapUser extends React.Component{
    static navigationOptions = ({navigation})=> {
        return{
            title: 'GEOLOCATION',
        }
      }
      state = {
          region : null,

      }
    async componentDidMount(){
        navigator.geolocation.getCurrentPosition(
            ({ coords: { latitude, longitude}}) =>{
                this.setState({
                    region : {
                        latitude, 
                        longitude, 
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
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
    
    
    render(){
        const { region } = this.state; 
        return(
            <View style={{flex: 1}}>
                <MapView
                style={{
                    flex: 1,
                }}
                initialRegion={region}
                ref = {(mapView) => { _mapView = mapView; }}
                followUserLocation={true}
                userLocationAnnotationTitle={'Gabriel'}
                minZoomLevel={4}
                zoomEnabled={true}
                showsUserLocation={true}
                loadingEnabled={true}
                zoomControlEnabled={true}
                showsMyLocationButton={true}
                setCamera={{
                    camera : region,
                    duration: 4
                }}
                // animateToRegion	={{
                //     region : region,
                //     duration: '2'
                // }}
                />
                <MapView.Marker
                    coordinate={marker.location}
                    image={{uri: usericon}}   
                    width={48}
                    height={48}
                />
            </View>
        );
    }
}