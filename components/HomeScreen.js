import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground, Modal, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { signOut, getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Sidebar from './Sidebar'; // Import your custom Sidebar component

const HomeScreen = ({ navigation }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [username, setUsername] = useState('');
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    fetchUsername();
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
              <Image source={require('../assets/event-listing.png')} style={styles.buttonImage} />
              <Text style={styles.buttonText}>Event Listing</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('EventViewing')}
            >
              <Image source={require('../assets/event-viewing.png')} style={styles.buttonImage} />
              <Text style={styles.buttonText}>Event Viewing</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={handleSignOut}
            >
              <Image source={require('../assets/logout.png')} style={styles.buttonImage} />
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
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    width: '45%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
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
