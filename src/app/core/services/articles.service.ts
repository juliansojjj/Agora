import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { catchError, firstValueFrom, map, Observable, switchMap, throwError } from "rxjs";
import { Article } from "../../shared/interfaces/article.interface";
import { Comment } from "../../shared/interfaces/comment.interface";

@Injectable()
export default class ArticlesService{
    private http = inject(HttpClient)
    // private auth = inject(AuthService)
    private token: string | null = null;
    private platformId = inject(PLATFORM_ID);


    // getNews(): Observable<Article[]> {
    //   return this.auth.getAccessTokenSilently().pipe(
    //     switchMap((token) => {
    //       const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    //       return this.http
    //         .get<Article[]>(`${environment.NEWS_API_URL}/api/articles/articles`, { headers })
    //         .pipe(catchError(this.handleError));
    //     })
    //   );
    // }
    
    getNews():Observable<Article[]>{
        return this.http.get<Article[]>(`${environment.NEWS_API_URL}/api/articles/articles`)
        .pipe(catchError(this.handleError))
    }
    
    getCategoryArticles(title:string):Observable<Article[]>{
        return this.http.get<Article[]>(`${environment.NEWS_API_URL}/api/articles/articles/${title}`)
        .pipe(catchError(this.handleError))
    }




    //Single Article ---------------------------------------------------------------------------
    
    getArticle(id:string):Observable<Article>{
        return this.http.get<Article[]>(`${environment.NEWS_API_URL}/api/articles/article/${id}`)
        .pipe(catchError(this.handleError),map(item=>item[0]))
    }

    getArticleComments(id:number):Observable<Comment[]>{
      return this.http.get<Comment[]>(`${environment.NEWS_API_URL}/api/comments/comments/${id}`)
      .pipe(catchError(this.handleError))
  }






    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage :string
        if (error.status === 0) {
          // Client-side error
          errorMessage = `${error.message}`;
        } else {
          // Server-side error
          errorMessage = `Code ${error.status}\nThere was a server error, please try again later!`;
        }
        return throwError(() => new Error(errorMessage));
      }
    
}