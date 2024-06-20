import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Ensure this path is correct

const HomeScreen = ({ navigation }) => {

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
      <View style={styles.signOutButton}>
        <Button title="Sign Out" onPress={handleSignOut} />
      </View>
      <Button
        title="Calendar"
        onPress={() => navigation.navigate('Calendar')}
      />
      {/* Add more buttons for future features here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  signOutButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default HomeScreen;
