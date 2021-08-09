import { ListItem, Left, Icon, Body } from 'native-base';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
  AsyncStorage,
} from 'react-native';
import {
  createStackNavigator,
  createDrawerNavigator,
  DrawerItems,
} from 'react-navigation';

import { isNotUndefined } from '../screens/helpers';

export default function MenuCnt(props) {
  const [data, setData] = useState({});

  useEffect(() => {
    AsyncStorage.getItem('user_data').then((value) => {
      if (value) {
        const obj = JSON.parse(value);
        setData(obj);
      }
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E1E3E2' }}>
      <View
        style={{
          marginVertical: 25,
          paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
        }}>
        <Text
          style={{
            textAlignVertical: 'center',
            textAlign: 'center',
            fontSize: 20,
          }}>
          {isNotUndefined(data.fname) + ' ' + isNotUndefined(data.sname)}
        </Text>
      </View>
      <ScrollView style={{}}>
        <DrawerItems {...props} />
        <View style={{ marginVertical: 2 }}>
          <ListItem icon onPress={() => props.navigation.navigate('Login')}>
            <Left>
              <Icon name="exit" style={{ color: '#353535' }} />
            </Left>
            <Body>
              <Text
                style={{
                  paddingLeft: 12,
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#353535',
                }}>
                Выход
              </Text>
            </Body>
          </ListItem>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

