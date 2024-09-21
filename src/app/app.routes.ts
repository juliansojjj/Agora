import { Routes } from '@angular/router';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { authGuard } from './core/guards/auth.guard';
import { SingleArticleComponent } from './features/articles/components/single-article/single-article.component';
import { SubscriptionComponent } from './features/subscription/subscription.component';
import { CheckoutComponent } from './features/subscription/checkout/checkout.component';
import { checkoutGuard } from './core/guards/checkout.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './features/articles/components/home-articles/home-articles.component'
      ).then((c) => c.HomeArticlesComponent),
    title: 'Agora',
  },

  { path: 'article/:id', component: SingleArticleComponent },

  {
    path: 'category/:title',
    loadComponent: () =>
      import(
        './features/articles/components/category-articles/category-articles.component'
      ).then((c) => c.CategoryArticlesComponent),
  },

  { path: 'subscription', component: SubscriptionComponent },
  {
    path: 'subscription/checkout',
    component: CheckoutComponent,
    canActivate: [checkoutGuard],
  },

  { path: 'login', component: LoginComponent, canActivate: [authGuard] },
  { path: 'register', component: SignupComponent, canActivate: [authGuard] },

  { path: '**', component: NotFoundComponent },
];
