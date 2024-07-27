import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../firebaseConfig';
import { collection, query, getDocs } from 'firebase/firestore';
import moment from 'moment';

const Calendar = () => {
  const [userEvents, setUserEvents] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        if (auth.currentUser) {
          const userEventsRef = collection(db, `users/${auth.currentUser.uid}/userEvents`);
          const q = query(userEventsRef);
          const querySnapshot = await getDocs(q);
          const eventsData = [];
          const currentTime = new Date();
          querySnapshot.forEach((doc) => {
            const eventData = doc.data();
            eventData.date = eventData.date.toDate(); // Convert Firestore Timestamp to Date
            eventData.time = eventData.time.toDate(); // Convert Firestore Timestamp to Date

            // Only include events that have not expired
            if (eventData.date >= currentTime) {
              eventsData.push({ ...eventData, id: doc.id });
            }
          });

          // Sort events by date in descending order
          eventsData.sort((a, b) => b.date - a.date);

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

  const renderEvent = ({ item }) => ( // takes in event and lists it out
    <TouchableOpacity
      style={styles.eventContainer}
      onPress={() => navigation.navigate('EventDetail', { event: item })}
    >
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDescription}>{item.description}</Text>
      <Text style={styles.eventDate}>
        {moment(item.date).format('YYYY-MM-DD')} at {moment(item.time).format('HH:mm')}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {userEvents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Empty day? Press the button below to add events!</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('EventViewing')}
          >
            <Text style={styles.addButtonText}>Go to EventViewing</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={userEvents} //take data from userEvents from firebase
          keyExtractor={(item) => item.id} //for id
          renderItem={renderEvent}
          contentContainerStyle={styles.listContent}
        />
      )}
      <TouchableOpacity
        style={styles.addEventButton}
        onPress={() => navigation.navigate('EventViewing')}
      >
        <Text style={styles.addEventButtonText}>Add Event</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    paddingBottom: 16,
  },
  eventContainer: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addEventButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addEventButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Calendar;
