import React, { useState, useEffect } from 'react';
import {
View,
Text,
StyleSheet,
StatusBar,
FlatList,
Image, // Import Image component
TouchableOpacity
} from 'react-native';``
import { Colors, Fonts } from '../contants';
import { Separator, RestaurantCart,RestaurantOrderCard } from '../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Display } from '../utils';
import UserService from '../services/UserService';
import { OrderService } from '../services';

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

const OrderHistoryScreen = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [username, setUsername] = useState('');
  const [pendingOrders, setPendingOrders] = useState([]);
  const [oncomingOrders, setOncomingOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        let response = await UserService.getUserData();
        let userData = response.data;
        setUsername(userData.data.name);

        let restaurantResponse = await OrderService.getOrderRestaurants({ username: userData.data.name });
        if (restaurantResponse?.status) {
          setRestaurants(restaurantResponse?.data?.orderRestaurants || []);
        } else {
          console.log('Order restaurants not found');
        }
      } catch (error) {
        console.log('Error in fetching user data or order restaurants:', error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (username) {
        OrderService.getOrderRestaurants({ username }).then(response => {
          if (response?.status) {
            setRestaurants(response?.data?.orderRestaurants || []);
          } else {
            console.log('Order restaurants not found');
          }
        }).catch(error => {
          console.log('Error in OrderService.getOrderRestaurants:', error);
        });
      }
    });

    return unsubscribe;
  }, [navigation, username]);

  useEffect(() => {
    // Categorize orders based on status
    const categorizeOrders = () => {
      const pending = [];
      const oncoming = [];
      const cancelled = [];
      const delivered = [];

      restaurants.forEach(item => {
        switch (item.status) {
          case 'PENDING':
            pending.push(item);
            break;
          case 'ONCOMING':
            oncoming.push(item);
            break;
          case 'CANCELLED':
            cancelled.push(item);
            break;
          case 'DELIVERED':
            delivered.push(item);
            break;
          default:
            break;
        }
      });

      setPendingOrders(pending);
      setOncomingOrders(oncoming);
      setCancelledOrders(cancelled);
      setDeliveredOrders(delivered);
    };

    categorizeOrders();
  }, [restaurants]);

  const keyExtractor = (item, index) => `${item._id}_${index}`;

  const renderOrderList = (data) => (
    <FlatList
      style={styles.RestaurantCartList}
      data={data}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={() => <Separator height={10} />}
      ListFooterComponent={() => <Separator height={10} />}
      ItemSeparatorComponent={() => <ListItemSeparator />}
      renderItem={({ item }) => (
        <RestaurantOrderCard
          _id={item._id}
          name={item.restaurants.name}
          restaurantId={item.restaurantId}
          date={item.createdAt}
          total={item.total}
          status={item.status}
          username={item.username}
          navigate={() => navigation.navigate('Order', { orderId: item._id })}
        />
      )}
    />
  );

  const TabButton = ({ title, onPress, isActive }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTabButton]}
      onPress={onPress}
    >
      <Text style={styles.tabButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'PENDING':
        return renderOrderList(pendingOrders);
      case 'ONCOMING':
        return renderOrderList(oncomingOrders);
      case 'CANCELLED':
        return renderOrderList(cancelledOrders);
      case 'DELIVERED':
        return renderOrderList(deliveredOrders);
      default:
        return null;
    }
  };

  const [activeTab, setActiveTab] = useState('PENDING');
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.PEACH} translucent />
      <Separator height={StatusBar.currentHeight} />
      <View style={styles.headerContainer}>
        <Ionicons
          name="chevron-back-outline"
          size={30}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Order History</Text>
      </View>
      <View style={styles.tabContainer}>
        <TabButton
          title="Pending"
          onPress={() => setActiveTab('PENDING')}
          isActive={activeTab === 'PENDING'}
        />
        <TabButton
          title="Oncoming"
          onPress={() => setActiveTab('ONCOMING')}
          isActive={activeTab === 'ONCOMING'}
        />
        <TabButton
          title="Cancelled"
          onPress={() => setActiveTab('CANCELLED')}
          isActive={activeTab === 'CANCELLED'}
        />
        <TabButton
          title="Delivered"
          onPress={() => setActiveTab('DELIVERED')}
          isActive={activeTab === 'DELIVERED'}
        />
      </View>
      {renderTabContent()}
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
    width: '80%',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.LIGHT_GREY,
    paddingVertical: 10,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: Colors.PEACH,
  },
  tabButtonText: {
    fontSize: 16,
    fontFamily: Fonts.POPPINS_MEDIUM,
    color: Colors.DEFAULT_BLACK,
  },
  RestaurantCartList: {
    marginHorizontal: 15,
  },
});

export default OrderHistoryScreen;
