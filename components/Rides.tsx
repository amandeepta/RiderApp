import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Rides: { pickup: string; dropoff: string };
  RideDetails: { rideId: string };
  RiderInfo: { id: string };
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
          setData(response.data.data);
        } else {
          setError(response.data.message);
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
        <ActivityIndicator size="large" color="#6C63FF" />
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
          onPress={() => navigation.navigate('RiderInfo', { id: item._id })}
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
    backgroundColor: '#1E1E2C',
    padding: 20,
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#8F94FB',
    textAlign: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 20,
    textAlign: 'center',
  },
  noRidesText: {
    fontSize: 20,
    color: '#B3B3C5',
    textAlign: 'center',
  },
  headerText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
  },
  rideCard: {
    backgroundColor: '#2B2B3C',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  rideText: {
    fontSize: 18,
    color: '#E0E0F0',
    marginBottom: 8,
  },
});

export default Rides;
