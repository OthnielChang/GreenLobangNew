import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert, TouchableOpacity, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth, storage } from '../firebaseConfig'; // Ensure storage is correctly imported
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const colors = ['#FFA07A', '#98FB98', '#1E90FF', '#FFFF00', '#D8BFD8', '#AFEEEE'];

const EventListing = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors[0]); // Default color
  const [imageChosen, setImageChosen] = useState(false); // New state to track image selection

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
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // Updated to correctly set the image URI
      setImageChosen(true); // Update state to indicate image was chosen
    }
  };

  const uploadImage = async (uri) => {
    if (!uri) {
      console.log('No URI provided for the image.');
      return null;
    }
  
    try {
      console.log('Fetching image from URI:', uri);
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log('Image fetched and converted to blob.');
  
      const storageRef = ref(storage, `images/${auth.currentUser.uid}/${Date.now()}`);
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

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      const eventDate = date ? Timestamp.fromDate(date) : null;
      const eventTime = time ? Timestamp.fromDate(time) : null;
      const imageUrl = await uploadImage(imageUri);

      await addDoc(collection(db, 'events'), {
        title,
        description,
        date: eventDate,
        time: eventTime,
        imageUrl,
        color: selectedColor, // Store the selected color
        userId: user.uid,
      });
      Alert.alert('Event Submitted', 'Your event has been submitted successfully!');
      setTitle('');
      setDescription('');
      setDate(null);
      setTime(null);
      setImageUri(null);
      setSelectedColor(colors[0]); // Reset color
      setImageChosen(false); // Reset image chosen state
    } catch (error) {
      Alert.alert('Error', 'There was an error submitting your event.');
      console.error("Error adding document: ", error);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirmTime = (selectedTime) => {
    setTime(selectedTime);
    hideTimePicker();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Event Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter event title"
      />

      <Text style={styles.label}>Event Description</Text>
      <TextInput
        style={styles.descriptionContainer}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter event description"
        multiline
      />
      
      <Text style={styles.label}>Event Date</Text>
      <TouchableOpacity onPress={showDatePicker} style={styles.input}>
        <Text>{date ? moment(date).format('YYYY-MM-DD') : 'Select event date'}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
      />

      <Text style={styles.label}>Event Time</Text>
      <TouchableOpacity onPress={showTimePicker} style={styles.input}>
        <Text>{time ? moment(time).format('HH:mm') : 'Select event time'}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmTime}
        onCancel={hideTimePicker}
      />

      <Text style={styles.label}>Select Event Color</Text>
      <View style={styles.colorsContainer}>
        {colors.map(color => (
          <TouchableOpacity
            key={color}
            style={[styles.colorButton, { backgroundColor: color }, selectedColor === color && styles.selectedColorButton]}
            onPress={() => setSelectedColor(color)}
          />
        ))}
      </View>
      <Button title="Choose Photo" onPress={handleChoosePhoto} />
      {imageChosen && <Text>Image chosen</Text>}
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
        />
      )}

      <Button title="Submit Event" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  descriptionContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 40,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  colorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  selectedColorButton: {
    borderWidth: 3,
    borderColor: '#000',
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 20,
    marginBottom: 20,
  },
});

export default EventListing;
