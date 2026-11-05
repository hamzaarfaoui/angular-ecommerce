import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../cart/services/cart.service';
import { OrderService } from '../../services/order.service';
import { CreateOrderRequest } from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  public cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  isSubmitting = false;
  errorMessage = '';

  // Formulaire avec les champs obligatoires demandés par la vue Django
  checkoutForm = this.fb.group({
    street: ['', [Validators.required]],
    city: ['', [Validators.required]],
    zip_code: ['', [Validators.required]],
    country: ['', [Validators.required]],
    phone_no: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.checkoutForm.invalid || this.cartService.items().length === 0) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    // Transformation des items du panier au format attendu par Django ('order_Items')
    const orderItems = this.cartService.items().map(item => ({
      book: item.book.id,
      quantity: item.quantity
    }));

    const payload: CreateOrderRequest = {
      street: this.checkoutForm.value.street!,
      city: this.checkoutForm.value.city!,
      zip_code: this.checkoutForm.value.zip_code!,
      country: this.checkoutForm.value.country!,
      phone_no: this.checkoutForm.value.phone_no!,
      order_Items: orderItems
    };

    this.orderService.createOrder(payload).subscribe({
      next: (createdOrder) => {
        this.isSubmitting = false;
        this.cartService.clearCart(); // Vider le panier
        this.router.navigate(['/orders', createdOrder.id]); // Rediriger vers la confirmation
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Erreur lors de la commande:', err);
        this.errorMessage = err.error?.error || 'Une erreur est survenue lors de la création de la commande.';
      }
    });
  }
}