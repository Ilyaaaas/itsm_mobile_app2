import { Icon } from 'native-base';
import React from 'react';
import { createStackNavigator, createDrawerNavigator } from 'react-navigation';

import ResultsScreen from '../screens/Analise/ResultsScreen';
import ResultsShow from '../screens/Analise/ResultsShow';
import ContactsScreen from '../screens/ContactsScreen';
import HomeScreen from '../screens/HomeScreen';
import InfoDetails from '../screens/Info/InfoDetails';
import InfoScreen from '../screens/Info/InfoScreen';
import LoginScreen from '../screens/LoginScreen';
import ChooseDoctor from '../screens/Priem/ChooseDoctor';
import DoctorDetail from '../screens/Priem/DoctorDetail';
import ChooseTime from '../screens/Priem/ChooseTime';
import ChooseType from '../screens/Priem/ChooseType';
import PriemScreen from '../screens/Priem/PriemScreen';
import { Registration } from '../screens/Registration/RegistrationForm';

import Doctors from '../screens/Doctors/Doctors';

import MenuCnt from './MenuCnt';

const stackConfig = {
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  },
};

const DoctorListStack = {
  DoctorList_1: {
    screen: Doctors
  }
}

const PriemStack = {
  Priem: {
    screen: PriemScreen,
  },
  ChooseType: {
    screen: ChooseType,
  },
  ChooseDoctor: {
    screen: ChooseDoctor,
  },
  ChooseTime: {
    screen: ChooseTime,
  },
  DoctorDetail: {
    screen: DoctorDetail
  }

};

const ResultsStack = {
  Results: {
    screen: ResultsScreen,
  },
  ResultsShow: {
    screen: ResultsShow,
  },
};

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
      title: `Главная`,
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
  PriemStack: {
    name: 'PriemStack',
    screen: createStackNavigator(PriemStack, {
      initialRouteName: 'Priem',
      ...stackConfig,
    }),
    navigationOptions: () => ({
      title: `Мои записи`,
      drawerIcon: ({ tintColor }) => (
        <Icon name="calendar" style={{ color: tintColor }} />
      ),
    }),
  },
  ResultsStack: {
    name: 'ResultsStack',
    screen: createStackNavigator(ResultsStack, {
      initialRouteName: 'Results',
      ...stackConfig,
    }),
    navigationOptions: () => ({
      title: `Мои анализы`,
      drawerIcon: ({ tintColor }) => (
        <Icon name="medkit" style={{ color: tintColor }} />
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
