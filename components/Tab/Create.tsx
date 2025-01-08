import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

export default function Create() {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [drop, setDrop] = useState('');

  const handleClick = async () => {
    try {
      await axios.post('https://riderserver.onrender.com/create', {
        name : name,
        source : text,
        destination : drop,
      });
      Alert.alert('Success', 'Ride has been created successfully!');
      setName('');
      setText('');
      setDrop('');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Create Ride</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        multiline={false}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Enter the pickup location"
        value={text}
        onChangeText={setText}
        multiline={false}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Enter the dropoff location"
        value={drop}
        onChangeText={setDrop}
        multiline={false}
      />
      <Button title="Submit" onPress={handleClick} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#374151',
  },
  textInput: {
    height: 50,
    width: '90%',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#ffffff',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
