import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import WelcomeScreen from './WelcomeScreen';
import ProfileScreen from './ProfileScreen';
import ApplyScreen from './ApplyScreen';
import LandParcelsScreen from './LandParcelsScreen';
import MyLandScreen from './MyLandScreen';
import GrantStatusScreen from './GrantStatusScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Apply" component={ApplyScreen} />
        <Stack.Screen name="Parcels" component={LandParcelsScreen} />
        <Stack.Screen name="MyLand" component={MyLandScreen} />
        <Stack.Screen name="GrantStatus" component={GrantStatusScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
