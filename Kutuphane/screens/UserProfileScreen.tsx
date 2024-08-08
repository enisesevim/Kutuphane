import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

type UserProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'UserProfile'>;

export const UserProfileScreen = () => {
  const navigation = useNavigation<UserProfileScreenNavigationProp>();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userJson = await AsyncStorage.getItem('loggedInUser');
      if (userJson) {
        setUserData(JSON.parse(userJson));
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('loggedInUser');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Çıkış yapılırken bir hata oluştu:', error);
    }
  };

  if (!userData) {
    return <Text>Yükleniyor...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }} 
          style={styles.profileImage}
        />
        <Text style={styles.name}>{userData.name} {userData.surname}</Text>
        <Text style={styles.username}>@{userData.username}</Text>
      </View>

      <View style={styles.infoContainer}>
        <InfoItem icon="call-outline" label="Telefon" value={userData.phone} />
        <InfoItem icon="male-female-outline" label="Cinsiyet" value={userData.gender} />
        {/* Add more info items as needed */}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out-outline" size={24} color="white" />
        <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const InfoItem = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.infoItem}>
    <Icon name={icon} size={24} color="#333" style={styles.infoIcon} />
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  username: {
    fontSize: 16,
    color: '#666',
  },
  infoContainer: {
    backgroundColor: '#fff',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  infoIcon: {
    marginRight: 15,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#ff524f',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 10,
  },
});

export default UserProfileScreen;
