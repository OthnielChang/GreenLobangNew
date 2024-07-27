import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground, Modal, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { signOut, getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import axios from 'axios';
import { db } from '../firebaseConfig';
import Sidebar from './Sidebar';

const HomeScreen = ({ navigation }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [weather, setWeather] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    fetchUsername();
    fetchWeather();
  }, []);

  const fetchUsername = async () => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUsername(docSnap.data().username);
      }
    } catch (error) {
      console.log('Error fetching username:', error);
    }
  };

  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=Singapore&appid=7e1a56036c30a90af179522236eacfc4&units=metric`
      );
      setWeather(response.data);
    } catch (error) {
      console.log('Error fetching weather data:', error);
    }
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        Alert.alert('Signed Out', 'You have been signed out successfully.');
        navigation.replace('Login'); // Navigate to the login screen
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <ImageBackground 
      source={require('../assets/background-2.png')} 
      style={styles.background}
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton} onPress={() => setSidebarVisible(true)}>
            <FontAwesome name="bars" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Welcome Back {username} !</Text>
        </View>

        {weather && (
          <View style={styles.weatherContainer}>
            <View style={styles.weatherWidget}>
              <Text style={styles.weatherLocation}>{weather.name}, {weather.sys.country}</Text>
              <Text style={styles.weatherTemp}>{Math.round(weather.main.temp)}°C</Text>
              <Text style={styles.weatherDescription}>{weather.weather[0].description}</Text>
            </View>
          </View>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={sidebarVisible}
          onRequestClose={() => {
            setSidebarVisible(!sidebarVisible);
          }}
        >
          <Sidebar navigation={navigation} closeModal={() => setSidebarVisible(false)} />
        </Modal>

        <View style={styles.buttonsContainer}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Calendar')}
            >
              <Image source={require('../assets/calendar.png')} style={styles.buttonImage} />
              <Text style={styles.buttonText}>Calendar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('EventListing')}
            >
              <Image source={require('../assets/to-do-list.png')} style={styles.buttonImage} />
              <Text style={styles.buttonText}>Event Listing</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('EventViewing')}
            >
              <Image source={require('../assets/file.png')} style={styles.buttonImage} />
              <Text style={styles.buttonText}>Event Viewing</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('MapComponent')}
            >
              <Image source={require('../assets/map.png')} style={styles.buttonImage} />
              <Text style={styles.buttonText}>Map</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Rewards')}
            >
              <Image source={require('../assets/reward.png')} style={styles.buttonImage} />
              <Text style={styles.buttonText}>Rewards</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={handleSignOut}
            >
              <Image source={require('../assets/log-out.png')} style={styles.buttonImage} />
              <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // to adjust transparency
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FAC898',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  menuButton: {
    color: '#000000',
    padding: 10,
  },
  headerTitle: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  weatherContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  weatherWidget: {
    backgroundColor: '#FAC898',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  weatherLocation: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  weatherTemp: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  weatherDescription: {
    fontSize: 18,
    color: '#333',
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  button: { //component buttons
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FAC898',
    padding: 15, //button size
    borderRadius: 10,
    marginHorizontal: 10,
    width: '45%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2
  },
  buttonImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
