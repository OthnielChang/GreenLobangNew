import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import moment from 'moment';

const EventDetail = ({ route }) => {
  const { event } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.description}>{event.description}</Text>
      <Text style={styles.dateTime}>{moment(event.date).format('YYYY-MM-DD')} at {moment(event.date).format('HH:mm')}</Text>
      {event.imageUri && (
        <Image source={{ uri: event.imageUri }} style={styles.image} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
  },
  dateTime: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
});

export default EventDetail;
