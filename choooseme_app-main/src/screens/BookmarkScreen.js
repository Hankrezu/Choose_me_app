import React from 'react';
import {View, Text, StyleSheet, StatusBar, FlatList} from 'react-native';
import {Colors, Fonts} from '../contants';
import {BookmarkCard, Separator} from '../components';
import {Display} from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';

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

const BookmarkScreen = ({navigation}) => {
  const bookmarks = useSelector(state => state?.bookmarkState?.bookmarks);
  console.log(bookmarks)
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
        <Text style={styles.headerTitle}>Bookmarks</Text>
      </View>
      <FlatList
      style={styles.bookmarkList}
      data={bookmarks}
      keyExtractor={item => item?.restaurantId}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={() => <Separator height={10} />}
      ListFooterComponent={() => <Separator height={10} />}
      ItemSeparatorComponent={() => <ListItemSeparator />}
      renderItem={({ item }) => (
        <BookmarkCard
          {...item.restaurant}
          navigate={() =>
            navigation.navigate('Restaurant2', { restaurantId: item?.restaurant._id})
          }
        />
      )}
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
    backgroundColor: Colors.PEACH
    
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

export default BookmarkScreen;
