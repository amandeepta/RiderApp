import React, { useState } from 'react';
import { SafeAreaView, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Rides: { pickup: string; dropoff: string };
};

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
        placeholderTextColor="#888"
        autoCorrect={false}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Enter the dropoff location"
        value={dropoff}
        onChangeText={setDropoff}
        placeholderTextColor="#888"
        autoCorrect={false}
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#1E1E2C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
    color: '#fff',
  },
  textInput: {
    height: 55,
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#444',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 18,
    color: '#fff',
    backgroundColor: '#282828',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  button: {
    backgroundColor: '#00BFFF',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});

export default Search;
