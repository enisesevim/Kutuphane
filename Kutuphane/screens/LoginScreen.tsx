import React, { useState } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Alert,Image,KeyboardAvoidingView,Platform,ScrollView,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';
import Icon from 'react-native-vector-icons/Ionicons';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Hata', 'Lütfen kullanıcı adı ve şifre girin');
      return;
    }

    try {
      const userString = await AsyncStorage.getItem(username);
      if (userString) {
        const user = JSON.parse(userString);
        if (user.password === password) {
          await AsyncStorage.setItem('loggedInUser', JSON.stringify(user));
          navigation.navigate('BookListTabs');
        } else {
          Alert.alert('Hata', 'Yanlış şifre');
        }
      } else {
        Alert.alert('Hata', 'Kullanıcı bulunamadı');
      }
    } catch (error) {
      Alert.alert('Hata', 'Giriş işlemi sırasında bir hata oluştu');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/kitap.jpg')} 
            style={styles.logo}
          />
          <Text style={styles.appName}>KitapDünyası</Text>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Icon name="person-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Kullanıcı Adı"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Şifre"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Icon name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#666" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Giriş Yap</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.signUpText}>Hesabınız yok mu? Kayıt Olun</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  loginButton: {
    backgroundColor: '#12a4ff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  signUpText: {
    color: '#12a4ff',
    fontSize: 16,
  },
});

export default LoginScreen;


