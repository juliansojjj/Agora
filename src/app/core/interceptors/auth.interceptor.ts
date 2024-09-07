import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalAuthService } from '../../services/local-auth.service';



export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(LocalAuthService)
  const token = authService.getTokenFromCookie();

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }



  return next(req);
};

//TODO:AGREGAR MANEJO ERRORES https://youtu.be/cHcpenjrpXw
