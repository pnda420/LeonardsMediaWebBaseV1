import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BookingSlot, DayWithSlots, ApiService, CreateBookingDto } from '../../api/api.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // ==================== KONFIGURATION ====================

  /**
   * Mindestvorlaufzeit in Stunden
   * Slots müssen mindestens X Stunden in der Zukunft liegen
   */
  private readonly MIN_HOURS_ADVANCE = 2;

  private readonly MAX_WEEKS = 8; // Maximal 8 Wochen in die Zukunft
  private readonly DAYS_PER_WEEK = 7; // Immer 7 Tage pro Woche anzeigen

  // ==================== STATE ====================

  selectedDate: string = '';
  selectedSlot: BookingSlot | null = null;
  currentWeekIndex: number = 0;
  currentMonthLabel: string = '';
  totalWeeksInMonth: number = 0;
  currentWeekOfMonth: number = 1;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // Success State
  bookingSuccessful: boolean = false;
  bookedSlotDate: string = '';
  bookedSlotTime: string = '';

  availableSlots: BookingSlot[] = [];
  weeks: DayWithSlots[][] = [];
  allSlots: BookingSlot[] = [];

  // Form Data
  bookingData = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  constructor(
    private apiService: ApiService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.loadAvailableSlots();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleString('de-DE', { hour: 'numeric', minute: 'numeric', hour12: false }) || time;
  }

  // ==================== DATA LOADING ====================

  loadAvailableSlots(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const today = new Date().toISOString().split('T')[0];

    this.apiService.getAvailableBookingSlots(today)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (slots) => {
          // Slots filtern: nur zukünftige mit Mindestvorlauf
          const filteredSlots = this.filterValidSlots(slots);
          this.allSlots = filteredSlots;
          this.generateWeeksFromSlots(filteredSlots);
          this.updateWeekLabels();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading slots:', error);
          this.errorMessage = 'Slots konnten nicht geladen werden. Bitte versuche es später erneut.';
          this.isLoading = false;
        }
      });
  }

  /**
   * Filtert Slots nach folgenden Kriterien:
   * - Slot liegt in der Zukunft
   * - Slot liegt mindestens MIN_HOURS_ADVANCE Stunden in der Zukunft
   */
  private filterValidSlots(slots: BookingSlot[]): BookingSlot[] {
    const now = new Date();
    const minDateTime = new Date(now.getTime() + this.MIN_HOURS_ADVANCE * 60 * 60 * 1000);

    return slots.filter(slot => {
      // Slot-DateTime erstellen
      const slotDateTime = this.getSlotDateTime(slot.date, slot.timeFrom);

      // Prüfen ob Slot in der Zukunft liegt und Mindestvorlauf erfüllt
      return slotDateTime >= minDateTime;
    });
  }

  /**
   * Erstellt ein Date-Objekt aus Datum und Uhrzeit
   */
  private getSlotDateTime(date: string, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const slotDate = new Date(date + 'T00:00:00');
    slotDate.setHours(hours, minutes, 0, 0);
    return slotDate;
  }

  generateWeeksFromSlots(slots: BookingSlot[]): void {
    // Slots nach Datum gruppieren
    const slotsByDate = new Map<string, BookingSlot[]>();

    slots.forEach(slot => {
      if (!slotsByDate.has(slot.date)) {
        slotsByDate.set(slot.date, []);
      }
      slotsByDate.get(slot.date)!.push(slot);
    });

    // Startdatum: Heute
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    // Immer am Anfang der Woche starten (Montag)
    const dayOfWeek = startDate.getDay();
    const daysToMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7;
    if (daysToMonday > 0) {
      startDate.setDate(startDate.getDate() - dayOfWeek + 1);
    }

    this.weeks = [];

    // Wochen generieren
    for (let weekIndex = 0; weekIndex < this.MAX_WEEKS; weekIndex++) {
      const week: DayWithSlots[] = [];

      for (let dayIndex = 0; dayIndex < this.DAYS_PER_WEEK; dayIndex++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (weekIndex * 7) + dayIndex);

        const dateStr = currentDate.toISOString().split('T')[0];
        const daySlots = slotsByDate.get(dateStr) || [];

        // Nur validierte Slots für diesen Tag
        const validDaySlots = this.filterValidSlots(daySlots);

        week.push({
          date: dateStr,
          dayName: this.getDayName(currentDate.getDay()),
          dayNumber: currentDate.getDate(),
          available: validDaySlots.length > 0,
          slots: validDaySlots,
          isPast: currentDate < new Date()
        });
      }

      this.weeks.push(week);
    }
  }

  getDayName(dayNumber: number): string {
    const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    return days[dayNumber];
  }

  get currentWeek(): DayWithSlots[] {
    return this.weeks[this.currentWeekIndex] || [];
  }

  updateWeekLabels(): void {
    if (this.currentWeek.length === 0) return;

    const firstDay = new Date(this.currentWeek[0].date + 'T12:00:00');
    const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

    // Aktuellen Monat bestimmen
    this.currentMonthLabel = months[firstDay.getMonth()];

    // Welche Woche des Monats?
    const firstDayOfMonth = new Date(firstDay.getFullYear(), firstDay.getMonth(), 1);
    const weekOfMonth = Math.ceil((firstDay.getDate() + firstDayOfMonth.getDay()) / 7);
    this.currentWeekOfMonth = weekOfMonth;

    // Wie viele Wochen hat dieser Monat insgesamt?
    const lastDayOfMonth = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);
    const weeksInMonth = Math.ceil((lastDayOfMonth.getDate() + firstDayOfMonth.getDay()) / 7);
    this.totalWeeksInMonth = weeksInMonth;
  }

  get weekNavigationLabel(): string {
    if (!this.currentMonthLabel) return '';
    return `${this.currentMonthLabel} Woche ${this.currentWeekOfMonth}/${this.totalWeeksInMonth}`;
  }

  // ==================== NAVIGATION ====================

  previousWeek(): void {
    if (this.currentWeekIndex > 0) {
      this.currentWeekIndex--;
      this.updateWeekLabels();
      this.clearSelection();
    }
  }

  nextWeek(): void {
    if (this.currentWeekIndex < this.weeks.length - 1) {
      this.currentWeekIndex++;
      this.updateWeekLabels();
      this.clearSelection();
    }
  }

  clearSelection(): void {
    this.selectedDate = '';
    this.selectedSlot = null;
    this.availableSlots = [];
  }

  // ==================== SELECTION ====================

  selectDate(date: string): void {
    this.selectedDate = date;
    this.selectedSlot = null;

    // Slots für diesen Tag laden und nochmal validieren
    const day = this.currentWeek.find(d => d.date === date);
    const daySlots = day?.slots || [];

    // Slots nochmal filtern (falls Zeit mittlerweile abgelaufen)
    this.availableSlots = this.filterValidSlots(daySlots);
  }

  selectSlot(slot: BookingSlot): void {
    // Vor dem Auswählen nochmal prüfen ob Slot noch gültig ist
    const slotDateTime = this.getSlotDateTime(slot.date, slot.timeFrom);
    const now = new Date();
    const minDateTime = new Date(now.getTime() + this.MIN_HOURS_ADVANCE * 60 * 60 * 1000);

    if (slotDateTime < minDateTime) {
      this.errorMessage = 'Dieser Slot ist leider nicht mehr verfügbar. Bitte lade die Seite neu.';
      this.loadAvailableSlots();
      return;
    }

    this.selectedSlot = slot;
  }

  getFormattedDate(): string {
    if (!this.selectedDate) return '';
    const date = new Date(this.selectedDate + 'T12:00:00');
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const dayName = this.getDayName(date.getDay());
    return `${dayName}, ${day}.${month}.${year}`;
  }

  getFormattedTime(): string {
    if (!this.selectedSlot) return '';
    return `${this.formatTime(this.selectedSlot.timeFrom)} - ${this.formatTime(this.selectedSlot.timeTo)}`;
  }

  // ==================== BOOKING SUBMIT ====================

  bookAnotherSlot(): void {
    this.bookingSuccessful = false;
    this.bookedSlotDate = '';
    this.bookedSlotTime = '';
    this.loadAvailableSlots();
  }

  backToHome(): void {
    this.router.navigate(['/']);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  submitBooking(): void {
    if (!this.selectedSlot || !this.bookingData.name || !this.bookingData.email) {
      return;
    }

    // Finale Validierung vor dem Absenden
    const slotDateTime = this.getSlotDateTime(this.selectedSlot.date, this.selectedSlot.timeFrom);
    const now = new Date();
    const minDateTime = new Date(now.getTime() + this.MIN_HOURS_ADVANCE * 60 * 60 * 1000);

    if (slotDateTime < minDateTime) {
      this.errorMessage = `Dieser Slot liegt weniger als ${this.MIN_HOURS_ADVANCE} Stunden in der Zukunft. Bitte wähle einen anderen Termin.`;
      this.loadAvailableSlots();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const bookingDto: CreateBookingDto = {
      name: this.bookingData.name.trim(),
      email: this.bookingData.email.trim(),
      phone: this.bookingData.phone?.trim() || undefined,
      message: this.bookingData.message?.trim() || undefined,
      slotId: this.selectedSlot.id
    };

    this.apiService.createBooking(bookingDto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (booking) => {
          // Success Screen anzeigen
          this.bookingSuccessful = true;
          this.bookedSlotDate = this.getFormattedDate();
          this.bookedSlotTime = this.getFormattedTime();
          this.isSubmitting = false;
          this.scrollToTop();

          // Form zurücksetzen (aber Success Screen bleibt)
          this.resetForm();
        },
        error: (error) => {
          console.error('Booking error:', error);
          this.isSubmitting = false;

          if (error.status === 409) {
            this.errorMessage = 'Dieser Slot ist leider nicht mehr verfügbar. Bitte wähle einen anderen Termin.';
          } else if (error.status === 404) {
            this.errorMessage = 'Dieser Slot wurde nicht gefunden. Bitte lade die Seite neu.';
          } else if (error.status === 400) {
            this.errorMessage = 'Ungültige Buchungsdaten. Bitte überprüfe deine Eingaben.';
          } else {
            this.errorMessage = 'Buchung fehlgeschlagen. Bitte versuche es erneut oder kontaktiere uns direkt.';
          }

          // Slots neu laden um aktuelle Verfügbarkeit zu zeigen
          this.loadAvailableSlots();
        }
      });
  }

  resetForm(): void {
    this.selectedDate = '';
    this.selectedSlot = null;
    this.availableSlots = [];
    this.bookingData = {
      name: '',
      email: '',
      phone: '',
      message: ''
    };
  }

  // ==================== HELPER ====================

  getSlotsCountForDay(day: DayWithSlots): number {
    return day.slots.length;
  }

  isFormValid(): boolean {
    return !!(
      this.selectedSlot &&
      this.bookingData.name?.trim() &&
      this.bookingData.email?.trim() &&
      this.isValidEmail(this.bookingData.email)
    );
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}