import React, {useState} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'; // Correct import for SafeAreaView
import { Text, StyleSheet,TextInput } from 'react-native'; // Correct import for StyleSheet

export default function Create() {
  const [text, setText] = useState('');
  const [drop, setDrop] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Create Screen</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter the pickup location"
        value={text}
        onChangeText={setText}
        multiline={false}
        numberOfLines={1}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Enter the dropoff location"
        value={drop}
        onChangeText={setDrop}
        multiline={false}
        numberOfLines={1}
      />
    </SafeAreaView>
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
