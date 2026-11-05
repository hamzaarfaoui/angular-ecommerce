export interface Book {
  id: number;
  title: string;
  category?: string;
  content?: string;       // Utilisé à la place de description
  description?: string;   // Optionnel pour rétrocompatibilité
  image?: string;
  price: string | number;
  rating?: string;
  stock?: number;
  user?: number;
  created_at?: string;
  updated_at?: string;
  reviews?: any[];
}

export interface PaginatedBooksResponse {
  books: Book[];
  per_page: number;
  total: number;
}

export interface BookFilters {
  keyword?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
}