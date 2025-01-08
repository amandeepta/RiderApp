import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RiderInfo from './RiderInfo';

import Rides from './Rides';
import Search from './Tab/Search';
import Create from './Tab/Create';


type RootStackParamList = {
  Rides: { pickup: string; dropoff: string };
  RiderInfo: { id: string };
  Main: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

const tabBarIcon = (name: string) => {
  return ({ color, size }: { color: string; size: number }) => (
    <Ionicons name={name} color={color} size={size} />
  );
};

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Search"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#2B2B3C', borderTopColor: '#1E1E2C' },
        tabBarActiveTintColor: '#8F94FB',
        tabBarInactiveTintColor: '#B3B3C5',
      }}
    >
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: tabBarIcon('search'),
        }}
      />
      <Tab.Screen
        name="Create"
        component={Create}
        options={{
          tabBarIcon: tabBarIcon('add-circle'),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <NavigationContainer>
      {showSplash ? (
        <SafeAreaView style={styles.splashContainer}>
          <Text style={styles.splashText}>Rider</Text>
        </SafeAreaView>
      ) : (
        <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Rides"
            component={Rides}
            initialParams={{ pickup: '', dropoff: '' }}
          />
          <Stack.Screen
            name="RiderInfo"
            component={RiderInfo}
            initialParams={{ id: '' }}
          />
          <Stack.Screen name="Main" component={TabNavigator} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E2C',
  },
  splashText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8F94FB',
  },
});
