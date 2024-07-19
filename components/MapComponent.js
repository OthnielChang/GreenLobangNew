import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Alert, TextInput, TouchableOpacity, Text, Linking } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.1000; //smaller = more zoom
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO; //initial zoom based on lat

const MapComponent = () => {
  const [region, setRegion] = useState(null);
  const [markers, setMarkers] = useState([]); // initial values
  const [searchTerm, setSearchTerm] = useState(''); // default search term

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission required',
          'Permission to access location was denied. Please enable location permissions in your settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openURL('app-settings:') },
          ]
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({}); //getting current position
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    })();
  }, []);

  const fetchMarkers = async (term) => {
    try {
      console.log('Attempting to fetch markers...');
      const response = await axios.get(
        `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${term}&returnGeom=Y&getAddrDetails=Y&pageNum=1`);
      console.log('Response:', response.data);
      const data = response.data.results || [];
      const newMarkers = data.map((place, index) => ({
        id: `${place.SEARCHVAL}-${index}`, //must make each id unique, else will get key error
        title: place.SEARCHVAL,
        coordinates: {
          latitude: parseFloat(place.LATITUDE),
          longitude: parseFloat(place.LONGITUDE),
        },
      }));
      setMarkers(newMarkers);
    } catch (error) {
      console.error("Error fetching markers: ", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
      } else if (error.request) {
        console.error("Error request data:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    }
  };

  const handleSearch = () => {
    if (region) { // if can find gps pos
      fetchMarkers(searchTerm);
    }
  };

  if (!region) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Enter search term"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={(region) => setRegion(region)}
      >
        <UrlTile
          urlTemplate="https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinates}
            title={marker.title}
          />
        ))}
      </MapView>
      <View style={styles.attributionContainer}>
        <Text style={styles.attributionText}>
          Map data © OneMap contributors | Singapore Land Authority
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height,
    width,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchBarContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    height: 40,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 5,
    zIndex: 1,
  },
  searchBar: {
    flex: 1,
    paddingHorizontal: 10,
  },
  searchButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  attributionContainer: {
    position: 'absolute',
    top: 710, // cant use bottom for some reason
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  attributionText: {
    fontSize: 12,
    color: 'black',
  },
});

export default MapComponent;
