import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { auth, db } from '../firebaseConfig'; // Import your Firebase configuration
import { collection, getDocs } from 'firebase/firestore';

const RedeemedRewards = () => {
  const [redeemedRewards, setRedeemedRewards] = useState([]);

  useEffect(() => { // fetching redeemed rewards
    const fetchRedeemedRewards = async () => {
      const rewardsSnapshot = await getDocs(collection(db, 'users', auth.currentUser.uid, 'redeemedRewards'));
      const rewardsList = rewardsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRedeemedRewards(rewardsList); // if it doesnt alr exist
    };

    fetchRedeemedRewards();
  }, []);

  const renderReward = ({ item }) => (
    <View style={styles.rewardContainer}>
      <Text style={styles.rewardName}>{item.name}</Text>
      <Text style={styles.rewardDescription}>{item.description}</Text>
      <Text style={styles.rewardCost}>{item.cost}</Text>
      <Text style={styles.redeemedAt}>{item.redeemedAt.toDate().toDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Redeemed Rewards</Text>
      <FlatList
        data={redeemedRewards}
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
  headerText: {
    fontSize: 24,
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
  redeemedAt: {
    fontSize: 12,
    color: '#999',
  },
});

export default RedeemedRewards;
