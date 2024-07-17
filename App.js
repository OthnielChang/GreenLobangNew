// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import HomeScreen from './components/HomeScreen';
import Calendar from './components/Calendar';
import EventListing from './components/EventListing';
import EventViewing from './components/EventViewing';
import EventDetail from './components/EventDetail';
import AboutUs from './components/AboutUs';
import Profile from './components/Profile';
import MapComponent from './components/MapComponent';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Calendar" component={Calendar} />
        <Stack.Screen name="EventListing" component={EventListing} />
        <Stack.Screen name="EventViewing" component={EventViewing} />
        <Stack.Screen name="EventDetail" component={EventDetail} />
        <Stack.Screen name="AboutUs" component={AboutUs} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="MapComponent" component={MapComponent} />
        {/* Add more screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
