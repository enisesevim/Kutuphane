import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchBooks } from '../store/bookSlice';
import { Book, RootStackParamList } from '../types/types';
import Icon from 'react-native-vector-icons/Ionicons';

type BookListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BookList'>;

export const BookListScreen = () => {
  const navigation = useNavigation<BookListScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { books, status, error } = useSelector((state: RootState) => state.books);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm) ||
      book.authors.some((author) =>
        author.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const renderBookItem = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
    >
      <Image 
        source={{ uri: item.coverImage }} 
        style={styles.bookCover}
        defaultSource={require('../assets/kitapp.png')}
      />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthors}>{item.authors.map((author) => author.name).join(', ')}</Text>
        <Text style={styles.bookGenre}>{item.genre}</Text>
      </View>
    </TouchableOpacity>
  );

  if (status === 'loading') return <Text style={styles.statusText}>Yükleniyor...</Text>;
  if (status === 'failed') return <Text style={styles.statusText}>Hata: {error}</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Kitap Ara..."
        />
      </View>
      <FlatList
        data={filteredBooks}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddEditBook')}
      >
        <Icon name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  bookItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    elevation: 2,
  },
  bookCover: {
    width: 70,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 5,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bookAuthors: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  bookGenre: {
    fontSize: 12,
    color: '#999',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#12a4ff',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  statusText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default BookListScreen;
