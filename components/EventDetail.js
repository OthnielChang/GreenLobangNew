import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { doc, setDoc, collection } from 'firebase/firestore';
import moment from 'moment';

const EventDetail = ({ route }) => {
  const { event } = route.params;

  const handleAddToCalendar = async () => {
    try {
      if (auth.currentUser) {
        const userEventRef = doc(collection(db, `users/${auth.currentUser.uid}/userEvents`));
        await setDoc(userEventRef, {
          ...event,
          date: new Date(event.date),
          time: new Date(event.time),
        });
        Alert.alert('Success', 'Event added to your calendar');
      } else {
        Alert.alert('Error', 'You must be logged in to add events to your calendar');
      }
    } catch (error) {
      console.error('Error adding event to calendar: ', error);
      Alert.alert('Error', 'Failed to add event to calendar');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.description}>{event.description}</Text>
      <Text style={styles.date}>
        {moment(event.date).format('YYYY-MM-DD')} at {moment(event.time).format('HH:mm')}
      </Text>
      <Button title="Add to My Calendar" onPress={handleAddToCalendar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  date: {
    fontSize: 14,
    marginBottom: 16,
  },
});

export default EventDetail;
