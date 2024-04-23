import React from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProfilePage = () => {
    const navigation = useNavigation();

    const goToHomePage = () => {
        navigation.navigate('HomePage');
    }

    const goToChatRoomPage = () => {
        navigation.navigate('ChatRoomPage');
    }

    const goToSettingsPage = () => {
        navigation.navigate('SettingsPage');
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile Page</Text>
            <TouchableOpacity onPress={goToHomePage} style={styles.button}>
                <Text style={styles.buttonText}>Go to Home Page</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToChatRoomPage} style={styles.button}>
                <Text style={styles.buttonText}>Go to Chat Room Page</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToSettingsPage} style={styles.button}>
                <Text style={styles.buttonText}>Go to Settings Page</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        margin: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default ProfilePage;