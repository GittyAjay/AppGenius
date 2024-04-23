import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

const SettingsPage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings Page</Text>
      <Button
        title="Go to Home Page"
        onPress={() => navigation.navigate('HomePage')}
      />
      <Button
        title="Go to Chat Room Page"
        onPress={() => navigation.navigate('ChatRoomPage')}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default SettingsPage;