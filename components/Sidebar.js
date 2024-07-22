// Sidebar.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Ensure this path is correct

const Sidebar = ({ navigation, closeModal }) => {

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        Alert.alert('Signed Out', 'You have been signed out successfully.');
        navigation.replace('Login'); // Navigate to the login screen
        closeModal(); // Close the sidebar menu
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View style={styles.sidebarContainer}>
      <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarButton} onPress={() => { navigation.navigate('Profile'); closeModal(); }}>
        <Text style={styles.sidebarButtonText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarButton} onPress={() => { navigation.navigate('AboutUs'); closeModal(); }}>
        <Text style={styles.sidebarButtonText}>About Us</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarButton} onPress={() => { navigation.navigate('RedeemedRewards'); closeModal(); }}>
        <Text style={styles.sidebarButtonText}>Redeemed Rewards</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarButton} onPress={handleSignOut}>
        <Text style={styles.sidebarButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebarContainer: {
    flex: 1,
    backgroundColor: '#FFDAB9',
    padding: 10,
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  closeButtonText: {
    fontSize: 30,
    color: '#000',
  },
  sidebarButton: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 10,
  },
  sidebarButtonText: {
    fontSize: 24,
    color: '#000000',
  },
});

export default Sidebar;
