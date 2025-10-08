import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


// ==================== INTERFACES ====================

export interface User {
  id: string;
  email: string;
  name: string;
  wantsNewsletter: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  wantsNewsletter?: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token?: string; // Später wenn JWT implementiert ist
}

export interface NewsletterSubscribeDto {
  email: string;
  name?: string;
}

export interface UpdateUserDto {
  name?: string;
  wantsNewsletter?: boolean;
}

export interface UserStats {
  totalUsers: number;
  newsletterSubscribers: number;
  subscriberRate: number;
}

// Generated Pages
export interface GeneratedPage {
  id: string;
  userId: string;
  name: string;
  pageContent: string;
  description?: string;
  isPublished: boolean;
  previewUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGeneratedPageDto {
  userId: string;
  name: string;
  pageContent: string;
  description?: string;
  isPublished?: boolean;
  previewUrl?: string;
}

export interface UpdateGeneratedPageDto {
  name?: string;
  pageContent?: string;
  description?: string;
  isPublished?: boolean;
  previewUrl?: string;
}

// Contact Requests
export enum ServiceType {
  NOT_SURE = 'not_sure',
  SIMPLE_WEBSITE = 'simple_website',
  STANDARD_WEBSITE = 'standard_website',
  INDIVIDUAL_WEBSITE = 'individual_website',
  SEO = 'seo'
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  serviceType: ServiceType;
  message: string;
  prefersCallback: boolean;
  phoneNumber?: string;
  isProcessed: boolean;
  notes?: string;
  userId?: string;
  createdAt: Date;
}

export interface CreateContactRequestDto {
  name: string;
  email: string;
  serviceType: ServiceType;
  message: string;
  prefersCallback?: boolean;
  phoneNumber?: string;
  userId?: string;
}

export interface UpdateContactRequestDto {
  isProcessed?: boolean;
  notes?: string;
}

// ==================== SERVICE ====================

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Später: JWT Token aus LocalStorage holen und hinzufügen
    // const token = localStorage.getItem('auth_token');
    // if (token) {
    //   headers = headers.set('Authorization', `Bearer ${token}`);
    // }

