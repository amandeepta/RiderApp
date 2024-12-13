import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';

type RootStackParamList = {
  RiderInfo: { id: string }; // Ensure the id is passed as a string
};

type RiderInfoRouteProp = RouteProp<RootStackParamList, 'RiderInfo'>;

interface RiderInfoProps {
  route: RiderInfoRouteProp;
}

const RiderInfo: React.FC<RiderInfoProps> = ({ route }) => {
  const { id } = route.params;
  // State to store user data, coordinates, and loading state
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sourceCoords, setSourceCoords] = useState<{ latitude: number, longitude: number } | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<{ latitude: number, longitude: number } | null>(null);

  // Function to fetch coordinates from Nominatim API
  const getCoordinates = async (address: string) => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: address,
          format: 'json',
          limit: 1,// Limit to 1 result for simplicity
        },
      });

      const result = response.data[0]; // First result from Nominatim
      if (result) {
        return {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
        };
      } else {
        setError('Could not find coordinates for the address');
        return null;
      }
    } catch (err) {
      setError('Failed to fetch coordinates');
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://riderserver.onrender.com/info', { params: { id } });
        setUser(response.data);

        // Fetch coordinates for source and destination
        const sourceCoordinates = await getCoordinates(response.data.source);
        const destinationCoordinates = await getCoordinates(response.data.destination);

        setSourceCoords(sourceCoordinates);
        setDestinationCoords(destinationCoordinates);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Hi, Rider {id}</Text>
      {user ? (
        <View style={styles.details}>
          <Text>Name: {user.name}</Text>
          <Text>Begin: {user.source}</Text>
          <Text>Destination: {user.destination}</Text>

          {/* Display map if we have coordinates */}
          {sourceCoords && destinationCoords ? (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: (sourceCoords.latitude + destinationCoords.latitude) / 2,
                longitude: (sourceCoords.longitude + destinationCoords.longitude) / 2,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
            >
              <Marker coordinate={sourceCoords} title="Source" />
              <Marker coordinate={destinationCoords} title="Destination" />
            </MapView>
          ) : (
            <Text>Unable to load map</Text>
          )}
        </View>
      ) : (
        <Text>No user data found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  details: {
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: 300,
    marginTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RiderInfo;
