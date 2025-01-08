import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Button } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import axios from 'axios';
import { WebView } from 'react-native-webview';

type RootStackParamList = {
  RiderInfo: { id: string };
};

type RiderInfoRouteProp = RouteProp<RootStackParamList, 'RiderInfo'>;

interface RiderInfoProps {
  route: RiderInfoRouteProp;
}

const RiderInfo: React.FC<RiderInfoProps> = ({ route }) => {
  const { id } = route.params;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sourceCoords, setSourceCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const getCoordinates = async (address: string) => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: address,
          format: 'json',
          limit: 1,
        },
      });

      const result = response.data[0];
      if (result) {
        return {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
        };
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('https://riderserver.onrender.com/info', { id: id });
        const userData = response.data.data;
        setUser(userData);

        const sourceCoordinates = await getCoordinates(userData.source);
        const destinationCoordinates = await getCoordinates(userData.destination);

        if (sourceCoordinates) {
          setSourceCoords(sourceCoordinates);
        } else {
          setError('Unable to retrieve source coordinates.');
        }

        if (destinationCoordinates) {
          setDestinationCoords(destinationCoordinates);
        } else {
          setError('Unable to retrieve destination coordinates.');
        }
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FFB74D" />
        <Text style={styles.loadingText}>Fetching Rider Information...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const openStreetMapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Map</title>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
      />
      <script
        src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
      ></script>
    </head>
    <body style="margin: 0; padding: 0; background-color: #2B2B2B;">
      <div id="map" style="width: 100%; height: 100vh"></div>
      <script>
        var map = L.map('map');

        var bounds = L.latLngBounds([
          [${sourceCoords?.latitude || 0}, ${sourceCoords?.longitude || 0}],
          [${destinationCoords?.latitude || 0}, ${destinationCoords?.longitude || 0}]
        ]);

        map.fitBounds(bounds);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        var sourceMarker = L.marker([${sourceCoords?.latitude || 0}, ${sourceCoords?.longitude || 0}]).addTo(map);
        sourceMarker.bindPopup("<b>Source:</b> ${user?.source}").openPopup();

        var destinationMarker = L.marker([${destinationCoords?.latitude || 0}, ${destinationCoords?.longitude || 0}]).addTo(map);
        destinationMarker.bindPopup("<b>Destination:</b> ${user?.destination}");

        var polyline = L.polyline([
          [${sourceCoords?.latitude || 0}, ${sourceCoords?.longitude || 0}],
          [${destinationCoords?.latitude || 0}, ${destinationCoords?.longitude || 0}]
        ], { color: 'blue' }).addTo(map);
      </script>
    </body>
    </html>
  `;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.details}>
        <Text style={styles.title}>Rider Information</Text>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{user.name}</Text>
        <Text style={styles.label}>Start:</Text>
        <Text style={styles.value}>{user.source}</Text>
        <Text style={styles.label}>Destination:</Text>
        <Text style={styles.value}>{user.destination}</Text>
        <Button title="Contact Rider Phone" onPress={() => alert(`Contacting ${user.phone}`)} />
      </View>
      {sourceCoords && destinationCoords ? (
        <WebView
          originWhitelist={['*']}
          source={{ html: openStreetMapHtml }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          style={styles.map}
        />
      ) : (
        <Text style={styles.errorText}>Unable to load map. Please check coordinates.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#1E1E2C',
  },
  details: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#2B2B3C',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F5F5F7',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    color: '#B3B3C5',
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
    color: '#E0E0F0',
  },
  map: {
    width: '100%',
    height: 300,
    marginTop: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E2C',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FEFFD2',
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
  },
});

export default RiderInfo;
