import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const EventListing = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

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
        await addDoc(collection(db, 'events'), {
          title,
          description,
          date,
          time,
          imageUri,
        });
        Alert.alert('Event Submitted', 'Your event has been submitted successfully!');
        setTitle('');
        setDescription('');
        setDate('');
        setTime('');
        setImageUri(null);
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
    const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
    setDate(formattedDate);
    hideDatePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirmTime = (selectedTime) => {
    const formattedTime = moment(selectedTime).format('HH:mm');
    setTime(formattedTime);
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
        <Text>{date ? date : 'Select event date'}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
      />

      <Text style={styles.label}>Event Time</Text>
      <TouchableOpacity onPress={showTimePicker} style={styles.input}>
        <Text>{time ? time : 'Select event time'}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmTime}
        onCancel={hideTimePicker}
      />

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
  image: {
    width: 100,
    height: 100,
    marginTop: 20,
    marginBottom: 20,
  },
});

export default EventListing;
