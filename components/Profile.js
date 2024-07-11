import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, Platform } from 'react-native';
import { getAuth } from 'firebase/auth';
import { db, storage } from '../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

const Profile = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [email, setEmail] = useState(user ? user.email : '');
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [points, setPoints] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const [imageUri, setImageUri] = useState('');

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
        setProfileImage(userData.profileImage || null);
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

  const requestGalleryPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need gallery permissions to make this work!');
      }
    }
  };

  const handleChoosePhoto = async () => {
    await requestGalleryPermission();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    if (!uri) return null;
    try {
      console.log('Fetching image from URI:', uri);
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log('Image fetched and converted to blob.');

      const storageRef = ref(storage, `profileImages/${user.uid}/${Date.now()}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            console.log('Upload in progress...', snapshot.bytesTransferred, '/', snapshot.totalBytes);
          },
          (error) => {
            console.error('Upload failed:', error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log('Image uploaded successfully. Download URL:', downloadURL);
              resolve(downloadURL);
            } catch (error) {
              console.error('Error getting download URL:', error);
              reject(error);
            }
          },
        );
      });
    } catch (error) {
      console.error('Error during image fetch or upload:', error);
      throw error;
    }
  };

  const handleUploadPhoto = async () => {
    try {
      const imageUrl = await uploadImage(imageUri);
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, { profileImage: imageUrl }, { merge: true });
      setProfileImage(imageUrl);
      Alert.alert('Success', 'Profile image updated successfully!');
    } catch (error) {
      console.log('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image.');
    }
  };

  return (
    <View style={styles.container}>
      {profileImage && (
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
      )}
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.usernameText}>Username: {username}</Text>
      <Text style={styles.emailText}>Email: {email}</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleChoosePhoto}>
        <Text style={styles.buttonText}>Choose Profile Image</Text>
      </TouchableOpacity>
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.previewImage}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={handleUploadPhoto}>
        <Text style={styles.buttonText}>Upload Profile Image</Text>
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
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 70,
    marginBottom: 20,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
});

export default Profile;
