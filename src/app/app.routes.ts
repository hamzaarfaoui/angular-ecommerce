import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'books/:id',
        loadComponent: () => import('./features/books/components/book-detail/book-detail.component').then(m => m.BookDetailComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/components/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/components/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'profile',
        loadComponent: () => import('./features/auth/components/profile/profile.component').then(m => m.ProfileComponent)
    },
    {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/components/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
    },
    {
        path: 'reset-password',
        loadComponent: () => import('./features/auth/components/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
    },
    {
        path: 'cart',
        loadComponent: () => import('./features/cart/components/cart/cart.component').then(m => m.CartComponent)
    },
    {
        path: 'checkout',
        loadComponent: () => import('./features/orders/components/checkout/checkout.component').then(m => m.CheckoutComponent)
    },
    {
        path: 'orders',
        loadComponent: () => import('./features/orders/components/orders/orders.component').then(m => m.OrdersComponent)
    },
    {
        path: 'orders/:id',
        loadComponent: () => import('./features/orders/components/order-detail/order-detail.component').then(m => m.OrderDetailComponent)
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
