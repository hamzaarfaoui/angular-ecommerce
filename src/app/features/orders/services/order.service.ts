import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateOrderRequest, Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/orders`;

  // Passer une nouvelle commande
  createOrder(orderData: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/new`, orderData);
  }

  // Obtenir la liste de toutes les commandes
  getOrders(): Observable<{ orders: Order[] }> {
    return this.http.get<{ orders: Order[] }>(this.apiUrl);
  }

  // Obtenir les détails d'une commande par ID
  getOrderById(id: string | number): Observable<{ order: Order }> {
    return this.http.get<{ order: Order }>(`${this.apiUrl}/${id}`);
  }
}