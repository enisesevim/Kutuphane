import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../types/types';
import Icon from 'react-native-vector-icons/Ionicons';

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

export const SignUpScreen = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (!name || !surname || !username || !phone || !gender || !password || !confirmPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor');
      return;
    }

    try {
      const newUser = { name, surname, username, phone, gender, password };
      await AsyncStorage.setItem(username, JSON.stringify(newUser));
      Alert.alert('Başarılı', 'Kayıt işlemi tamamlandı', [
        { text: 'Tamam', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      Alert.alert('Hata', 'Kayıt işlemi sırasında bir hata oluştu');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.title}>Kayıt Ol</Text>
          <View style={styles.inputContainer}>
            <Icon name="person-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Ad"
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="person-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Soyad"
              value={surname}
              onChangeText={setSurname}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="at-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Kullanıcı Adı"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="call-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Telefon (555-555-5555)"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.genderContainer}>
            <Text style={styles.genderLabel}>Cinsiyet:</Text>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'Kadın' && styles.genderButtonActive]}
              onPress={() => setGender('Kadın')}
            >
              <Text style={[styles.genderButtonText, gender === 'Kadın' && styles.genderButtonTextActive]}>Kadın</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'Erkek' && styles.genderButtonActive]}
              onPress={() => setGender('Erkek')}
            >
              <Text style={[styles.genderButtonText, gender === 'Erkek' && styles.genderButtonTextActive]}>Erkek</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Icon name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Şifre"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Şifre Tekrar"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Kayıt Ol</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  genderLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  genderButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#12a4ff',
    marginHorizontal: 5,
  },
  genderButtonActive: {
    backgroundColor: '#12a4ff',
  },
  genderButtonText: {
    color: '#12a4ff',
  },
  genderButtonTextActive: {
    color: 'white',
  },
  button: {
    backgroundColor: '#12a4ff',
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
