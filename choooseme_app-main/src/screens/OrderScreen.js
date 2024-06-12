import { View, Text } from 'react-native'
import React from 'react'

const OrderScreen = ({ navigation, route: { params: { orderId } } }) => {
    console.log(orderId)
  return (
    <View>
      <Text>OrderScreen</Text>
    </View>
  )
}

export default OrderScreen