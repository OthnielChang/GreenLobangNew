import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import moment from 'moment';
import Swiper from 'react-native-swiper';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const { width } = Dimensions.get('window');

export default function Calendar() {
  const swiper = useRef();
  const [value, setValue] = useState(new Date());
  const [week, setWeek] = useState(0);
  const [events, setEvents] = useState([]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');

  const weeks = React.useMemo(() => {
    const start = moment().add(week, 'weeks').startOf('week');

    return [-1, 0, 1].map(adj => {
      return Array.from({ length: 7 }).map((_, index) => {
        const date = moment(start).add(adj, 'week').add(index, 'day');

        return {
          weekday: date.format('ddd'),
          date: date.toDate(),
        };
      });
    });
  }, [week]);

  const addEvent = async () => {
    try {
      if (auth.currentUser) {
        await addDoc(collection(db, 'events'), {
          title: newEventTitle,
          description: newEventDescription,
          date: value,
          uid: auth.currentUser.uid, // Add user ID to the event data
        });
        setNewEventTitle('');
        setNewEventDescription('');
        fetchEvents();
      } else {
        Alert.alert('Error', 'You must be logged in to add events');
      }
    } catch (error) {
      console.error("Error adding event: ", error);
    }
  };

  const fetchEvents = async () => {
    try {
      if (auth.currentUser) {
        const q = query(collection(db, 'events'), where('date', '==', value));
        const querySnapshot = await getDocs(q);
        const eventsData = [];
        querySnapshot.forEach((doc) => {
          const eventData = doc.data();
          eventData.date = eventData.date.toDate(); // Convert Firestore Timestamp to Date
          eventsData.push({ ...eventData, id: doc.id });
        });
        setEvents(eventsData);
      } else {
        Alert.alert('Error', 'You must be logged in to view events');
      }
    } catch (error) {
      console.error("Error fetching events: ", error);
    }
  };  

  useEffect(() => {
    fetchEvents();
  }, [value]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Schedule</Text>
        </View>

        <View style={styles.picker}>
          <Swiper
            index={1}
            ref={swiper}
            loop={false}
            showsPagination={false}
            onIndexChanged={ind => {
              if (ind === 1) {
                return;
              }
              setTimeout(() => {
                const newIndex = ind - 1;
                const newWeek = week + newIndex;
                setWeek(newWeek);
                setValue(moment(value).add(newIndex, 'week').toDate());
                swiper.current.scrollTo(1, false);
              }, 100);
            }}>
            {weeks.map((dates, index) => (
              <View style={styles.itemRow} key={index}>
                {dates.map((item, dateIndex) => {
                  const isActive =
                    value.toDateString() === item.date.toDateString();
                  return (
                    <TouchableWithoutFeedback
                      key={dateIndex}
                      onPress={() => setValue(item.date)}>
                      <View
                        style={[
                          styles.item,
                          isActive && {
                            backgroundColor: '#111',
                            borderColor: '#111',
                          },
                        ]}>
                        <Text
                          style={[
                            styles.itemWeekday,
                            isActive && { color: '#fff' },
                          ]}>
                          {item.weekday}
                        </Text>
                        <Text
                          style={[
                            styles.itemDate,
                            isActive && { color: '#fff' },
                          ]}>
                          {item.date.getDate()}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  );
                })}
              </View>
            ))}
          </Swiper>
        </View>

        <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 24 }}>
          <Text style={styles.subtitle}>{value.toDateString()}</Text>

          <View style={styles.eventInput}>
            <TextInput
              style={styles.input}
              placeholder="Event Title"
              value={newEventTitle}
              onChangeText={setNewEventTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Event Description"
              value={newEventDescription}
              onChangeText={setNewEventDescription}
            />
            <Button title="Add Event" onPress={addEvent} />
          </View>

          <FlatList
            data={events.filter(event => event.date.toDateString() === value.toDateString())}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.eventItem}>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventDescription}>{item.description}</Text>
              </View>
            )}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => {
              addEvent
            }}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Schedule</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
  },
  header: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
  },
  picker: {
    flex: 1,
    maxHeight: 74,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#999999',
    marginBottom: 12,
  },
  footer: {
    marginTop: 'auto',
    paddingHorizontal: 16,
  },
  /** Item */
  item: {
    flex: 1,
    height: 50,
    marginHorizontal: 4,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#e3e3e3',
    flexDirection: 'column',
    alignItems: 'center',
  },
  itemRow: {
    width: width,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  itemWeekday: {
    fontSize: 13,
    fontWeight: '500',
    color: '#737373',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  /** Placeholder */
  placeholder: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    height: 400,
    marginTop: 0,
    padding: 0,
    backgroundColor: 'transparent',
  },
  placeholderInset: {
    borderWidth: 4,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 9,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  /** Schedule Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
  /** Event Input */
  eventInput: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  /** Event Item */
  eventItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  eventDescription: {
    fontSize: 14,
    color: '#555',
  },
});
