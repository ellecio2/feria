import { User } from "@/app/store/authentication/auth.model"
import { Injectable } from '@angular/core'
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpHeaders,
} from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { environment } from '../../environments/environment'


@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    
    // Solo interceptar llamadas a /api
    if (!request.url.includes('/api/')) {
      return next.handle(request);
    }

    // Obtener el token del localStorage
    const token = localStorage.getItem('access_token');
    
    // Construir la URL real
    const apiEndpoint = request.url.replace('/api/', '/');
    const fullUrl = `${this.apiUrl}${apiEndpoint}`;

    // Clonar la petición con la nueva URL y headers
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token && !request.url.includes('/auth/')) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const apiReq = request.clone({
      url: fullUrl,
      headers: headers
    });

    // Manejar login especialmente
    if (request.url.endsWith('/api/login') && request.method === 'POST') {
      return this.http.post<any>(`${this.apiUrl}/auth/login`, request.body).pipe(
        map(response => {
          if (response && response.access_token) {
            // Guardar token y usuario
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            
            // Retornar en el formato esperado por el template
            return new HttpResponse({
              status: 200,
              body: {
                ...response.user,
                token: response.access_token,
                name: response.user.firstName + ' ' + response.user.lastName
              }
            });
          }
          return new HttpResponse({ status: 200, body: response });
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError({ 
            status: error.status || 400, 
            error: { message: error.error?.message || 'Error al iniciar sesión' } 
          });
        })
      );
    }

    // Manejar registro
    if (request.url.endsWith('/api/signup') && request.method === 'POST') {
      const [firstName, lastName] = request.body?.name?.split(' ') || ['', ''];
      const registerData = {
        ...request.body,
        firstName,
        lastName,
        role: 'cliente' // Rol por defecto
      };

      return this.http.post<any>(`${this.apiUrl}/auth/register`, registerData).pipe(
        map(response => {
          return new HttpResponse({
            status: 200,
            body: response
          });
        }),
        catchError(error => {
          return throwError({ 
            status: error.status || 400, 
            error: { message: error.error?.message || 'Error al registrar usuario' } 
          });
        })
      );
    }

    // Para todas las demás peticiones, enviarlas a la API real
    return this.http.request(apiReq.method, apiReq.url, {
      body: apiReq.body,
      headers: apiReq.headers,
      observe: 'response',
      responseType: 'json'
    }).pipe(
      map(response => {
        return response;
      }),
      catchError(error => {
        // Si es error 401, limpiar sesión
        if (error.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('currentUser');
        }
        return throwError(error);
      })
    );
  }
}

export let FakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true,
}
