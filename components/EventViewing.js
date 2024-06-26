import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import moment from 'moment';
import Swiper from 'react-native-swiper';
import { Timestamp } from 'firebase/firestore';

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
              console.log("Fetched event:", eventData); // Debug: Log fetched event
              eventsData.push({ ...eventData, id: doc.id });
            } else {
              console.warn("Missing date or time in event:", eventData); //to handle missing data gracefully
            }
          });
          console.log("All fetched events:", eventsData); // Debug: Log all fetched events
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
    setSelectedDay(new Date(day));
    console.log("Selected day:", day); // Debug: Log selected day
  };

  const renderEvent = ({ item }) => (
    <TouchableOpacity
      style={styles.eventContainer}
      onPress={() =>
        navigation.navigate('EventDetail', {
          event: { ...item, date: item.date.toISOString(), time: item.time.toISOString() }, // Pass date and time as ISO strings
        })
      }
    >
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDescription}>{item.description}</Text>
      <Text style={styles.eventDate}>
        {moment(item.date).format('YYYY-MM-DD')} at {moment(item.time).format('HH:mm')}
      </Text>
    </TouchableOpacity>
  );

  const renderDays = () => {
    const days = [];
    for (let i = -3; i <= 3; i++) {
      const day = new Date();
      day.setDate(selectedDay.getDate() + i);
      days.push(day);
    }
    return days.map((day, index) => (
      <TouchableOpacity key={index} onPress={() => handleDayPress(day)}>
        <Text style={[styles.dayText, day.toDateString() === selectedDay.toDateString() && styles.selectedDayText]}>
          {day.toDateString()}
        </Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <Swiper showsPagination={false} loop={false} index={3}>
        {renderDays()}
      </Swiper>
      <FlatList
        data={events}
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
  dayText: {
    fontSize: 16,
    padding: 8,
  },
  selectedDayText: {
    fontWeight: 'bold',
    color: 'blue',
  },
});

export default EventViewing;
