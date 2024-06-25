// AboutUs.js
import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

const AboutUs = () => {
  return (
    <ImageBackground 
      source={require('../assets/background-2.png')} 
      style={styles.background}
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>About Us</Text>
        <Text style={styles.content}>
        In the heart of Singapore lies the vibrant National University of Singapore (NUS), a melting pot of diverse cultures, cutting-edge research, and progressive ideas. Among the bustling activities and academic pursuits, a green wave is rising—a collective call for sustainability and environmental stewardship. Amidst this growing awareness, we envision an innovative solution: NUS GreenLobang, an app dedicated to fostering a sustainable campus community.
        </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

export default AboutUs;
