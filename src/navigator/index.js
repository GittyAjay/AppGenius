// App.js

import ProfilePage from '../components/ProfilePage';
import SettingsPage from '../components/SettingsPage';
import ChatRoomPage from '../components/ChatRoomPage';
import HomePage from '../components/HomePage';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
            
                    <Stack.Screen
                        name="HomePage"
                        component={HomePage}
                    />
            
                    <Stack.Screen
                        name="ChatRoomPage"
                        component={ChatRoomPage}
                    />
            
                    <Stack.Screen
                        name="SettingsPage"
                        component={SettingsPage}
                    />
            
                    <Stack.Screen
                        name="ProfilePage"
                        component={ProfilePage}
                    />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
