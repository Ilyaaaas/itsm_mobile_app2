import { Container, Text } from 'native-base';
import * as React from 'react';
import {ImageBackground, Platform, StyleSheet, View, Linking,} from 'react-native';

const isIos = Platform.OS === 'ios';

export const authScreenStyles = StyleSheet.create({
  image: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 16,
    marginTop: 96,
    ...(isIos && { borderBottomWidth: 0 }),
  },
  textPhone: {
    textAlign: 'center',
    fontSize: 14,
    color: '#c7c7c7',
  },
});

export const AuthScreenWrapper = ({
  children,
}: React.PropsWithChildren<object>) => {
  return (
    <Container>
      <ImageBackground
        source={require('../assets/design/home/back.png')}
        style={authScreenStyles.image}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-around',
            paddingHorizontal: 20,
          }}>
          <View></View>
          <View
            style={{
              marginTop: 80,
            }}>
            {children}
          </View>
          <View>
            <Text
              style={authScreenStyles.textPhone}
              onPress={() => {
                Linking.openURL('tel:87172708090');
              }}>
              Телефон технической поддержки:{'\n'}8-(777)-777-77-77
            </Text>
            <Text
              style={authScreenStyles.textPhone}
              onPress={() => {
                Linking.openURL('mailto:support@smart24.kz');
              }}>
              {'\n'}
              support@smart24.kz
            </Text>
          </View>
        </View>
      </ImageBackground>
    </Container>
  );
};
