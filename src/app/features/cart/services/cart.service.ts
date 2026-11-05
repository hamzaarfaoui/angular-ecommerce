import { Injectable, signal, computed } from '@angular/core';
import { Book } from '../../books/models/book.model';
import { CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Signal réactif contenant la liste des éléments du panier
  private cartItemsSignal = signal<CartItem[]>(this.loadCartFromStorage());

  // Exposition en lecture seule
  readonly items = this.cartItemsSignal.asReadonly();

  // Signal calculé pour le nombre total d'articles
  readonly totalCount = computed(() =>
    this.cartItemsSignal().reduce((sum, item) => sum + item.quantity, 0)
  );

  // Signal calculé pour le montant total du panier
  readonly totalPrice = computed(() =>
    this.cartItemsSignal().reduce((sum, item) => {
      const price = typeof item.book.price === 'string' ? parseFloat(item.book.price) : item.book.price;
      return sum + price * item.quantity;
    }, 0)
  );

  addToCart(book: Book, quantity: number = 1): void {
    const currentItems = [...this.cartItemsSignal()];
    const existingIndex = currentItems.findIndex(item => item.book.id === book.id);

    if (existingIndex > -1) {
      currentItems[existingIndex] = {
        ...currentItems[existingIndex],
        quantity: currentItems[existingIndex].quantity + quantity
      };
    } else {
      currentItems.push({ book, quantity });
    }

    this.updateCart(currentItems);
  }

  updateQuantity(bookId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(bookId);
      return;
    }

    const updatedItems = this.cartItemsSignal().map(item =>
      item.book.id === bookId ? { ...item, quantity } : item
    );

    this.updateCart(updatedItems);
  }

  removeFromCart(bookId: number): void {
    const updatedItems = this.cartItemsSignal().filter(item => item.book.id !== bookId);
    this.updateCart(updatedItems);
  }

  clearCart(): void {
    this.updateCart([]);
  }

  private updateCart(items: CartItem[]): void {
    this.cartItemsSignal.set(items);
    localStorage.setItem('cart', JSON.stringify(items));
  }

  private loadCartFromStorage(): CartItem[] {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  }
}