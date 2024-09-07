import { Routes } from '@angular/router';
import { ArticleComponent } from './features/articles/article/article.component';
import { HomeArticlesComponent } from './features/articles/components/home-articles/home-articles.component';
import { CategoryArticlesComponent } from './features/articles/components/category-articles/category-articles.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';

export const routes: Routes = [
    {path:'', loadComponent: () =>
        import('./features/articles/components/home-articles/home-articles.component').then((c) => c.HomeArticlesComponent)},
    {path:'article/:id', component:ArticleComponent},
    {path:'category/:title', component:CategoryArticlesComponent},
    {path:'**', component:NotFoundComponent},
];
