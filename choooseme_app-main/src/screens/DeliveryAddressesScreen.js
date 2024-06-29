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
import { Separator, AddressCard} from '../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Display } from '../utils';

const DeliveryAddressesScreen = ({navigation}) => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchAddresses = async () => {
        const username = "someUsername"; // Replace with the actual username logic
        const response = await UserService.getAddress(username);
        if (response.status) {
          setAddresses(response.data);
        } else {
          console.log(response.message);
        }
        setLoading(false);
      };
      
      fetchAddresses();
    }, []);
  
    const renderAddressItem = ({ item }) => (
      <AddressCard
        name={item.name}
        phone={item.phone}
        address={item.address}
        type={item.type}
      />
    );
  
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
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            <FlatList
              data={addresses}
              renderItem={renderAddressItem}
              keyExtractor={(item) => item._id} // Assuming _id is a unique identifier
            />
          )}
        </View>
  
        <TouchableOpacity style={styles.addAddressButton} onPress={() => navigation.navigate('NewAddressScreen')}>
          <Text style={styles.addAddressButtonText}>Add New Address</Text>
        </TouchableOpacity>
      </View>
    );
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