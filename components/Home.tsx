import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RiderInfo from './RiderInfo';
// Import Screens
import Rides from './Rides';
import Search from './Tab/Search';
import Create from './Tab/Create';

// Define navigation parameter types
type RootStackParamList = {
  Rides: { pickup: string; dropoff: string };
  RiderInfo: { id: string }; // Fix RiderInfo parameter type
  Main: undefined;
};

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

// Define tabBarIcon function outside the render method
const tabBarIcon = (name: string) => {
  return ({ color, size }: { color: string; size: number }) => (
    <Ionicons name={name} color={color} size={size} />
  );
};

// Define TabNavigator outside of render method
function TabNavigator() {
  return (
    <Tab.Navigator initialRouteName="Search">
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: tabBarIcon("search"),
        }}
      />
      <Tab.Screen
        name="Create"
        component={Create}
        options={{
          tabBarIcon: tabBarIcon("add-circle"),
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
    }, 5000);

    return () => clearTimeout(timer); // Clean up the timer on unmount
  }, []);

  return (
    <NavigationContainer>
      {showSplash ? (
        <SafeAreaView style={styles.container}>
          <Text style={styles.text}>Rider</Text>
        </SafeAreaView>
      ) : (
        <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Rides"
            component={Rides}
            initialParams={{ pickup: '', dropoff: '' }} // Pass initialParams for Rides
          />
          <Stack.Screen
            name="RiderInfo"
            component={RiderInfo}
            initialParams={{ id: '' }} // Pass initialParams for RiderInfo
          />
          <Stack.Screen name="Main" component={TabNavigator} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
