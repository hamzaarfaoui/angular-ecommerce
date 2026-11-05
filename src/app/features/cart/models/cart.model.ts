import { Book } from '../../books/models/book.model';

export interface CartItem {
  book: Book;
  quantity: number;
}