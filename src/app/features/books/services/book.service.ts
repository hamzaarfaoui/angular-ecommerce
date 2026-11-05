import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Book, PaginatedBooksResponse, BookFilters } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/books`;

  getBooks(filters: BookFilters = {}): Observable<PaginatedBooksResponse> {
    let params = new HttpParams();

    if (filters.keyword) params = params.set('keyword', filters.keyword.trim());
    if (filters.category) params = params.set('category', filters.category);
    if (filters.minPrice !== undefined && filters.minPrice !== null) {
      params = params.set('minPrice', filters.minPrice.toString());
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
      params = params.set('maxPrice', filters.maxPrice.toString());
    }
    if (filters.page) params = params.set('page', filters.page.toString());

    return this.http.get<PaginatedBooksResponse>(this.apiUrl, { params });
  }

  // Méthode manquante à ajouter :
  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }
}