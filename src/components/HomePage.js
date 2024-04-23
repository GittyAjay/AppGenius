import React from 'react';
import { View, Text, Button } from 'react-native';

const HomePage = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to the Chat App!</Text>
      <Button
        title="Go to Chat Room"
        onPress={() => navigation.navigate('ChatRoomPage')}
      />
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('ProfilePage')}
      />
      <Button
        title="Go to Settings"
        onPress={() => navigation.navigate('SettingsPage')}
      />
    </View>
  );
};

export default HomePage;