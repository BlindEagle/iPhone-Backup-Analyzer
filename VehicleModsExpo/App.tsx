import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import VehicleListScreen from './src/screens/VehicleListScreen';
import VehicleDetailScreen from './src/screens/VehicleDetailScreen';
import AddVehicleScreen from './src/screens/AddVehicleScreen';
import EditVehicleScreen from './src/screens/EditVehicleScreen';
import AddModificationScreen from './src/screens/AddModificationScreen';
import ModificationDetailScreen from './src/screens/ModificationDetailScreen';
import EditEngineBlueprintScreen from './src/screens/EditEngineBlueprintScreen';
import { colors } from './src/theme';

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.card,
    text: colors.text,
    border: colors.border,
    primary: colors.accent,
  },
};

export default function App() {
  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen
          name="VehicleList"
          component={VehicleListScreen}
          options={{ title: 'My Vehicles' }}
        />
        <Stack.Screen
          name="VehicleDetail"
          component={VehicleDetailScreen}
          options={{ title: 'Vehicle' }}
        />
        <Stack.Screen
          name="AddVehicle"
          component={AddVehicleScreen}
          options={{ title: 'Add Vehicle' }}
        />
        <Stack.Screen
          name="EditVehicle"
          component={EditVehicleScreen}
          options={{ title: 'Edit Vehicle' }}
        />
        <Stack.Screen
          name="AddModification"
          component={AddModificationScreen}
          options={{ title: 'Add Modification' }}
        />
        <Stack.Screen
          name="ModificationDetail"
          component={ModificationDetailScreen}
          options={{ title: 'Modification' }}
        />
        <Stack.Screen
          name="EditEngineBlueprint"
          component={EditEngineBlueprintScreen}
          options={{ title: 'Engine Blueprint' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
