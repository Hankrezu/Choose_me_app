import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../contants';
import Separator from './Separator';

const AddressCard = ({ name, phone, address, type }) => {
  return (
    <View>
      <View style={styles.container}>
        <View style={styles.labelContainer}>
          <Text style={styles.titleText}>Name: {name}</Text>
          <Text style={styles.infoText}>Phone: {phone}</Text>
          <Text style={styles.infoText}>Address: {address}</Text>
          <Text style={styles.infoText}>Type: {type}</Text>
        </View>
      </View>
      <Separator height={5} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.DEFAULT_WHITE,
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
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
  infoText: {
    fontSize: 13,
    lineHeight: 13 * 1.4,
    fontFamily: Fonts.POPPINS_REGULAR,
    color: Colors.DEFAULT_GREY,
    marginBottom: 5,
  },
});

export default AddressCard;
