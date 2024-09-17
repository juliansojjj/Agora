import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req)/*.pipe(catchError(errorHandle))*/
};

function errorHandle(error:HttpErrorResponse){
  let errorMessage = ''

   
    if(error.error){
      console.log('error client')
      errorMessage = `Client side error:${error.message}`
    }else{
      console.log('error server')
      errorMessage = `Server side error:${error.message}`
    }

    return throwError(()=>new Error(errorMessage))
}