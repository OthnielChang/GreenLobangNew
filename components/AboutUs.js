// AboutUs.js
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';

const AboutUs = () => {
  return (
    <ImageBackground 
      source={require('../assets/background-2.png')} 
      style={styles.background}
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Image 
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>About Us</Text>
        <Text style={styles.content}>
        We want to create a one-stop platform sharing sustainability practices or events in NUS. This platform will be a hub for students, faculty and staff to engage, collaborate and contribute to sustainability initiatives. 
        By implementing a reward system, we aim to incentivise and recognise sustainable behaviours, thereby upholding and promoting a culture of sustainability across NUS. {"\n"}{"\n"}
        Another side aim is the potential to bolster participation in sustainable events within the NUS community. With a point system, collaborating with various platforms and companies allows us to reward students for taking part in these sustainability events. 
        As students strive to accrue points to earn attractive rewards, we hope to ensure a consistent influx of eager participants.{"\n"}{"\n"}
        GreenLobang is proudly created by Othniel Chang and Sean Wong
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
  logo: {
    width: 400,
    height: 150,
    resizeMode: 'contain', 
    alignSelf: 'center', 
    marginBottom: 10, 
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
    textAlign: 'justify',
  },
});

export default AboutUs;
