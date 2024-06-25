import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Login Successful!', 'You are logged in.');
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Login Failed!', error.message);
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
