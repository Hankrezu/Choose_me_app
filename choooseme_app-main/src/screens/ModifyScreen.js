import React, {useState,useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  TextInput,
} from 'react-native';
import {Separator, ToggleButton} from '../components';
import {Colors, Fonts, Images} from '../contants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Display} from '../utils';
import {useDispatch} from 'react-redux';
import {StorageService} from '../services';
import {GeneralAction} from '../actions';
import { useNavigation } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import UserService from '../services/UserService';
import axios from 'axios';


const ModifyScreen = () => {
  const navigation = useNavigation();
  
  const [username, setUsername] = useState('');
  const [emailAvatar, setEmailAvatar] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');
  const [originalPhoneNumber, setOriginalPhoneNumber] = useState('');
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    
    const getData = async () => {
      try { 
        let response = await UserService.getUserData();  
        let userData = response.data;
        setUsername(userData.data.name);
        setEmailAvatar(userData.data.email);
        setEmail(userData.data.email);
        setOriginalEmail(userData.data.email);
        setPhoneNumber(userData.data.phone);
        setOriginalPhoneNumber(userData.data.phone);
      } catch (error) {
        return {
          status: false,
          message: `${error?.message}`,
        };
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (email !== originalEmail || phoneNumber !== originalPhoneNumber) {
      setIsModified(true);
    } else {
      setIsModified(false);
    }
  }, [email, phoneNumber, originalEmail, originalPhoneNumber]);

  const handleModify = async () => {
    try {
      let response = await UserService.updateUserData(username, email, phoneNumber);
      if (response.status) {
        alert('User data updated successfully');
      } else {
        alert('Failed to update user data');
      }
    } catch (error) {
      console.error('Error updating user data:', error?.message);
      alert('An error occurred while updating user data');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.PEACH}
        translucent
      />
      <Separator height={StatusBar.currentHeight} />
      <View style={styles.backgroundCurvedContainer} />
      <View style={styles.headerContainer}>
        <Ionicons
          name="chevron-back-outline"
          size={24}
          color={Colors.DEFAULT_BLACK}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Text style={styles.headerText}>Modify</Text>
        <View>  
         </View>
      </View>
      <View style={styles.profileHeaderContainer}>
        <TouchableOpacity>
          <View style={styles.profileImageContainer}>
            <Image style={styles.profileImage} source={Images.AVATAR} />
          </View>
        </TouchableOpacity>
        
        <View style={styles.profileTextContainer}>
          <Text style={styles.nameText}>{username}</Text>
          <Text style={styles.emailText}>{emailAvatar}</Text>
        </View>
      </View>
      <Separator height={70} />
      <View style={styles.mainContainer}>
        <Text style={styles.sectionHeaderText}>My Account</Text>

        <TouchableOpacity style={styles.sectionContainer} activeOpacity={0.8}>
          <View style={styles.sectionTextContainer}>
            <Feather
              name="mail"
              size={24}
              color={Colors.PEACH}
            />
            <TextInput
              style={styles.sectionTextInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
            />
          </View>
          <Feather
            name="chevron-right"
            color={Colors.INACTIVE_GREY}
            size={24}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.sectionContainer} activeOpacity={0.8}>
          <View style={styles.sectionTextContainer}>
            <Feather
              name="phone"
              size={24}
              color={Colors.PEACH}
            />
            <TextInput
              style={styles.sectionTextInput}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Phone Number"
            />
          </View>
          <Feather
            name="chevron-right"
            color={Colors.INACTIVE_GREY}
            size={24}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
        style={[styles.modifyButton, !isModified && { backgroundColor: Colors.INACTIVE_GREY }]}
        onPress={handleModify}
        disabled={!isModified}
      >
        <Text style={styles.modifyButtonText}>Modify</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.SECONDARY_WHITE,
  },
  backgroundCurvedContainer: {
    backgroundColor: Colors.PEACH,
    height: 2400,
    position: 'absolute',
    top: -1 * (2400 - 230),
    width: 2400,
    borderRadius: 2400,
    alignSelf: 'center',
    zIndex: -1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  headerText: {
    fontSize: 24,
    fontFamily: Fonts.POPPINS_MEDIUM,
    lineHeight: 24 * 1.4,
    color: Colors.DEFAULT_BLACK,
  },
  alertBadge: {
    backgroundColor: Colors.DEFAULT_YELLOW,
    position: 'absolute',
    height: 16,
    width: 16,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    right: -2,
    top: -10,
  },
  alertBadgeText: {
    fontSize: 10,
    fontFamily: Fonts.POPPINS_BOLD,
    lineHeight: 10 * 1.4,
    color: Colors.DEFAULT_WHITE,
  },
  profileHeaderContainer: {
    marginHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  profileImageContainer: {
    backgroundColor: Colors.DEFAULT_WHITE,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
    elevation: 3,
  },
  profileImage: {
    width: Display.setWidth(15),
    height: Display.setWidth(15),
    borderRadius: 32,
  },
  profileTextContainer: {
    marginLeft: 10,
  },
  nameText: {
    fontSize: 16,
    fontFamily: Fonts.POPPINS_REGULAR,
    lineHeight: 16 * 1.4,
    color: Colors.DEFAULT_BLACK,
  },
  emailText: {
    fontSize: 16,
    fontFamily: Fonts.POPPINS_REGULAR,
    lineHeight: 16 * 1.4,
    color: Colors.DEFAULT_BLACK,
  },
  menuContainer: {
    backgroundColor: Colors.DEFAULT_WHITE,
    borderRadius: 10,
    marginHorizontal: 24,
    marginTop: 24,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 24,
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
  },
  menuIcon: {
    backgroundColor: Colors.LIGHT_GREEN,
    height: Display.setWidth(8),
    width: Display.setWidth(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
  },
  menuText: {
    fontSize: 12,
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
    lineHeight: 12 * 1.4,
    color: Colors.DEFAULT_BLACK,
    textAlign: 'center',
    marginTop: 5,
  },
  mainContainer: {
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
  sectionTextInput: {
    fontSize: 16,
    fontFamily: Fonts.POPPINS_REGULAR,
    lineHeight: 16 * 1.4,
    color: Colors.INACTIVE_GREY,
    marginLeft: 10,
  },
  modifyButton: {
    backgroundColor: Colors.PEACH,
    marginHorizontal: 24,
    marginVertical: 20,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },
  modifyButtonText: {
    fontSize: 18,
    fontFamily: Fonts.POPPINS_MEDIUM,
    color: Colors.DEFAULT_WHITE,
  },
});

export default ModifyScreen