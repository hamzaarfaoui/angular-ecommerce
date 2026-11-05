import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { BookService } from '../books/services/book.service';
import { Book, BookFilters, PaginatedBooksResponse } from '../books/models/book.model';
import { AuthService } from '../auth/services/auth.service';
import { environment } from '../../../environments/environment';

interface CategoryOption {
  key: string;
  label: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private bookService = inject(BookService);
  public authService = inject(AuthService);

  private filterSubject = new Subject<BookFilters>();
  private filterSub!: Subscription;

  // Liste des catégories directement dans le composant
  categories: CategoryOption[] = [
    { key: 'Comedy', label: 'Comédie' },
    { key: 'Romance', label: 'Romance' },
    { key: 'Horror', label: 'Horreur' },
    { key: 'Kids', label: 'Enfants' }
  ];

  filters: BookFilters = {
    keyword: '',
    category: '',
    minPrice: undefined,
    maxPrice: undefined,
    page: 1
  };

  books: Book[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  totalBooks: number = 0;
  perPage: number = 2;
  isLoading: boolean = true;
  errorMessage: string = '';

  ngOnInit(): void {
    this.setupFilterStream();
    this.applyFilters();
  }

  setupFilterStream(): void {
    this.filterSub = this.filterSubject.pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      tap(() => (this.isLoading = true)),
      switchMap((filters) => this.bookService.getBooks(filters))
    ).subscribe({
      next: (data: PaginatedBooksResponse) => {
        this.books = data.books;
        this.totalBooks = data.total;
        this.perPage = data.per_page;
        this.totalPages = Math.ceil(this.totalBooks / this.perPage) || 1;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement livres:', err);
        this.errorMessage = 'Impossible de charger les livres.';
        this.isLoading = false;
      }
    });
  }

  onFilterChange(): void {
    this.filters.page = 1;
    this.currentPage = 1;
    this.applyFilters();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.filters.page = page;
      this.currentPage = page;
      this.applyFilters();
    }
  }

  resetFilters(): void {
    this.filters = {
      keyword: '',
      category: '',
      minPrice: undefined,
      maxPrice: undefined,
      page: 1
    };
    this.currentPage = 1;
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filterSubject.next({ ...this.filters });
  }

  getBookImageUrl(imageUrl?: string): string {
  if (!imageUrl) {
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="280" viewBox="0 0 200 280"><rect width="100%" height="100%" fill="%23f0f0f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%23888888">Pas d%27image</text></svg>';
  }
  
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Si l'API renvoie /media/books/cover.jpg
  const baseUrl = environment.baseUrl; 
  return `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
}

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    // Assure qu'on ne boucle pas si le fallback échoue aussi
    target.onerror = null; 
    // Fallback direct avec une image SVG inline (zéro appel HTTP, aucun risque de 404)
    target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="280" viewBox="0 0 200 280"><rect width="100%" height="100%" fill="%23f0f0f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%23888888">Pas d%27image</text></svg>';
    }

  ngOnDestroy(): void {
    if (this.filterSub) {
      this.filterSub.unsubscribe();
    }
  }
}