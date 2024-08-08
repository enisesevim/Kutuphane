import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { saveBook } from '../store/bookSlice';
import { Book, Author, RootStackParamList } from '../types/types';
import Icon from 'react-native-vector-icons/Ionicons';

type AddEditBookScreenRouteProp = RouteProp<RootStackParamList, 'AddEditBook'>;
type AddEditBookScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddEditBook'>;

export const AddEditBookScreen = () => {
  const route = useRoute<AddEditBookScreenRouteProp>();
  const navigation = useNavigation<AddEditBookScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();

  const bookToEdit = route.params?.book;

  const [title, setTitle] = useState(bookToEdit?.title || '');
  const [isbn, setIsbn] = useState(bookToEdit?.isbn || '');
  const [authors, setAuthors] = useState(bookToEdit?.authors.map(a => a.name).join(', ') || '');
  const [genre, setGenre] = useState(bookToEdit?.genre || '');
  const [coverImage, setCoverImage] = useState(bookToEdit?.coverImage || '');
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState(bookToEdit?.description || '');

  useEffect(() => {
    if (coverImage) {
      setCoverImagePreview(coverImage);
    }
  }, [coverImage]);

  const handleCoverImageChange = (url: string) => {
    setCoverImage(url);
    setCoverImagePreview(url);
  };

  const handleSave = () => {
    if (!title || !isbn || !authors || !genre || !coverImage || !description) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    const bookData: Book = {
      id: bookToEdit?.id || Date.now().toString(),
      title,
      isbn,
      authors: authors.split(',').map(name => ({ name: name.trim() })) as Author[],
      genre,
      coverImage,
      description,
    };

    dispatch(saveBook(bookData))
      .unwrap()
      .then(() => {
        Alert.alert('Başarılı', bookToEdit ? 'Kitap başarıyla güncellendi' : 'Kitap başarıyla eklendi');
        navigation.goBack();
      })
      .catch((err) => {
        Alert.alert('Hata', 'Kitap kaydedilirken bir hata oluştu');
      });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.inputContainer}>
          <Icon name="document-text-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            value={description}
            onChangeText={setDescription}
            placeholder="Kitap Tanımı"
            multiline
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="book-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Kitap Adı"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="barcode-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={isbn}
            onChangeText={setIsbn}
            placeholder="ISBN"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="people-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={authors}
            onChangeText={setAuthors}
            placeholder="Yazarlar (virgülle ayırın)"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="pricetag-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={genre}
            onChangeText={setGenre} 
            placeholder="Tür"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="image-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={coverImage}
            onChangeText={handleCoverImageChange}
            placeholder="Kapak Resmi URL"
          />
        </View>
        
        {coverImagePreview && (
          <Image 
            source={{ uri: coverImagePreview }} 
            style={styles.coverImagePreview} 
            onError={() => setCoverImagePreview(null)}
          />
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
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
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  descriptionInput: {
    height: 100, 
  },
  saveButton: {
    backgroundColor: '#12a4ff',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  coverImagePreview: {
    width: 200,
    height: 300,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: 20,
  },
});

export default AddEditBookScreen;
