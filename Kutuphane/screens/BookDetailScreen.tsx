import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { removeBook } from '../store/bookSlice';
import { Book, RootStackParamList } from '../types/types';
import Icon from 'react-native-vector-icons/Ionicons';

type BookDetailScreenRouteProp = RouteProp<RootStackParamList, 'BookDetail'>;
type BookDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BookDetail'>;

export const BookDetailScreen = () => {
  const route = useRoute<BookDetailScreenRouteProp>();
  const navigation = useNavigation<BookDetailScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { bookId } = route.params;

  const { books, status, error } = useSelector((state: RootState) => state.books);
  const book = books.find((b) => b.id === bookId);

  if (status === 'loading') return <View style={styles.container}><Text style={styles.statusText}>Yükleniyor...</Text></View>;
  if (status === 'failed') return <View style={styles.container}><Text style={styles.statusText}>Hata: {error}</Text></View>;
  if (!book) return <View style={styles.container}><Text style={styles.statusText}>Kitap bulunamadı</Text></View>;

  const handleDeleteBook = () => {
    Alert.alert(
      "Kitabı Sil",
      "Bu kitabı silmek istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        { text: "Sil", style: "destructive", onPress: () => {
          dispatch(removeBook(bookId))
            .unwrap()
            .then(() => {
              Alert.alert('Başarılı', 'Kitap başarıyla silindi');
              navigation.goBack();
            })
            .catch((err) => {
              Alert.alert('Hata', 'Kitap silinirken bir hata oluştu');
            });
        }}
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: book.coverImage }} 
          style={styles.coverImage}
          defaultSource={require('../assets/kitapp.png')}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.authors}>
          {book.authors.map(author => author.name).join(', ')}
        </Text>
        <View style={styles.detailRow}>
          <Icon name="bookmark-outline" size={20} color="#666" />
          <Text style={styles.detailText}>{book.genre}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="barcode-outline" size={20} color="#666" />
          <Text style={styles.detailText}>{book.isbn}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
      <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('AddEditBook', { book })}
        >
          <Icon name="create-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Düzenle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDeleteBook}
        >
          <Icon name="trash-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Sil</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  imageContainer: {
    height: 300,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  coverImage: {
    width: '80%',
    height: '90%',
    resizeMode: 'contain',
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 15,
    padding: 15,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  authors: {
    fontSize: 18,
    color: '#666',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: '#4dd686',
  },
  deleteButton: {
    backgroundColor: '#ff524f',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  statusText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default BookDetailScreen;

