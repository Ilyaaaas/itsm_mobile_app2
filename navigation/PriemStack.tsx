import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import ChooseDoctor from '../screens/Priem/ChooseDoctor';
import DoctorDetail from '../screens/Priem/DoctorDetail';
import ChooseTime from '../screens/Priem/ChooseTime';
import ChooseType from '../screens/Priem/ChooseType';
import PriemScreen from '../screens/Priem/PriemScreen';
import PriemFormList from "../screens/Priem/PriemFormList";
import PriemForm from "../screens/Priem/PriemForm";
import PriemChat from "../screens/Priem/PriemChat";
import GradeForm from "../screens/Priem/GradeForm";
import CreateOffer from "../screens/Request/CreateOffer";

const Stack = createStackNavigator();

export const PriemStack = () => {
  return (
    <Stack.Navigator initialRouteName="PriemFormList" headerMode="none">
        <Stack.Screen name="PriemFormList" component={PriemFormList} />
        <Stack.Screen name="DoctorDetail" component={DoctorDetail} />
        <Stack.Screen name="PriemForm" component={PriemForm} />
        <Stack.Screen name="ChooseType" component={ChooseType} />
        <Stack.Screen name="ChooseDoctor" component={ChooseDoctor} />
        <Stack.Screen name="ChooseTime" component={ChooseTime} />
        <Stack.Screen name="PriemChat" component={PriemChat} />
        <Stack.Screen name="GradeForm" component={GradeForm} />
        <Stack.Screen name="CreateOffer" component={CreateOffer} />
    </Stack.Navigator>
  );
};
