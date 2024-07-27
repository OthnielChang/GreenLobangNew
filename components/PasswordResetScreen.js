import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, ImageBackground } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const PasswordResetScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handlePasswordReset = async () => {
    if (!email.includes('@') || !email.includes('.com')) {
      Alert.alert('Invalid Email!', 'Ensure correct email is used.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Password Reset', 'A password reset email has been sent to your email address.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Password Reset Failed', error.message);
    }
  };

  return (
    <ImageBackground 
      source={require('../assets/background-3.png')} 
      style={styles.background}
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
        />
        <Button title="Reset Password" onPress={handlePasswordReset} />
        <Button
          title="Back to Login"
          onPress={() => navigation.goBack()}
          color="#841584"
        />
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Adjust the overlay color and opacity
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white', // Background color for the input
  },
});

export default PasswordResetScreen;
