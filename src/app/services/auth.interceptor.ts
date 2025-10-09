import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Token direkt aus localStorage holen (kein AuthService!)
        const token = localStorage.getItem('access_token');

        console.log('🔍 Interceptor läuft!');
        console.log('📍 URL:', req.url);
        console.log('🔑 Token vorhanden:', !!token);

        if (token) {
            console.log('✅ Token wird hinzugefügt');

            const cloned = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });

            return next.handle(cloned);
        }

        console.log('⚠️ Kein Token - Request ohne Auth');
        return next.handle(req);
    }
}