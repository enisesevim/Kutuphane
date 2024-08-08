

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import { BookListScreen } from '../src/screens/BookListScreen';
import { BookDetailScreen } from '../src/screens/BookDetailScreen';
import { AddEditBookScreen } from '../src/screens/AddEditBookScreen';
import { LoginScreen } from '../src/screens/LoginScreen';
import { SignUpScreen } from '../src/screens/SignUpScreen';
import { UserProfileScreen } from '../src/screens/UserProfileScreen';
import { RootStackParamList } from '../src/types/types';
import Icon from 'react-native-vector-icons/Ionicons';


const Stack = createStackNavigator<RootStackParamList>();

const Tab = createBottomTabNavigator();


const BookListTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        // @ts-ignore
        return <Icon name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={BookListScreen} 
      options={{ title: 'Kitap Listesi' }}
    />
    <Tab.Screen 
      name="Profile" 
      component={UserProfileScreen} 
      options={{ title: 'Profil' }}
    />
  </Tab.Navigator>
);

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ title: 'Giriş Yap' }} 
          />
          <Stack.Screen 
            name="SignUp" 
            component={SignUpScreen} 
            options={{ title: 'Kayıt Ol' }} 
          />
          <Stack.Screen 
            name="BookListTabs" 
            component={BookListTabs} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="BookDetail" 
            component={BookDetailScreen} 
            options={{ title: 'Kitap Detayı' }} 
          />
          <Stack.Screen 
            name="AddEditBook" 
            component={AddEditBookScreen} 
            options={{ title: 'Kitap Ekle/Düzenle' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}