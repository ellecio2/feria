import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators'
import { CookieService } from 'ngx-cookie-service'
import { User } from '@/app/store/authentication/auth.model'

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  user: User | null = null
  public readonly authSessionKey = '_REBACK_AUTH_SESSION_KEY_'
  private cookieService = inject(CookieService)
  
  constructor(private http: HttpClient) {
    // Recuperar usuario si existe
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
  }
  
  login(email: string, password: string) {
    return this.http.post<User>(`/api/login`, { email, password }).pipe(
      map((user) => {
        if (user && user.token) {
          this.user = user
          this.saveSession(user.token)
        }
        return user
      })
    )
  }
  
  logout(): void {
    this.removeSession()
    localStorage.removeItem('access_token')
    localStorage.removeItem('currentUser')
    this.user = null
  }
  
  get session(): string {
    return this.cookieService.get(this.authSessionKey) || localStorage.getItem('access_token') || ''
  }
  
  saveSession(token: string): void {
    this.cookieService.set(this.authSessionKey, token)
    localStorage.setItem('access_token', token)
  }
  
  removeSession(): void {
    this.cookieService.delete(this.authSessionKey)
  }
  
  getCurrentUser(): User | null {
    return this.user || JSON.parse(localStorage.getItem('currentUser') || '{}')
  }
  
  hasRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user && user.role ? roles.includes(user.role) : false;
  }
}
