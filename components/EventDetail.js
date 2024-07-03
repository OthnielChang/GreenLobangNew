import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, Share, Image, Switch, TouchableOpacity } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { doc, setDoc, updateDoc, increment, arrayUnion, getDoc, collection } from 'firebase/firestore';
import moment from 'moment';

const EventDetail = ({ route }) => {
  const { event } = route.params;
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);

  useEffect(() => {
    console.log("Event data:", event);
    checkIfClaimed();
  }, [event]);

  const checkIfClaimed = async () => {
    try {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.claimedEvents && userData.claimedEvents.includes(event.id)) {
            setHasClaimed(true);
          }
        }
      }
    } catch (error) {
      console.error('Error checking claimed events: ', error);
    }
  };

  const handleAddToCalendar = async () => {
    try {
      if (auth.currentUser) {
        const userEventRef = doc(collection(db, `users/${auth.currentUser.uid}/userEvents`));
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            email: auth.currentUser.email,
            name: auth.currentUser.displayName || 'Anonymous',
            points: 0,
            claimedEvents: [],
          });
        }

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

  const handleClaimPoints = async () => {
    if (!isSwitchOn) {
      Alert.alert('Warning', 'You must agree to the terms and conditions before claiming points.');
      return;
    }

    if (hasClaimed) {
      Alert.alert('Warning', 'You have already claimed points for this event.');
      return;
    }

    try {
      if (auth.currentUser) {
        // Update user points and claimed events
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          points: increment(10), // we can change the points here
          claimedEvents: arrayUnion(event.id), // Add event ID to claimed events
        });

        setHasClaimed(true);
        Alert.alert('Success', 'Points claimed successfully');
      } else {
        Alert.alert('Error', 'You must be logged in to claim points');
      }
    } catch (error) {
      console.error('Error claiming points: ', error);
      Alert.alert('Error', 'Failed to claim points');
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

  const handleSwitch = (value) => {
    setIsSwitchOn(value);
    if (value) {
      Alert.alert(
        'Warning',
        'If you are caught falsifying points, you will be subject to disciplinary action.'
      );
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
      <View style={styles.switchContainer}>
        <Switch value={isSwitchOn} onValueChange={handleSwitch} />
        <Text style={styles.switchLabel}>
          I agree to the terms and conditions
        </Text>
      </View>
      <Button title="Add to My Calendar" onPress={handleAddToCalendar} />
      <View style={{ marginTop: 10 }}>
        <Button title="Share Event" onPress={handleShare} />
      </View>
      <TouchableOpacity
        style={[styles.claimButton, hasClaimed && styles.disabledButton]}
        onPress={handleClaimPoints}
        disabled={hasClaimed}
      >
        <Text style={styles.claimButtonText}>{hasClaimed ? 'Points Claimed' : 'Claim Points'}</Text>
      </TouchableOpacity>
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  switchLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  claimButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
  claimButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default EventDetail;
