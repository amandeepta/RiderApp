import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Rides: { pickup: string; dropoff: string };
  RideDetails: { rideId: string };
  RiderInfo: { id: string }; // Add RiderInfo screen with 'id' parameter
};
type RidesProps = NativeStackScreenProps<RootStackParamList, 'Rides'>;

const Rides: React.FC<RidesProps> = ({ route, navigation }) => {
  const { pickup, dropoff } = route.params;
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('https://riderserver.onrender.com/search', {
          source: pickup,
          destination: dropoff,
        });

        if (response.data.success) {
          setData(response.data.data); // The data is inside response.data.data
        } else {
          setError(response.data.message); // If no rides are found or other message
        }
      } catch (error: any) {
        setError(error.response?.data?.message || error.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pickup, dropoff]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4caf50" />
        <Text style={styles.loadingText}>Searching for rides...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noRidesText}>No rides found for the selected route.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Available Rides</Text>
      {data.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.rideCard}
          onPress={() => navigation.navigate('RiderInfo', { id: item._id })} // Navigate to RiderInfo with id
        >
          <Text style={styles.rideText}>Driver: {item.name}</Text>
          <Text style={styles.rideText}>From: {item.source}</Text>
          <Text style={styles.rideText}>To: {item.destination}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
  noRidesText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  rideCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rideText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
  },
});

export default Rides;
