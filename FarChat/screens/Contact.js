import React from 'react'
import {View, Text} from 'react-native';


export default  class Contacts extends React.Component{
    static navigationOptions = ({navigation})=> {
        return{
            title: 'Contato',
            
        }
      }
      constructor(props){
          super(props);
          this.state = {
             // phone : props.navigation.getParam(('phoneNumber').map(phone =>{
             //     {phone}
              //})),
              name: props.navigation.getParam('givenName'),
              phone2: props.navigation.getParam('phoneNumbers'),
              phone3: this.state.phone2[0].number

          }
      }

    componentDidMount(){
        console.log(this.state.phone2);
        console.log(this.state.phone2[0].number);
        console.log(this.state.phone3);
    }
    render(){
        return(
            <View>
                <Text>
                    {this.state.name}
                </Text>
                <Text>
                {this.state.phone}
                </Text>
            </View>
        )
    }
}