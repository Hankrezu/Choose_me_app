import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Colors, Fonts } from '../contants';
import Separator from './Separator';
import OrderService from '../services/OrderService';

const RestaurantOrderCard = ({ _id, restaurantId ,tags, total, status,username, date, navigate }) => {

  const handleCancelOrder = async () => {
    try {
      const response = await OrderService.cancelOrder({ username: username, orderId: _id });
      if (response.status) {
        Alert.alert('Success', 'Order canceled successfully');
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel order');
    }
  };

  const handleReOrder = async () => {
    try {
      const response = await OrderService.reOrder({ username, orderId: _id });
      if (response.status) {
        Alert.alert('Success', 'Order placed successfully', [
          { text: 'OK' }
        ]);
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to place order');
    }
  };

  const handleReceivedOrder = async () => {
    try {
      const response = await OrderService.receivedOrder({ username, orderId: _id });
      if (response.status) {
        Alert.alert('Success', 'Order marked as received');
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to mark order as received');
    }
  };

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => navigate(_id)}>
          <View style={styles.labelContainer}>
            <Text style={styles.titleText}>Id Order: {_id}</Text>
            <Text style={styles.tagText}>{tags?.slice(0, 3).join(' • ')}</Text>
            <View style={styles.buttonLabelRow}>
              <View style={styles.rowAndCenter}>
                <Text style={styles.ratingText}>Total Price: {total} đ</Text>
              </View>
            </View>
            <View>
              <Text style={styles.ratingText}>Date: {date}</Text>
            </View>
            <View>
              <Text style={styles.ratingText}>Status: {status}</Text>
            </View>
          </View>
        </TouchableOpacity>
        {status === 'PENDING' && (
          <TouchableOpacity style={styles.button} onPress={handleCancelOrder}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        )}
        {status === 'ONCOMING' && (
          <TouchableOpacity style={styles.button} onPress={handleReceivedOrder}>
            <Text style={styles.buttonText}>Received Order</Text>
          </TouchableOpacity>
        )}
        {(status === 'CANCELLED' || status === 'DELIVERED') && (
          <TouchableOpacity style={styles.button} onPress={handleReOrder}>
            <Text style={styles.buttonText}>Buy Again</Text>
          </TouchableOpacity>
        )}
      </View>
      <Separator height={5} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.DEFAULT_WHITE,
  },
  labelContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  titleText: {
    fontSize: 15,
    lineHeight: 15 * 1.4,
    fontFamily: Fonts.POPPINS_MEDIUM,
    color: Colors.DEFAULT_BLACK,
    marginBottom: 5,
  },
  tagText: {
    fontSize: 11,
    lineHeight: 11 * 1.4,
    fontFamily: Fonts.POPPINS_MEDIUM,
    color: Colors.DEFAULT_GREY,
    marginBottom: 5,
  },
  rowAndCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    lineHeight: 12 * 1.4,
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
    color: Colors.DEFAULT_BLACK,
    marginLeft: 3,
  },
  buttonLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    borderWidth: 1,
    backgroundColor: Colors.PEACH,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: Fonts.POPPINS_MEDIUM,
  },
});

export default RestaurantOrderCard;
