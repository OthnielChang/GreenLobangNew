import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const colors = ['#FFA07A', '#98FB98', '#1E90FF', '#F0E68C', '#D8BFD8', '#AFEEEE'];

const EventListing = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors[0]); // Default color

  const handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      const eventDate = date ? Timestamp.fromDate(date) : null;
      const eventTime = time ? Timestamp.fromDate(time) : null;
      await addDoc(collection(db, 'events'), {
        title,
        description,
        date: eventDate,
        time: eventTime,
        imageUri,
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
