import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import moment from 'moment';

const Calendar = () => {
  const [userEvents, setUserEvents] = useState([]);

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        if (auth.currentUser) {
          const userEventsRef = collection(db, `users/${auth.currentUser.uid}/userEvents`);
          const q = query(userEventsRef);
          const querySnapshot = await getDocs(q);
          const eventsData = [];
          querySnapshot.forEach((doc) => {
            const eventData = doc.data();
            eventData.date = eventData.date.toDate(); // Convert Firestore Timestamp to Date
            eventData.time = eventData.time.toDate(); // Convert Firestore Timestamp to Date
            eventsData.push({ ...eventData, id: doc.id });
          });
          setUserEvents(eventsData);
        } else {
          Alert.alert('Error', 'You must be logged in to view your calendar');
        }
      } catch (error) {
        console.error("Error fetching user events: ", error);
      }
    };

    fetchUserEvents();
  }, []);

  const renderEvent = ({ item }) => (
    <View style={styles.eventContainer}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDescription}>{item.description}</Text>
      <Text style={styles.eventDate}>
        {moment(item.date).format('YYYY-MM-DD')} at {moment(item.time).format('HH:mm')}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={userEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  eventContainer: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventDescription: {
    marginTop: 8,
    fontSize: 14,
    color: '#555',
  },
  eventDate: {
    marginTop: 8,
    fontSize: 12,
    color: '#888',
  },
});

export default Calendar;
