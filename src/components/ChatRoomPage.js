```jsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

const ChatRoomPage = ({ navigation }) => {


  fwnjfnejfewnjnwfjwe
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Chat Room Page</Text>
      <Button
        title="Go to Home Page"
        onPress={() => navigation.navigate('HomePage')}
      />
      <Button
        title="Go to Profile Page"
        onPress={() => navigation.navigate('ProfilePage')}
      />
      <Button
        title="Go to Settings Page"
        onPress={() => navigation.navigate('SettingsPage')}
      />
    </View>
  );
};

export default ChatRoomPage;
```