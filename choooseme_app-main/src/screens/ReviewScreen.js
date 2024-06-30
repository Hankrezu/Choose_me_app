import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, FlatList } from 'react-native';
import { Colors, Fonts } from '../contants';
import { Separator } from '../components';
import { Display } from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ReviewCard from '../components/ReviewCard';
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

const ReviewScreen = ({ navigation }) => {
  const [Reviews, setReviews] = useState(null);

  useEffect(() => {
    const fetchReviews = () => {
      ReviewService.getReviews()
        .then(response => {
          if (response?.status) {
            setReviews(response?.data);
          } else {
            console.log(response?.data);
            console.log('No data found or response status is false');
          }
        })
        .catch(error => {
          console.log('Error fetching reviews:', error);
        });
    };

    const unsubscribe = navigation.addListener('focus', () => {
      fetchReviews();
    });
    return unsubscribe;
  }, [navigation]);

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
      <FlatList
        style={styles.bookmarkList}
        data={Reviews}
        keyExtractor={item => item?.restaurantId?.toString()}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => <Separator height={10} />}
        ListFooterComponent={() => <Separator height={10} />}
        ItemSeparatorComponent={ListItemSeparator}
        renderItem={({ item }) => <ReviewCard {...item.food} />}
      />
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
  bookmarkList: {
    marginHorizontal: 10,
  },
});

export default ReviewScreen;
