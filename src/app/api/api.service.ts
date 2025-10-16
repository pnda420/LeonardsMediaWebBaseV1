import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserRole } from '../services/auth.service';


// ==================== INTERFACES ====================

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

export interface PageAiMockupDto {
  form?: any; // Das komplette Form-Objekt
  customerType?: string;
  projectName?: string;
  companyName?: string;
  typeOfWebsite?: string;
  primaryColor?: string;
  designStyle?: string;
  contentInformation?: string;
  userId?: string;
  userEmail?: string;
  generatedAt?: string;
}

export interface PageAiMockupResponse {
  ok: boolean;
  html: string;
  rawLength: number;
  pageId?: string;
  savedPage?: GeneratedPage;
  metadata?: {
    quality: string;
    tokensUsed: number;
    model: string;
    generatedAt: string;
    projectName: string;
    websiteType: string;
  };
}

export interface BookingSlot {
  id: string;
  date: string; // YYYY-MM-DD
  timeFrom: string; // HH:MM
  timeTo: string; // HH:MM
  isAvailable: boolean;
  maxBookings: number;
  currentBookings: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBookingSlotDto {
  date: string;
  timeFrom: string;
  timeTo: string;
  maxBookings?: number;
  isAvailable?: boolean;
}

export interface UpdateBookingSlotDto {
  date?: string;
  timeFrom?: string;
  timeTo?: string;
  isAvailable?: boolean;
  maxBookings?: number;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  slotId: string;
  slot?: BookingSlot;
  status: BookingStatus;
  adminNotes: string | null;
  createdAt: Date;
}

export interface CreateBookingDto {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  slotId: string;
}

export interface UpdateBookingDto {
  status?: BookingStatus;
  adminNotes?: string;
}

// Hilfs-Interface für das Frontend
export interface DayWithSlots {
  date: string;
  dayName: string;
  dayNumber: number;
  available: boolean;
  slots: BookingSlot[];
  isPast: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: Date;
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

  generateWebsiteMockup(
    dto: PageAiMockupDto,
    quality: 'fast' | 'balanced' | 'premium' = 'balanced'
  ): Observable<PageAiMockupResponse> {
    return this.http.post<PageAiMockupResponse>(
      `${this.apiUrl}/page-ai/mockup?quality=${quality}`,
      dto,
      { headers: this.getHeaders() }
    );
  }

  generateWebsiteMockupPublic(
    dto: PageAiMockupDto,
    quality: 'fast' | 'balanced' | 'premium' = 'balanced'
  ): Observable<PageAiMockupResponse> {
    return this.http.post<PageAiMockupResponse>(
      `${this.apiUrl}/page-ai/mockup-public?quality=${quality}`,
      dto,
    );
  }

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
  subscribeNewsletterUser(dto: NewsletterSubscribeDto): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/users/newsletter/subscribe`,
      dto,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Newsletter abmelden
   */
  unsubscribeNewsletterUser(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/users/newsletter/unsubscribe`,
      { email },
      { headers: this.getHeaders() }
    );
  }

  /**
   * Alle Newsletter-Abonnenten abrufen (Admin)
   */
  getNewsletterUserSubscribers(): Observable<User[]> {
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

  // ==================== BOOKING SLOTS ENDPOINTS ====================

  /**
   * Verfügbare Slots abrufen (öffentlich)
   */
  getAvailableBookingSlots(fromDate?: string): Observable<BookingSlot[]> {
    let params = new HttpParams();
    if (fromDate) {
      params = params.set('fromDate', fromDate);
    }
    return this.http.get<BookingSlot[]>(`${this.apiUrl}/bookings/slots/available`, { params });
  }

  /**
   * Slots für ein bestimmtes Datum abrufen (öffentlich)
   */
  getBookingSlotsByDate(date: string): Observable<BookingSlot[]> {
    return this.http.get<BookingSlot[]>(`${this.apiUrl}/bookings/slots/date/${date}`);
  }

  /**
   * Alle Slots abrufen (Admin)
   */
  getAllBookingSlots(): Observable<BookingSlot[]> {
    return this.http.get<BookingSlot[]>(`${this.apiUrl}/bookings/slots`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Einzelnen Slot erstellen (Admin)
   */
  createBookingSlot(dto: CreateBookingSlotDto): Observable<BookingSlot> {
    return this.http.post<BookingSlot>(`${this.apiUrl}/bookings/slots`, dto, {
      headers: this.getHeaders()
    });
  }

  /**
   * Mehrere Slots auf einmal erstellen (Admin)
   */
  createMultipleBookingSlots(slots: CreateBookingSlotDto[]): Observable<BookingSlot[]> {
    return this.http.post<BookingSlot[]>(
      `${this.apiUrl}/bookings/slots/bulk`,
      { slots },
      { headers: this.getHeaders() }
    );
  }

  /**
   * Slot aktualisieren (Admin)
   */
  updateBookingSlot(id: string, dto: UpdateBookingSlotDto): Observable<BookingSlot> {
    return this.http.patch<BookingSlot>(`${this.apiUrl}/bookings/slots/${id}`, dto, {
      headers: this.getHeaders()
    });
  }

  /**
   * Slot löschen (Admin)
   */
  deleteBookingSlot(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/bookings/slots/${id}`, {
      headers: this.getHeaders()
    });
  }

  // ==================== BOOKINGS ENDPOINTS ====================

  /**
   * Booking erstellen (öffentlich)
   */
  createBooking(dto: CreateBookingDto): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/bookings`, dto);
  }

  /**
   * Alle Bookings abrufen (Admin)
   */
  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Einzelne Booking abrufen (Admin)
   */
  getBooking(id: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/bookings/${id}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Booking aktualisieren (Admin)
   */
  updateBooking(id: string, dto: UpdateBookingDto): Observable<Booking> {
    return this.http.patch<Booking>(`${this.apiUrl}/bookings/${id}`, dto, {
      headers: this.getHeaders()
    });
  }

  /**
   * Booking stornieren (Admin)
   */
  cancelBooking(id: string): Observable<Booking> {
    return this.http.patch<Booking>(`${this.apiUrl}/bookings/${id}/cancel`, {}, {
      headers: this.getHeaders()
    });
  }

  /**
   * Booking löschen (Admin)
   */
  deleteBooking(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/bookings/${id}`, {
      headers: this.getHeaders()
    });
  }


  // ==================== NEWSLETTER ENDPOINTS ====================

  /**
   * Newsletter abonnieren (öffentlich)
   */
  subscribeNewsletter(email: string): Observable<{ success: boolean; message: string; email: string }> {
    return this.http.post<{ success: boolean; message: string; email: string }>(
      `${this.apiUrl}/newsletter/subscribe`,
      { email }
    );
  }

  /**
   * Newsletter abmelden (öffentlich)
   */
  unsubscribeNewsletter(email: string): Observable<{ success: boolean; message: string }> {
    const params = new HttpParams().set('email', email);
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.apiUrl}/newsletter/unsubscribe`,
      { params }
    );
  }

  /**
   * Alle Newsletter-Abonnenten abrufen (Admin)
   */
  getNewsletterSubscribers(): Observable<{ count: number; subscribers: any[] }> {
    return this.http.get<{ count: number; subscribers: any[] }>(
      `${this.apiUrl}/newsletter/subscribers`,
      { headers: this.getHeaders() }
    );
  }


}