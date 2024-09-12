import { Routes } from '@angular/router';
import { ArticleComponent } from './features/articles/components/article.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';

export const routes: Routes = [
    {path:'', loadComponent: () =>
        import('./features/articles/components/home-articles/home-articles.component').then((c) => c.HomeArticlesComponent)},
    {path:'article/:id', component:ArticleComponent},
    {path:'', loadComponent: () =>
        import('./features/articles/components/category-articles/category-articles.component').then((c) => c.CategoryArticlesComponent)},

    {path:'login', component:LoginComponent},
    {path:'register', component:SignupComponent},

    {path:'**', component:NotFoundComponent},
];
