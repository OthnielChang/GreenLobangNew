import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig'; // Import your Firebase configuration
import { getDoc, doc, collection, getDocs, updateDoc } from 'firebase/firestore';

const RewardsScreen = () => {
  const [userPoints, setUserPoints] = useState(0);
  const [rewards, setRewards] = useState([]);

  useEffect(() => { // fetching points
    const fetchUserPoints = async () => {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        setUserPoints(userDoc.data().points);
      }
    };

    const fetchRewards = async () => { // fetching rewards
      const rewardsSnapshot = await getDocs(collection(db, 'rewards'));
      const rewardsList = rewardsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRewards(rewardsList);
    };

    fetchUserPoints();
    fetchRewards();
  }, []);

  const handleRedeem = async (reward) => { // access database to update points
    if (userPoints >= reward.cost) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        points: userPoints - reward.cost,
      });

      Alert.alert('Success', `You have redeemed ${reward.name}`);
      setUserPoints(userPoints - reward.cost);
    } else {
      Alert.alert('Error', 'You do not have enough points to redeem this reward');
    }
  };

  const renderReward = ({ item }) => (
    <TouchableOpacity style={styles.rewardContainer} onPress={() => handleRedeem(item)}>
      <Text style={styles.rewardName}>{item.name}</Text>
      <Text style={styles.rewardDescription}>{item.description}</Text>
      <Text style={styles.rewardCost}>{item.cost}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pointsText}>Your Points: {userPoints}</Text>
      <FlatList
        data={rewards}
        renderItem={renderReward}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.rewardsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  pointsText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  rewardsList: {
    flexGrow: 1,
  },
  rewardContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  rewardName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rewardDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  rewardCost: {
    fontSize: 16,
    color: '#ff0000',
  },
});

export default RewardsScreen;