import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export interface Author {
  id: string;
  name: string;
}

export interface Book {
  id: string;
  title: string;
  isbn: string;
  authors: Author[];
  genre: string;
  coverImage: string;
  description: string;
}

export type RootStackParamList = {
  BookListTabs: undefined;
  BookList: undefined;
  BookDetail: { bookId: string };
  AddEditBook: { book?: Book } | undefined;
  Login: undefined;
  SignUp: undefined;
  UserProfile: undefined; 
  
};

export type BookListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BookList'>;
export type BookDetailScreenRouteProp = RouteProp<RootStackParamList, 'BookDetail'>;
export type BookDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BookDetail'>;
export type AddEditBookScreenRouteProp = RouteProp<RootStackParamList, 'AddEditBook'>;
export type AddEditBookScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddEditBook'>;


