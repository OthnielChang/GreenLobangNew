import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, Share, Image } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { doc, setDoc, collection } from 'firebase/firestore';
import moment from 'moment';

const EventDetail = ({ route }) => {
  const { event } = route.params;

  useEffect(() => {
    console.log("Event data:", event);
  }, [event]);

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

  const handleShare = async () => {
    const shareMessage = `Check out this upcoming NUS GreenLobang event:\n${event.title}\n${event.description}\n${moment(event.date).format('YYYY-MM-DD')} at ${moment(event.time).format('HH:mm')}`;

    try {
      const result = await Share.share({
        message: shareMessage,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      console.error('Error sharing event: ', error);
    }
  };

  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Event data is missing.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.description}>{event.description}</Text>
      <Text style={styles.date}>
        {moment(event.date).format('YYYY-MM-DD')} at {moment(event.time).format('HH:mm')}
      </Text>
      {event.imageUrl && (
        <Image
          source={{ uri: event.imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      )}
      <Button title="Add to My Calendar" onPress={handleAddToCalendar} />
      <View style={{ marginTop: 10 }}>
        <Button title="Share Event" onPress={handleShare} />
      </View>
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
  image: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default EventDetail;
