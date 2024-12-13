import React, { useState } from 'react';
import { SafeAreaView, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define the navigation parameters type
type RootStackParamList = {
  Rides: { pickup: string; dropoff: string };
};

// Define the navigation prop type
type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Rides'>;

const Search: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [pickup, setPickup] = useState<string>('');
  const [dropoff, setDropoff] = useState<string>('');

  const handleSearch = () => {
    if (!pickup || !dropoff) {
      Alert.alert('Input Error', 'Please enter both pickup and dropoff locations.');
      return;
    }
    console.log('Pickup:', pickup);
    console.log('Dropoff:', dropoff);
    navigation.navigate('Rides', {
      pickup,
      dropoff,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Where are you going?</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter the pickup location"
        value={pickup}
        onChangeText={setPickup}
        multiline={false}
        numberOfLines={1}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Enter the dropoff location"
        value={dropoff}
        onChangeText={setDropoff}
        multiline={false}
        numberOfLines={1}
      />
      <Button title="Search" onPress={handleSearch} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  textInput: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
});

export default Search;