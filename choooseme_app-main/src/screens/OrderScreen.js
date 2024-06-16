import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Colors, Fonts, Images } from '../contants';
import { FoodCard, Separator } from '../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Display } from '../utils';
import OrderService from '../services/OrderService';
import UserService from '../services/UserService';

const OrderScreen = ({ navigation, route: { params: { orderId } } }) => {
  const [username, setUsername] = useState('');
  const [orderFoods, setOrderFoods] = useState([]);
  const [total, setTotal] = useState(0);

  
  useEffect(() => {
    const getUserData = async () => {
      try {
        let response = await UserService.getUserData();
        let userData = response.data;
        setUsername(userData.data.name);
      } catch (error) {
        console.error(error);
      }
    };
    getUserData();
  }, []);

  useEffect(() => {
    const fetchOrderFoods = async () => {
      try {
        let response = await OrderService.getOrderFoods({ username, orderId });
        if (response.status) {
          setOrderFoods(response.data);
          setTotal(response.total);
        } else {
          Alert.alert('Error', response.message);
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch order foods');
      }
    };

    if (username) {
      fetchOrderFoods();
    }
  }, [username, orderId]);

  // console.log(orderFoods)

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.PEACH} translucent />
      <Separator height={StatusBar.currentHeight} />
      <View style={styles.headerContainer}>
        <Ionicons name="chevron-back-outline" size={30} onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Order Details</Text>
      </View>
      {orderFoods.length > 0 ? (
        <>
          <ScrollView>
            <View style={styles.foodList}>
              {orderFoods.map((item) => (
                <FoodCard
                  key={item._id}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                  description={item.description}
                  count={item.count}
                  navigate={() => navigation.navigate('Food', { foodId: item?._id })}
                />
              ))}
            </View>
            <View style={styles.promoCodeContainer}>
              <View style={styles.rowAndCenter}>
                <Entypo name="ticket" size={30} color={Colors.DEFAULT_YELLOW} />
                <Text style={styles.promoCodeText}>Add Promo Code</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color={Colors.DEFAULT_BLACK} />
              
            </View>
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalText}>
                 {total} đ
              </Text>
              </View>
            <Separator height={Display.setHeight(9)} />
          </ScrollView>
        </>
      ) : (
        <View style={styles.emptyCartContainer}>
          <Image style={styles.emptyCartImage} source={Images.EMPTY_CART} resizeMode="contain" />
          <Text style={styles.emptyCartText}>No foods found</Text>
          <Text style={styles.emptyCartSubText}>
            Go ahead and order some tasty food
          </Text>
          <TouchableOpacity style={styles.addButtonEmpty}>
            <AntDesign name="plus" color={Colors.DEFAULT_WHITE} size={20} />
            <Text style={styles.addButtonEmptyText}>Add Food</Text>
          </TouchableOpacity>
          <Separator height={Display.setHeight(15)} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
  upper: { height: 100, backgroundColor: '#DDD', opacity: .5 },
  lower: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    height: Display.setHeight(30),
    width: Display.setWidth(90)
  },
  hideText: {
    fontSize: 50,
    color: 'white',
  },
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
  foodList: {
    marginHorizontal: Display.setWidth(4),
  },
  promoCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Display.setWidth(4),
    paddingVertical: 15,
    marginTop: 10,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    justifyContent: 'space-between',
  },
  promoCodeText: {
    fontSize: 15,
    fontFamily: Fonts.POPPINS_MEDIUM,
    lineHeight: 15 * 1.4,
    color: Colors.DEFAULT_BLACK,
  },
  amountContainer: {
    marginHorizontal: Display.setWidth(4),
    paddingVertical: 15,
    marginTop: 10,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  amountSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  amountLabelText: {
    fontSize: 16,
    fontFamily: Fonts.POPPINS_MEDIUM,
    color: Colors.DEFAULT_BLACK,
  },
  amountText: {
    fontSize: 16,
    fontFamily: Fonts.POPPINS_MEDIUM,
    color: Colors.DEFAULT_BLACK,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: Display.setWidth(4),
    marginVertical: 10,
  },
  totalText: {
    fontSize: 18,
    fontFamily: Fonts.POPPINS_BOLD,
    color: Colors.DEFAULT_BLACK,
  },
  checkoutButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Display.setWidth(4),
    backgroundColor: Colors.PEACH,
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  checkoutText: {
    fontSize: 18,
    fontFamily: Fonts.POPPINS_MEDIUM,
    color: Colors.DEFAULT_WHITE,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.DEFAULT_WHITE,
  },
  emptyCartImage: {
    height: Display.setHeight(20),
    width: Display.setWidth(50),
  },
  emptyCartText: {
    fontSize: 20,
    fontFamily: Fonts.POPPINS_MEDIUM,
    color: Colors.DEFAULT_BLACK,
    marginTop: 10,
  },
  emptyCartSubText: {
    fontSize: 16,
    fontFamily: Fonts.POPPINS_MEDIUM,
    color: Colors.INACTIVE_GREY,
    marginVertical: 10,
  },
  addButtonEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.PEACH,
    padding: 10,
    borderRadius: 8,
  },
  addButtonEmptyText: {
    fontSize: 16,
    fontFamily: Fonts.POPPINS_MEDIUM,
    color: Colors.DEFAULT_WHITE,
    marginLeft: 10,
  },
});

export default OrderScreen;
