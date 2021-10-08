import { Icon } from 'native-base';
import React from 'react';
import { createStackNavigator, createDrawerNavigator } from 'react-navigation';
// import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import ContactsScreen from '../screens/ContactsScreen';
import HomeScreen from '../screens/HomeScreen';
import InfoDetails from '../screens/Info/InfoDetails';
// import InfoScreen from '../screens/Info/InfoScreen';
import InfoScreen from '../screens/Info/InfoScreenProducts';
import LoginScreen from '../screens/LoginScreen';
import CreateITSMRequest from '../screens/Request/CreateOffer';
import Notifications from '../screens/Notifications';
import { Registration } from '../screens/Registration/RegistrationForm';

import MenuCnt from './MenuCnt';

const stackConfig = {
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  },
};

const CreateITSMRequestStack = {
  CreateITSMRequest: {
    screen: CreateITSMRequest,
  }
}

const InfoStack = {
  InfoScreen: {
    screen: InfoScreen,
  },
  InfoDetails: {
    screen: InfoDetails,
  },
};

const DrawerRoutes = {
  HomeStack: {
    name: 'HomeStack',
    screen: HomeScreen,
    navigationOptions: () => ({
      title: `Заявки`,
      drawerIcon: ({ tintColor }) => (
        <Icon name="home" style={{ color: tintColor }} />
      ),
    }),
  },
  DoctorListStack: {
    name: 'DoctorListStack',
    screen: createStackNavigator(DoctorListStack, {
      initialRouteName: 'DoctorList_1',
      ...stackConfig,
    }),
    navigationOptions: () => ({
      title: `Наши врачи`,
      drawerIcon: ({ tintColor }) => (
        <Icon name="doctor" style={{ color: tintColor }} />
      ),
    }),
  },
  CreateRequest: {
    name: 'CreateRequest',
    screen: createStackNavigator(CreateRequest, {
      initialRouteName: 'CreateRequest',
      ...stackConfig,
    }),
    navigationOptions: () => ({
      title: `Мои записи`,
      drawerIcon: ({ tintColor }) => (
        <Icon name="calendar" style={{ color: tintColor }} />
      ),
    }),
  },

  InfoScreenStack: {
    name: 'InfoScreenStack',
    screen: createStackNavigator(InfoStack, {
      initialRouteName: 'InfoScreen',
      ...stackConfig,
    }),
    navigationOptions: () => ({
      title: `Рекомендации`,
      drawerIcon: ({ tintColor }) => (
        <Icon name="list-box" style={{ color: tintColor }} />
      ),
    }),
  },
  ContactsStack: {
    name: 'ContactsStack',
    screen: ContactsScreen,
    navigationOptions: () => ({
      title: `Контакты`,
      drawerIcon: ({ tintColor }) => (
        <Icon name="call" style={{ color: tintColor }} />
      ),
    }),
  },
};

const drawerNavigator = createDrawerNavigator(DrawerRoutes, {
  contentComponent: MenuCnt,
  contentOptions: {
    activeTintColor: '#046475',
    inactiveTintColor: '#353535',
  },
  ...stackConfig,
});

const MainNavigator = createStackNavigator(
  {
    Registration: {
      screen: Registration,
    },
    Login: {
      screen: LoginScreen,
    },
    drawer: drawerNavigator,
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none',
    navigationOptions: { headerVisible: false },
  }
);

export default MainNavigator;
