import React from 'react';
import { View, Text, Button } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const Messages = () => {
  const navigation = useNavigation();

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View>
      <Text>Messages Page</Text>
      
      <TouchableOpacity onPress={() => navigateToScreen('Home')}>
        <Text>Go to Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigateToScreen('Profile')}>
        <Text>Go to Profile</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigateToScreen('Settings')}>
        <Text>Go to Settings</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigateToScreen('Messages')}>
        <Text>Go to Messages</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigateToScreen('Notifications')}>
        <Text>Go to Notifications</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigateToScreen('Search')}>
        <Text>Go to Search</Text>
      </TouchableOpacity>
    </View>
  );
};