    return headers;
  }

  // ==================== USER ENDPOINTS ====================

  /**
   * User registrieren
   */
  register(dto: CreateUserDto): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/register`, dto, {
      headers: this.getHeaders()
    });
  }

  /**
   * User login
   */
  login(dto: LoginDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/users/login`, dto, {
      headers: this.getHeaders()
    });
  }

  /**
   * Alle User abrufen (Admin)
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Einzelnen User abrufen
   */
  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * User aktualisieren
   */
  updateUser(id: string, dto: UpdateUserDto): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${id}`, dto, {
      headers: this.getHeaders()
    });
  }

  /**
   * User löschen
   */
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * User-Statistiken abrufen
   */
  getUserStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.apiUrl}/users/stats`, {
      headers: this.getHeaders()
    });
  }

  // ==================== NEWSLETTER ENDPOINTS ====================

  /**
   * Newsletter abonnieren
   */
  subscribeNewsletter(dto: NewsletterSubscribeDto): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/users/newsletter/subscribe`,
      dto,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Newsletter abmelden
   */
  unsubscribeNewsletter(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/users/newsletter/unsubscribe`,
      { email },
      { headers: this.getHeaders() }
    );
  }

  /**
   * Alle Newsletter-Abonnenten abrufen (Admin)
   */
  getNewsletterSubscribers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users/newsletter/subscribers`, {
      headers: this.getHeaders()
    });
  }

  // ==================== GENERATED PAGES ENDPOINTS ====================

  /**
   * Neue generierte Page erstellen
   */
  createGeneratedPage(dto: CreateGeneratedPageDto): Observable<GeneratedPage> {
    return this.http.post<GeneratedPage>(`${this.apiUrl}/generated-pages`, dto, {
      headers: this.getHeaders()
    });
  }

  /**
   * Alle Pages eines Users abrufen
   */
  getUserPages(userId: string): Observable<GeneratedPage[]> {
    return this.http.get<GeneratedPage[]>(
      `${this.apiUrl}/generated-pages/user/${userId}`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Anzahl der Pages eines Users
   */
  getUserPageCount(userId: string): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(
      `${this.apiUrl}/generated-pages/user/${userId}/count`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Alle veröffentlichten Pages abrufen (öffentlich)
   */
  getPublishedPages(): Observable<GeneratedPage[]> {
    return this.http.get<GeneratedPage[]>(`${this.apiUrl}/generated-pages/published`);
  }

  /**
   * Alle generierten Pages abrufen (Admin)
   */
  getAllGeneratedPages(): Observable<GeneratedPage[]> {
    return this.http.get<GeneratedPage[]>(`${this.apiUrl}/generated-pages`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Einzelne Page abrufen
   */
  getGeneratedPage(id: string, userId?: string): Observable<GeneratedPage> {
    let params = new HttpParams();
    if (userId) {
      params = params.set('userId', userId);
    }

    return this.http.get<GeneratedPage>(`${this.apiUrl}/generated-pages/${id}`, {
      headers: this.getHeaders(),
      params
    });
  }

  /**
   * Page aktualisieren
   */
  updateGeneratedPage(
    id: string,
    dto: UpdateGeneratedPageDto,
    userId?: string
  ): Observable<GeneratedPage> {
    let params = new HttpParams();
    if (userId) {
      params = params.set('userId', userId);
    }

    return this.http.patch<GeneratedPage>(
      `${this.apiUrl}/generated-pages/${id}`,
      dto,
      {
        headers: this.getHeaders(),
        params
      }
    );
  }

  /**
   * Page löschen
   */
  deleteGeneratedPage(id: string, userId?: string): Observable<any> {
    let params = new HttpParams();
    if (userId) {
      params = params.set('userId', userId);
    }

    return this.http.delete(`${this.apiUrl}/generated-pages/${id}`, {
      headers: this.getHeaders(),
      params
    });
  }

  // ==================== CONTACT REQUEST ENDPOINTS ====================

  /**
   * Kontaktanfrage senden (öffentlich)
   */
  createContactRequest(dto: CreateContactRequestDto): Observable<ContactRequest> {
    return this.http.post<ContactRequest>(`${this.apiUrl}/contact-requests`, dto, {
      headers: this.getHeaders()
    });
  }

  /**
   * Alle Kontaktanfragen abrufen (Admin)
   */
  getAllContactRequests(): Observable<ContactRequest[]> {
    return this.http.get<ContactRequest[]>(`${this.apiUrl}/contact-requests`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Unbearbeitete Kontaktanfragen abrufen (Admin)
   */
  getUnprocessedContactRequests(): Observable<ContactRequest[]> {
    return this.http.get<ContactRequest[]>(
      `${this.apiUrl}/contact-requests/unprocessed`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Einzelne Kontaktanfrage abrufen
   */
  getContactRequest(id: string): Observable<ContactRequest> {
    return this.http.get<ContactRequest>(`${this.apiUrl}/contact-requests/${id}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Kontaktanfrage aktualisieren (Admin)
   */
  updateContactRequest(
    id: string,
    dto: UpdateContactRequestDto
  ): Observable<ContactRequest> {
    return this.http.patch<ContactRequest>(
      `${this.apiUrl}/contact-requests/${id}`,
      dto,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Kontaktanfrage als bearbeitet markieren (Admin)
   */
  markContactRequestAsProcessed(id: string): Observable<ContactRequest> {
    return this.http.patch<ContactRequest>(
      `${this.apiUrl}/contact-requests/${id}/process`,
      {},
      { headers: this.getHeaders() }
    );
  }

  /**
   * Kontaktanfrage löschen (Admin)
   */
  deleteContactRequest(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/contact-requests/${id}`, {
      headers: this.getHeaders()
    });
  }
}