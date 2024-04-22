const Settings = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <Button 
        title="Go to Home"
        onPress={() => navigation.navigate('Home')}
      />
      <Button 
        title="Go to Profile"
        onPress={() => navigation.navigate('Profile')}
      />
      <Button 
        title="Go to Messages"
        onPress={() => navigation.navigate('Messages')}
      />
      <Button 
        title="Go to Notifications"
        onPress={() => navigation.navigate('Notifications')}
      />
      <Button 
        title="Go to Search"
        onPress={() => navigation.navigate('Search')}
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

export default Settings;