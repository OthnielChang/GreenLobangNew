import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import Sidebar from './Sidebar';

const HomeScreen = ({ navigation }) => {
    const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful
        Alert.alert('Signed Out', 'You have been signed out successfully.');
        navigation.replace('Login'); // Navigate to the login screen
      })
      .catch((error) => {
        // An error happened
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuButton} onPress={() => setSidebarVisible(true)}>
        <Text style={styles.menuButtonText}>☰</Text>
      </TouchableOpacity>
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
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Calendar')}
      >
        <Text style={styles.buttonText}>Calendar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('EventListing')}
      >
        <Text style={styles.buttonText}>Event Listing</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('EventViewing')}
      >
        <Text style={styles.buttonText}>Event Viewing</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    menuButton: {
      position: 'absolute',
      top: 20,
      left: 10,
    },
    menuButtonText: {
      fontSize: 24,
      color: '#000',
    },
    button: {
      backgroundColor: '#FF7518', // Customize your button color
      padding: 15,
      borderRadius: 10,
      marginVertical: 10,
      alignItems: 'center',
      width: '80%',
    },
    signOutButton: {
      backgroundColor: '#B00020', // Customize your sign out button color
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFFFFF', // Customize your text color
      fontSize: 16,
      fontWeight: 'bold',
    },
    title: {
      fontSize: 20,
      marginBottom: 20,
    },
  });

export default HomeScreen;
