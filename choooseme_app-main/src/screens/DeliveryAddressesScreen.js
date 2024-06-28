import React, { useState, useEffect } from 'react';
import {
View,
Text,
StyleSheet,
StatusBar,
FlatList,
Image, // Import Image component
TouchableOpacity
} from 'react-native';
import { Colors, Fonts } from '../contants';
import { Separator, RestaurantCart,RestaurantOrderCard } from '../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Display } from '../utils';


const DeliveryAddressesScreen = ({navigation}) => {
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
        <Text style={styles.headerTitle}>Delivery Address</Text>
      </View>

      <View style={styles.content}>
        {/* Other content goes here */}
      </View>

      <TouchableOpacity style={styles.addAddressButton} onPress={()=>navigation.navigate('NewAddressScreen')}>
        <Text style={styles.addAddressButtonText}>Add New Address</Text>
      </TouchableOpacity>
    </View>
  )
}


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
    content: {
        flex: 1,
        paddingHorizontal: 24,
      },
      addAddressButton: {
        backgroundColor: Colors.PEACH,
        marginHorizontal: 24,
        marginVertical: 20,
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
      },
      addAddressButtonText: {
        fontSize: 18,
        fontFamily: Fonts.POPPINS_MEDIUM,
        color: Colors.DEFAULT_WHITE,
      },
  });
  

export default DeliveryAddressesScreen