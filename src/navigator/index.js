// App.js
import Profile from '../components/Profile';
import Messages from '../components/Messages';
import Notifications from '../components/Notifications';
import Settings from '../components/Settings';
import Search from '../components/Search';
import Home from '../components/Home';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
            
                    <Stack.Screen
                        name="Home"
                        component={Home}
                    />
            
                    <Stack.Screen
                        name="Search"
                        component={Search}
                    />
            
                    <Stack.Screen
                        name="Settings"
                        component={Settings}
                    />
            
                    <Stack.Screen
                        name="Notifications"
                        component={Notifications}
                    />
            
                    <Stack.Screen
                        name="Messages"
                        component={Messages}
                    />
            
                    <Stack.Screen
                        name="Profile"
                        component={Profile}
                    />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
