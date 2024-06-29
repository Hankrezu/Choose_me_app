import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Colors, Fonts } from '../contants';
import { Separator } from '../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import UserService from '../services/UserService';

const NewAddressScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [addressType, setAddressType] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        let response = await UserService.getUserData();
        let userData = response.data;
        setUsername(userData.data.name);
        setPhoneNumber(userData.data.phone);
      } catch (error) {
        Alert.alert('Error', `${error.message}`);
      }
    };
    getData();
  }, []);

  const handleSave = async () => {
    if (!address || !addressType) {
      Alert.alert('Error', 'Please fill out the address and select an address type.');
      return;
    }

    try {
      let checkResponse = await UserService.checkAddressExist(username, address);
      if (checkResponse.status && checkResponse.data.status) {
        Alert.alert('Error', 'Address already exists');
        return;
      }

      let response = await UserService.addAddress(username, {
        name: username,
        phone: phoneNumber,
        address: address,
        type: addressType,
      });

      if (response.status) {
        Alert.alert('Success', response.message);
        navigation.goBack();
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      Alert.alert('Error', `${error.message}`);
    }
  };

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
        <Text style={styles.headerTitle}>New Address</Text>
      </View>

      <View style={styles.mainContainer}>
        <Text style={styles.sectionHeaderText}>My Account</Text>
        <TouchableOpacity style={styles.sectionContainer} activeOpacity={0.8}>
          <View style={styles.sectionTextContainer}>
            <Ionicons
              name="person-outline"
              size={24}
              color={Colors.PEACH}
            />
            <Separator width={5} />
            <Text style={styles.sectionText}>{username}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sectionContainer} activeOpacity={0.8}>
          <View style={styles.sectionTextContainer}>
            <Feather
              name="phone"
              size={24}
              color={Colors.PEACH}
            />
            <Text style={styles.sectionText}>{phoneNumber ? phoneNumber : 'Phone Number'}</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionHeaderText}>Address Information</Text>
        
        <TextInput
          style={styles.textInput}
          placeholder="Enter Address"
          value={address}
          onChangeText={(text) => setAddress(text)}
        />

        <View style={styles.addressTypeContainer}>
          <TouchableOpacity
            style={[
              styles.addressTypeButton,
              addressType === 'Home' && styles.selectedAddressTypeButton,
            ]}
            onPress={() => setAddressType('Home')}
          >
            <Text
              style={[
                styles.addressTypeButtonText,
                addressType === 'Home' && styles.selectedAddressTypeButtonText,
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.addressTypeButton,
              addressType === 'Work' && styles.selectedAddressTypeButton,
            ]}
            onPress={() => setAddressType('Work')}
          >
            <Text
              style={[
                styles.addressTypeButtonText,
                addressType === 'Work' && styles.selectedAddressTypeButtonText,
              ]}
            >
              Work
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.addressTypeButton,
              addressType === 'Other' && styles.selectedAddressTypeButton,
            ]}
            onPress={() => setAddressType('Other')}
          >
            <Text
              style={[
                styles.addressTypeButtonText,
                addressType === 'Other' && styles.selectedAddressTypeButtonText,
              ]}
            >
              Other
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.addAddressButton} onPress={handleSave}>
        <Text style={styles.addAddressButtonText}>Save</Text>
      </TouchableOpacity>
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
  mainContainer: {
    flex: 1,
    marginHorizontal: 24,
    marginTop: 10,
    backgroundColor: Colors.DEFAULT_WHITE,
    elevation: 3,
    paddingHorizontal: 24,
    borderRadius: 10,
    paddingBottom: 24,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
    lineHeight: 16 * 1.4,
    color: Colors.DEFAULT_BLACK,
    marginTop: 25,
  },
  sectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  sectionTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionText: {
    fontSize: 16,
    fontFamily: Fonts.POPPINS_REGULAR,
    lineHeight: 16 * 1.4,
    color: Colors.INACTIVE_GREY,
    marginLeft: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.INACTIVE_GREY,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    fontFamily: Fonts.POPPINS_REGULAR,
    marginTop: 15,
    color: Colors.DEFAULT_BLACK,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  addressTypeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.INACTIVE_GREY,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedAddressTypeButton: {
    backgroundColor: Colors.PEACH,
    borderColor: Colors.PEACH,
  },
  addressTypeButtonText: {
    fontSize: 16,
    fontFamily: Fonts.POPPINS_REGULAR,
    color: Colors.INACTIVE_GREY,
  },
  selectedAddressTypeButtonText: {
    color: Colors.DEFAULT_WHITE,
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

export default NewAddressScreen;
