import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import moment from 'moment';
import CalendarStrip from 'react-native-calendar-strip';
import { Timestamp } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';

const EventViewing = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date());

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (auth.currentUser) {
          const startOfDay = Timestamp.fromDate(moment(selectedDay).startOf('day').toDate());
          const endOfDay = Timestamp.fromDate(moment(selectedDay).endOf('day').toDate());
          const q = query(
            collection(db, 'events'),
            where('date', '>=', startOfDay),
            where('date', '<=', endOfDay)
          );
          const querySnapshot = await getDocs(q);
          const eventsData = [];
          querySnapshot.forEach((doc) => {
            const eventData = doc.data();
            if (eventData.date && eventData.time) {
              eventData.date = eventData.date.toDate(); // Convert Firestore Timestamp to Date
              eventData.time = eventData.time.toDate(); // Convert Firestore Timestamp to Date
              eventsData.push({ ...eventData, id: doc.id });
            }
          });
          setEvents(eventsData);
        } else {
          Alert.alert('Error', 'You must be logged in to view events');
        }
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };

    fetchEvents();
  }, [selectedDay]);

  const handleDayPress = (day) => {
    setSelectedDay(day);
  };

  const renderEvent = ({ item }) => (
    <TouchableOpacity
      style={[styles.eventContainer, { backgroundColor: item.color || '#FF7043' }]}
      onPress={() =>
        navigation.navigate('EventDetail', {
          event: {
            ...item,
            date: item.date.toISOString(),  // Convert Date to ISO string
            time: item.time.toISOString(),  // Convert Date to ISO string
          },
        })
      }
    >
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDescription}>{item.description}</Text>
      <View style={styles.eventDateContainer}>
        <MaterialIcons name="event" size={14} color="#888" />
        <Text style={styles.eventDate}>
          {moment(item.date).format('YYYY-MM-DD')} at {moment(item.time).format('HH:mm')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <CalendarStrip
        style={styles.calendarStrip}
        selectedDate={selectedDay}
        onDateSelected={handleDayPress}
        highlightDateNumberStyle={styles.selectedDate}
        highlightDateNameStyle={styles.selectedDate}
        dateNumberStyle={styles.dateNumber}
        dateNameStyle={styles.dateName}
      />
      {events.length === 0 ? (
        <View style={styles.noEventsContainer}>
          <Text style={styles.noEventsText}>No events for this day, look at other days!</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={renderEvent}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  calendarStrip: {
    height: 100,
    paddingTop: 20,
    paddingBottom: 10,
  },
  listContent: {
    padding: 16,
  },
  eventContainer: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  eventDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDate: {
    marginLeft: 4,
    fontSize: 14,
    color: '#888',
  },
  dateNumber: {
    color: '#000',
  },
  dateName: {
    color: '#000',
  },
  selectedDate: {
    color: 'blue',
  },
  noEventsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  noEventsText: {
    fontSize: 18,
    color: '#FF7043',
    textAlign: 'center',
  },
});

export default EventViewing;
