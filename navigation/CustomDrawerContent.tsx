import { FontAwesome } from '@expo/vector-icons';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { DrawerContentComponentProps } from '@react-navigation/drawer/lib/typescript/src/types';
import { StackActions } from '@react-navigation/native';
import React from 'react';


export const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const handleExit = () => {
    props.navigation.dispatch(StackActions.replace('Login'));
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Выход"
        onPress={handleExit}
        icon={(props1) => (
          <FontAwesome
            name="sign-out"
            size={props1.size}
            color={props1.color}
          />
        )}
      />
    </DrawerContentScrollView>
  );
};


