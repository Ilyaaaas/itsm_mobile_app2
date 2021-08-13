import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Button,
    TouchableHighlight
} from 'react-native';
import HomeScreen from "../HomeScreen";

// import PushNotification from 'react-native-push-notification';

class PushNotificationTest extends React.Component {
    // scheduleNotfication() {
    //     PushNotification.localNotificationSchedule({
    //         message: "My Notification Message", // message
    //         date: new Date(Date.now() + (60 * 1000)) // your required time
    //     });
    // }

    render() {
        return (
            <View>
                {/*<TouchableHighlight onPress ={this.scheduleNotfication.bind(this) } >*/}
                {/*    <Text style={{marginTop: 200, marginLeft: 200}}>show</Text>*/}
                {/*</TouchableHighlight>*/}
            </View>
        );
    }
}

export default PushNotificationTest;
