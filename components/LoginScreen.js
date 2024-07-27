import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum eight characters, at least one letter and one number

  const handleLogin = async () => {
    if (!email.includes('@') || !email.includes('.com')) {
      Alert.alert('Invalid Email!', 'Ensure correct email is used. If new user, please register below.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Login Successful!', 'You are logged in.');
      navigation.replace('Home');
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        Alert.alert('Login Failed!', 'Ensure correct email and password is used. If new user, please register below. Registered? Press Forget Password to reset!');
      } else if (error.code === 'auth/too-many-requests') {
        Alert.alert('Login Failed!', 'Account has been temporarily locked due to multiple failed attempts. Try again later!');
      } else {
        Alert.alert('Login Failed!', error.message);
      }
    }
  };

  return (
    <ImageBackground 
      source={require('../assets/background-3.png')} 
      style={styles.background}
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Image 
          source={require('../assets/logo.png')} // Replace with your logo path
          style={styles.logo}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Icon 
              name={passwordVisible ? 'eye' : 'eye-slash'} 
              size={20} 
              color="#333" 
            />
          </TouchableOpacity>
        </View>
        <Button title="Login" onPress={handleLogin} />
        <Button
          title="Don't have an account? Register"
          onPress={() => navigation.navigate('Register')}
          color="#841584"
        />
        <Button
          title="Forgot Password?"
          onPress={() => navigation.navigate('PasswordReset')}
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
  logo: {
    width: 300,
    height: 150,
    resizeMode: 'contain', 
    alignSelf: 'center', 
    marginBottom: 10, 
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white', // Background color for the input
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: 'white', // Background color for the password container
  },
  passwordInput: {
    flex: 1,
    height: 40,
  },
  eyeButton: {
    padding: 10,
  },
});

export default LoginScreen;
