// App.tsx
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screen Imports
import HomeScreen from './src/screens/HomeScreen';
import AddItemScreen from './src/screens/AddItemScreen';
import FilterScreen from './src/screens/FilterScreen';
// Type Import
import type { RootStackParamList } from './src/navigation/types.ts';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#8800C7' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: "BigOne Kitchen" }} 
        />
        <Stack.Screen 
          name="AddItem" 
          component={AddItemScreen} 
          options={{ title: 'Add New Item' }} 
        />
        <Stack.Screen 
          name="Filter" 
          component={FilterScreen} 
          options={{ title: 'Filter Menu' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}