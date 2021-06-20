import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Body, Header, Left, Right, Title } from 'native-base';
import * as React from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1a192a',
  },
});
export const ScreenHeader = ({ title }: { title: string }) => {
  const navigation = useNavigation();

  return (
    <Header style={styles.header}>
      <Left style={{ flex: 1 }}>
        <Ionicons
          name="ios-menu"
          style={{ color: '#1a192a', marginTop: 10, marginLeft: 10 }}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          size={24}
        />
      </Left>
      <Body style={{ flex: 3 }}>
        <Title style={{ color: '#1a192a', fontSize: 20 }}>{title}</Title>
      </Body>
      <Right />
    </Header>
  );
};
