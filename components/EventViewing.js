import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Ensure this path is correct
import moment from 'moment';

const EventViewing = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'events'));
      const eventsData = [];
      querySnapshot.forEach((doc) => {
        const eventData = doc.data();
        eventsData.push({
          ...eventData,
          date: eventData.date && eventData.date.toDate ? moment(eventData.date.toDate()).format('YYYY-MM-DD') : '',
          time: eventData.time && eventData.time.toDate ? moment(eventData.time.toDate()).format('HH:mm') : '',
          id: doc.id,
        });
      });
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  const renderItem = ({ item }) => (
    <View style={styles.eventContainer}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDescription}>{item.description}</Text>
      <Text style={styles.eventDateTime}>{item.date} at {item.time}</Text>
      {item.imageUri ? <Image source={{ uri: item.imageUri }} style={styles.eventImage} /> : null}
    </View>
  );

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 20,
  },
  eventContainer: {
    marginBottom: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  eventDateTime: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
});

export default EventViewing;
