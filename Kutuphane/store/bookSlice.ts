import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book } from '../types/types';

interface BookState {
  books: Book[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BookState = {
  books: [],
  status: 'idle',
  error: null
};

export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async () => {
    const booksJSON = await AsyncStorage.getItem('books');
    return booksJSON ? JSON.parse(booksJSON) : [];
  }
);

export const saveBook = createAsyncThunk(
  'books/saveBook',
  async (book: Book, { getState }) => {
    const { books } = (getState() as { books: BookState }).books;
    let updatedBooks;
    if (book.id) {
      updatedBooks = books.map((b) => b.id === book.id ? book : b);
    } else {
      const newBook = { ...book, id: Date.now().toString() };
      updatedBooks = [...books, newBook];
    }
    await AsyncStorage.setItem('books', JSON.stringify(updatedBooks));
    return book;
  }
);

export const removeBook = createAsyncThunk(
  'books/removeBook',
  async (id: string, { getState }) => {
    const { books } = (getState() as { books: BookState }).books;
    const updatedBooks = books.filter((b) => b.id !== id);
    await AsyncStorage.setItem('books', JSON.stringify(updatedBooks));
    return id;
  }
);

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.status = 'succeeded';
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(saveBook.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveBook.fulfilled, (state, action: PayloadAction<Book>) => {
        state.status = 'succeeded';
        const index = state.books.findIndex((book) => book.id === action.payload.id);
        if (index !== -1) {
          state.books[index] = action.payload;
        } else {
          state.books.push(action.payload);
        }
      })
      .addCase(saveBook.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(removeBook.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeBook.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.books = state.books.filter((book) => book.id !== action.payload);
      })
      .addCase(removeBook.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default bookSlice.reducer;

