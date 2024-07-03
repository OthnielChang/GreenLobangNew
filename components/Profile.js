import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const Profile = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [email, setEmail] = useState(user ? user.email : '');
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [points, setPoints] = useState(0);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUsername(userData.username || '');
        setPoints(userData.points || 0);
      }
    } catch (error) {
      console.log('Error fetching user data:', error);
    }
  };

  const updateUsername = async () => {
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, { username: newUsername }, { merge: true });
      setUsername(newUsername);
      Alert.alert('Success', 'Username updated successfully!');
    } catch (error) {
      console.log('Error updating username:', error);
      Alert.alert('Error', 'Failed to update username.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.emailText}>Email: {email}</Text>
      <Text style={styles.usernameText}>Username: {username}</Text>
      <Text style={styles.pointsText}>Points: {points}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter new username"
        value={newUsername}
        onChangeText={setNewUsername}
      />
      <TouchableOpacity style={styles.button} onPress={updateUsername}>
        <Text style={styles.buttonText}>Update Username</Text>
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emailText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 20,
  },
  usernameText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 20,
  },
  pointsText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;
