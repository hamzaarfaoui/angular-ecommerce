import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { BookService } from '../../services/book.service';
import { CartService } from '../../../cart/services/cart.service';
import { Book } from '../../models/book.model';
import { environment } from '../../../../../environments/environment';

// Type pour la réponse encapsulée
interface BookDetailResponse {
  data: Book;
}

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private bookService = inject(BookService);
  private cartService = inject(CartService);

  book: Book | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';
  addedToCartSuccess: boolean = false;

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        this.isLoading = true;
        this.errorMessage = '';
        return this.bookService.getBookById(id);
      })
    ).subscribe({
      next: (response: any) => {
        // Extraction de "data" depuis la réponse de l'API
        this.book = response.data ? response.data : response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement détails du livre:', err);
        this.errorMessage = 'Impossible de trouver le livre demandé.';
        this.isLoading = false;
      }
    });
  }

  getBookImageUrl(imageUrl?: string): string {
    if (!imageUrl) {
      return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="280" viewBox="0 0 200 280"><rect width="100%" height="100%" fill="%23f0f0f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%23888888">Pas d%27image</text></svg>';
    }
    
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    const baseUrl = environment.baseUrl; 
    return `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  }

  addToCart(): void {
    if (this.book) {
      this.cartService.addToCart(this.book);
      this.addedToCartSuccess = true;
      setTimeout(() => (this.addedToCartSuccess = false), 2500);
    }
  }

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.onerror = null; 
    target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="280" viewBox="0 0 200 280"><rect width="100%" height="100%" fill="%23f0f0f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%23888888">Pas d%27image</text></svg>';
  }
}