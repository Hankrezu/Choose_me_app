import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {
  CategoryMenuItem,
  HomeFoodCard,
  Separator,
  RestaurantCard, // Assuming you have this component
} from '../components';
import { Colors, Fonts } from '../contants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { RestaurantService } from '../services';
import { FoodService } from '../services';
import { CategoryService } from '../services';
import { Display } from '../utils';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState(null);
  const [activeCategory, setActiveCategory] = useState();
  const [foods, setFoods] = useState(null);
  const [categories, setCategories] = useState(null);
  const [activeSortItem, setActiveSortItem] = useState('recent');
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('Fetching address...');
  const [errorMessage, setErrorMessage] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [activeTab, setActiveTab] = useState('foods'); // New state for tabs
  const [modalVisible, setModalVisible] = useState(false); // New state for modal visibility
  const HERE_API_KEY = 'N1VJJkJ75nlrnW3wBWj2iLlQadWYpHRo990Ur6r_yME'; // Replace with your actual HERE API key

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Location Access Required",
              message: "This app needs to access your location",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Location permission granted");
            setPermissionGranted(true);
            getCurrentLocation();
          } else {
            console.log("Location permission denied");
            setPermissionGranted(false);
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        // For iOS or other platforms
        Geolocation.requestAuthorization();
        setPermissionGranted(true);
        getCurrentLocation();
      }
    };

    const getCurrentLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          setLocation(position);
          fetchAddress(position.coords.latitude, position.coords.longitude);
          setErrorMessage(null);
        },
        error => {
          console.error(error);
          setErrorMessage(error.message);
        },
        { enableHighAccuracy: true, timeout: 55000, maximumAge: 50000 }
      );
    };

    const fetchAddress = async (latitude, longitude) => {
      try {
        const response = await axios.get(`https://revgeocode.search.hereapi.com/v1/revgeocode`, {
          params: {
            at: `${latitude},${longitude}`,
            apiKey: HERE_API_KEY
          }
        });
        if (response.data && response.data.items && response.data.items.length > 0) {
          setAddress(truncate(response.data.items[0].address.label));
        } else {
          setAddress("Address not found");
        }
      } catch (error) {
        console.error(error);
        setAddress("Error fetching address");
      }
    };

    requestLocationPermission();
  }, []);

  const truncate = (input) => input.length > 20 ? `${input.substring(0, 20)}...` : input;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      FoodService.getAllFoods().then(response => {
        if (response?.status) {
          setFoods(response?.data);
        }
      });
      CategoryService.getAllCategories().then(response => {
        if (response?.status) {
          setCategories(response?.data);
        }
      });
      RestaurantService.getRestaurants().then(response => {
        if (response?.status) {
          setRestaurants(response?.data);
        }
      });
    });
    return unsubscribe;
  }, []);

  const filterItems = (category) => {
    setActiveCategory(category);
    if (category) {
      const filteredFoods = foods.filter(food => food.categories.includes(category.name));
      const filteredRestaurants = restaurants.filter(restaurant => restaurant.categories.includes(category.name));
      setFoods(filteredFoods);
      setRestaurants(filteredRestaurants);
    } else {
      // Fetch all foods and restaurants again if no category is selected
      FoodService.getAllFoods().then(response => {
        if (response?.status) {
          setFoods(response?.data);
        }
      });
      RestaurantService.getRestaurants().then(response => {
        if (response?.status) {
          setRestaurants(response?.data);
        }
      });
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.DEFAULT_WHITE}
        translucent
      />

      <Separator height={StatusBar.currentHeight} />

      <View style={styles.backgroundCurvedContainer} />

      <View style={styles.headerContainer}>
        <View style={styles.searchContainer}>
          <View style={styles.searchSection}>
            <Ionicons
              name="search-outline"
              size={25}
              color={Colors.DEFAULT_GREY}
            />
            <Text style={styles.searchText}>Search..</Text>
          </View>

          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Feather
              name="sliders"
              size={20}
              color={Colors.DEFAULT_YELLOW}
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.locationContainer}>
          <Ionicons
            name="location-outline"
            size={20}
            color={Colors.DEFAULT_WHITE}
          />
          <Text style={styles.locationText}>Delivered to</Text>
          <Text style={styles.selectedLocationText}>{address}</Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={16}
            color={Colors.DEFAULT_BLACK}
          />
        </View>
        <View style={styles.categoriesContainer}>
          {/* <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={categories}
            ListHeaderComponent={() => <Separator height={20} />}
            ListFooterComponent={() => <Separator height={20} />}
            ItemSeparatorComponent={() => <Separator height={10} />}
            renderItem={({ item }) => (
              <CategoryMenuItem
                {...item}
              />
            )}
          /> */}
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'foods' && styles.activeTab]}
          onPress={() => setActiveTab('foods')}
        >
          <Text style={[styles.tabText, activeTab === 'foods' && styles.activeTabText]}>Foods</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'restaurants' && styles.activeTab]}
          onPress={() => setActiveTab('restaurants')}
        >
          <Text style={[styles.tabText, activeTab === 'restaurants' && styles.activeTabText]}>Restaurants</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.horizontalListContainer}>
        {activeTab === 'foods' ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={foods}
            keyExtractor={item => item?._id}
            ListHeaderComponent={() => <Separator height={20} />}
            ListFooterComponent={() => <Separator height={20} />}
            ItemSeparatorComponent={() => <Separator height={10} />}
            renderItem={({ item }) => (
              <HomeFoodCard
                {...item}
                navigate={() =>
                  navigation.navigate('Restaurant', { restaurantId: item?.restaurantId, foodId: item?._id })
                }
              />
            )}
          />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={restaurants}
            keyExtractor={item => item?._id}
            ListHeaderComponent={() => <Separator height={20} />}
            ListFooterComponent={() => <Separator height={20} />}
            ItemSeparatorComponent={() => <Separator height={10} />}
            renderItem={({ item }) => (
              <RestaurantCard
                {...item}
                navigate={() =>
                  navigation.navigate('Restaurant2', { restaurantId: item?._id })
                }
              />
            )}
          />
        )}
      </View>
      
      <Separator height={Display.setHeight(5)} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <FlatList
              data={categories}
              keyExtractor={item => item?._id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.category} onPress={() => filterItems(item)}>
                  <Text style={styles.categoryText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              ListHeaderComponent={() => (
                <TouchableOpacity onPress={() => filterItems(null)}>
                  <Text style={styles.categoryText}>All</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GREY3,
  },
  backgroundCurvedContainer: {
    backgroundColor: Colors.PEACH,
    height: 1927,
    position: 'absolute',
    top: -1 * (2000 - 230),
    width: 2000,
    alignSelf: 'center',
    zIndex: -1,
  },
  headerContainer: {
    justifyContent: 'space-evenly',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 20,
  },
  locationText: {
    color: Colors.DEFAULT_WHITE,
    marginLeft: 5,
    fontSize: 13,
    lineHeight: 13 * 1.4,
    fontFamily: Fonts.POPPINS_MEDIUM,
  },
  selectedLocationText: {
    color: Colors.DEFAULT_BLACK,
    marginLeft: 5,
    fontSize: 14,
    lineHeight: 14 * 1.4,
    fontFamily: Fonts.POPPINS_MEDIUM,
  },
  alertBadge: {
    borderRadius: 32,
    backgroundColor: Colors.DEFAULT_YELLOW,
    justifyContent: 'center',
    alignItems: 'center',
    height: 16,
    width: 16,
    position: 'absolute',
    right: -2,
    top: -10,
  },
  alertBadgeText: {
    color: Colors.DEFAULT_WHITE,
    fontSize: 10,
    lineHeight: 10 * 1.4,
    fontFamily: Fonts.POPPINS_BOLD,
  },
  searchContainer: {
    backgroundColor: Colors.DEFAULT_WHITE,
    height: 45,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  searchText: {
    color: Colors.DEFAULT_GREY,
    fontSize: 16,
    lineHeight: 16 * 1.4,
    fontFamily: Fonts.POPPINS_MEDIUM,
    marginLeft: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  listContainer: {
    paddingVertical: 5,
    zIndex: -5,
  },
  horizontalListContainer: {
    marginTop: -18,
    marginLeft: '5%',
    marginBottom: 280,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 5,
  },
  listHeaderTitle: {
    color: Colors.DEFAULT_BLACK,
    fontSize: 16,
    lineHeight: 16 * 1.4,
    fontFamily: Fonts.POPPINS_MEDIUM,
  },
  listHeaderSubtitle: {
    color: Colors.DEFAULT_YELLOW,
    fontSize: 13,
    lineHeight: 13 * 1.4,
    fontFamily: Fonts.POPPINS_MEDIUM,
  },
  sortListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: Colors.DEFAULT_WHITE,
    marginTop: 8,
    elevation: 1,
  },
  sortListItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.DEFAULT_YELLOW,
    height: 40,
  },
  sortListItemText: {
    color: Colors.DEFAULT_BLACK,
    fontSize: 13,
    lineHeight: 13 * 1.4,
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    height:'60%',
    backgroundColor: Colors.DEFAULT_WHITE,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: Fonts.POPPINS_MEDIUM,
    marginBottom: 20,
  },
  categoryText: {
    fontSize: 15,
    lineHeight: 15 * 1.4,
    fontFamily: Fonts.POPPINS_MEDIUM,
    color: Colors.PEACH,
    marginTop: 0,
    borderRadius: 15,
    padding: 4,
    paddingBottom:4,  
    backgroundColor: Colors.DEFAULT_WHITE,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: Colors.DEFAULT_YELLOW,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: Fonts.POPPINS_MEDIUM,
    color: Colors.DEFAULT_WHITE,
  },
  category: {
    alignItems: 'center',
    marginTop: 0,    
    paddingLeft:4,
    overflow: 'hidden', 
  },
});

export default HomeScreen;
