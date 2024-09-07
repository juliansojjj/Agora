import { inject, Injectable, PLATFORM_ID  } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { jwtRes } from '../shared/interfaces/responses.interface';

@Injectable({
  providedIn: 'root'
})

export class LocalAuthService {
  private http = inject(HttpClient)
  private platformId = inject(PLATFORM_ID);

  constructor() { }

  getToken(): Observable<jwtRes> {
    const body = {
      client_id: environment.AUTH_API_CLIENT_ID,
      client_secret: environment.AUTH_API_CLIENT_SECRET,
      audience: environment.AUTH_API_AUDIENCE,
      grant_type: 'client_credentials'
    };
    return this.http.post<jwtRes>(environment.AUTH_API_URL, body);
  }

  getTokenFromCookie(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const match = document.cookie.match(new RegExp('(^| )auth-token=([^;]+)'));
      return match ? match[2] : null;
    }
    return null;
  }

  saveTokenInCookie(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      document.cookie = `auth-token=${token}; path=/; max-age=3600`; // Configura la cookie
    }
  }



}
