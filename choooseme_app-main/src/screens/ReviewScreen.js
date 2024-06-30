import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, FlatList, TouchableOpacity } from 'react-native';
import { Colors, Fonts } from '../contants';
import { HomeFoodCard, Separator } from '../components';
import { Display } from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ReviewService } from '../services';

const ListItemSeparator = () => (
  <View
    style={{
      height: 0.8,
      backgroundColor: Colors.DEFAULT_GREY,
      width: '100%',
      marginVertical: 10,
    }}
  />
);

const ReviewsList = ({ data, navigation }) => (
  <FlatList
    style={styles.bookmarkList}
    data={data}
    keyExtractor={item => item?._id}
    showsVerticalScrollIndicator={false}
    ListHeaderComponent={() => <Separator height={10} />}
    ListFooterComponent={() => <Separator height={10} />}
    ItemSeparatorComponent={ListItemSeparator}
    renderItem={({ item }) => (
      <TouchableOpacity onPress={() => navigation.navigate('Restaurant', { food: item.food, reviewId: item._id })}>
        <HomeFoodCard {...item.food} />
      </TouchableOpacity>
    )}
  />
);

const ReviewScreen = ({ navigation }) => {
  const [Reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('notReviewed');

  useEffect(() => {
    const fetchReviews = () => {
      ReviewService.getReviews()
        .then(response => {
          if (response?.status) {
            setReviews(response?.data);
          } else {
            console.log(response?.message);
            setError(response?.message || 'No data found');
          }
        })
        .catch(error => {
          console.log('Error fetching reviews:', error);
          setError('Error fetching reviews');
        });
    };

    const unsubscribe = navigation.addListener('focus', () => {
      fetchReviews();
    });

    // Fetch reviews initially when the component mounts
    fetchReviews();

    return unsubscribe;
  }, [navigation]);

  const notReviewed = Reviews.filter(item => item.review === '');
  const reviewed = Reviews.filter(item => item.review !== '');

  const getActiveTabData = () => {
    if (activeTab === 'notReviewed') return notReviewed;
    if (activeTab === 'reviewed') return reviewed;
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.PEACH}
        translucent
      />
      <Separator height={StatusBar.currentHeight} />
      <View style={styles.headerContainer}>
        <Ionicons
          name="chevron-back-outline"
          size={30}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Reviews</Text>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'notReviewed' && styles.activeTab]}
          onPress={() => setActiveTab('notReviewed')}
        >
          <Text style={[styles.tabText, activeTab === 'notReviewed' && styles.activeTabText]}>
            Not Reviewed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'reviewed' && styles.activeTab]}
          onPress={() => setActiveTab('reviewed')}
        >
          <Text style={[styles.tabText, activeTab === 'reviewed' && styles.activeTabText]}>
            Reviewed
          </Text>
        </TouchableOpacity>
      </View>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ReviewsList data={getActiveTabData()} navigation={navigation} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.DEFAULT_WHITE,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.PEACH,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: Fonts.POPPINS_MEDIUM,
    lineHeight: 20 * 1.4,
    width: Display.setWidth(80),
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.DEFAULT_YELLOW,
  },
  tabText: {
    fontSize: 16,
    color: Colors.DEFAULT_GREY,
    fontFamily: Fonts.POPPINS_MEDIUM,
  },
  activeTabText: {
    color: Colors.DEFAULT_BLACK,
  },
  bookmarkList: {
    marginHorizontal: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
  },
});

export default ReviewScreen;
