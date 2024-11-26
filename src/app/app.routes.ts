import { Routes } from '@angular/router';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { nonAuthGuard } from './core/guards/non-auth.guard';
import { SingleArticleComponent } from './features/articles/components/single-article/single-article.component';
import { SubscriptionComponent } from './features/subscription/subscription.component';
import { CheckoutComponent } from './features/subscription/checkout/checkout.component';
import { checkoutGuard } from './core/guards/checkout.guard';
import { FavoritesComponent } from './features/user/components/favorites/favorites.component';
import { ProfileComponent } from './features/user/components/profile/profile.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './features/articles/components/home-articles/home-articles.component'
      ).then((c) => c.HomeArticlesComponent),
  },

  {
    path: 'article/:id',
    loadComponent: () =>
      import(
        './features/articles/components/single-article/single-article.component'
      ).then((c) => c.SingleArticleComponent),
  },

  {
    path: 'author/:id',
    loadComponent: () =>
      import(
        './features/articles/components/author/author.component'
      ).then((c) => c.AuthorComponent),
  },

  {
    path: 'category/:title',
    loadComponent: () =>
      import(
        './features/articles/components/category-articles/category-articles.component'
      ).then((c) => c.CategoryArticlesComponent),
  },

  { path: 'subscription', component: SubscriptionComponent, title: 'Subscribe' }, 
  {
    path: 'subscription/checkout',
    component: CheckoutComponent,
    canActivate: [checkoutGuard], 
    title: 'Subscribe', 
  },

  { path: 'login', component: LoginComponent, canActivate: [nonAuthGuard], title: 'Login' },
  { path: 'register', component: SignupComponent, canActivate: [nonAuthGuard], title: 'Register' },

  { path: 'favorites', component: FavoritesComponent, canActivate: [authGuard], title: 'Favorites' },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard], title: 'Profile' },

  { path: '**', component: NotFoundComponent, title: 'Page Not Found' },

];