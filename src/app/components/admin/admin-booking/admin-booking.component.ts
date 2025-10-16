import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import {
  ApiService,
  BookingSlot,
  CreateBookingSlotDto,
  Booking,
  BookingStatus
} from '../../../api/api.service';
import { firstValueFrom } from 'rxjs';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  slots: BookingSlot[];
}

interface SeriesPattern {
  id: 'daily' | 'weekly' | 'workweek' | 'custom';
  name: string;
  icon: string;
}

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminHeaderComponent],
  templateUrl: './admin-booking.component.html',
  styleUrls: ['./admin-booking.component.scss']
})
export class AdminBookingComponent implements OnInit {
  // Data
  slots: BookingSlot[] = [];
  allBookings: Booking[] = [];
  calendarDays: CalendarDay[] = [];

  // UI State
  loading = false;
  loadingCreate = false;
  currentDate = new Date();
  showCreateModal = false;
  selectedSlot: BookingSlot | null = null;
  selectedSlotBookings: Booking[] = [];
  selectedDay: CalendarDay | null = null;

  // Constants (für Template zugänglich)
  BookingStatus = BookingStatus;
  weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  // Filter State
  filters = {
    status: 'all' as 'all' | 'available' | 'booked' | 'unavailable',
    searchText: ''
  };

  // Stats
  stats = {
    total: 0,
    available: 0,
    booked: 0,
    upcoming: 0
  };

  // Series Creation
  seriesPatterns: SeriesPattern[] = [
    { id: 'daily', name: 'Täglich', icon: '📅' },
    { id: 'weekly', name: 'Wöchentlich', icon: '🗓️' },
    { id: 'workweek', name: 'Mo-Fr', icon: '💼' },
    { id: 'custom', name: 'Custom', icon: '⚙️' }
  ];

  quickCreate = {
    pattern: 'daily' as SeriesPattern['id'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: this.getDatePlusWeeks(2),
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 30,
    breakDuration: 0,
    breakAfter: 4,
    // 0=So, 1=Mo, ... 6=Sa
    customDays: [1, 2, 3, 4, 5] as number[]
  };

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.loadSlots();
  }

  // ===== Data Laden & Aufbereiten =====
  async loadSlots(): Promise<void> {
    this.loading = true;
    try {
      const [slots, bookings] = await Promise.all([
        firstValueFrom(this.api.getAllBookingSlots()),
        firstValueFrom(this.api.getAllBookings())
      ]);

      this.slots = slots ?? [];
      this.allBookings = bookings ?? [];
      this.generateCalendar();
      this.calculateStats();
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      this.loading = false;
    }
  }

  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // 1. & letzter Tag des Monats
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Start: Montag der ersten Kalenderwoche
    const startDate = new Date(firstDay);
    const dowStart = startDate.getDay(); // So=0, Mo=1, ..., Sa=6
    const toSubtract = dowStart === 0 ? 6 : dowStart - 1;
    startDate.setDate(startDate.getDate() - toSubtract);

    // Ende: Sonntag der letzten Kalenderwoche
    const endDate = new Date(lastDay);
    const dowEnd = endDate.getDay();
    const toAdd = dowEnd === 0 ? 0 : 7 - dowEnd;
    endDate.setDate(endDate.getDate() + toAdd);

    // Tage generieren
    this.calendarDays = [];
    const cur = new Date(startDate);
    while (cur <= endDate) {
      const dateStr = this.toLocalYMD(cur);

      const daySlots = this.getFilteredSlotsForDate(dateStr);

      this.calendarDays.push({
        date: new Date(cur),
        isCurrentMonth: cur.getMonth() === month,
        slots: daySlots
      });

      cur.setDate(cur.getDate() + 1);
    }
  }

  getFilteredSlotsForDate(date: string): BookingSlot[] {
    let daySlots = this.slots.filter((s) => s.date === date);

    // Status-Filter
    if (this.filters.status !== 'all') {
      daySlots = daySlots.filter((slot) => {
        if (this.filters.status === 'available') {
          return slot.isAvailable && (slot.currentBookings || 0) === 0;
        } else if (this.filters.status === 'booked') {
          return (slot.currentBookings || 0) > 0;
        } else if (this.filters.status === 'unavailable') {
          return !slot.isAvailable;
        }
        return true;
      });
    }

    // Textsuche (über zugehörige Buchungen)
    if (this.filters.searchText.trim()) {
      const search = this.filters.searchText.toLowerCase();
      daySlots = daySlots.filter((slot) => {
        const slotBookings = this.allBookings.filter((b) => b.slotId === slot.id);
        if (slotBookings.length === 0) return false;
        return slotBookings.some(
          (b) =>
            b.name.toLowerCase().includes(search) ||
            b.email.toLowerCase().includes(search) ||
            (!!b.phone && b.phone.toLowerCase().includes(search))
        );
      });
    }

    // Nach Uhrzeit sortieren
    return daySlots.sort((a, b) => a.timeFrom.localeCompare(b.timeFrom));
  }

  getFilteredSlotsCount(): number {
    return this.calendarDays.reduce((sum, d) => sum + d.slots.length, 0);
  }

  calculateStats(): void {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    this.stats.total = this.slots.length;
    this.stats.available = this.slots.filter(s => s.isAvailable && (s.currentBookings || 0) === 0).length;
    this.stats.booked = this.slots.filter(s => (s.currentBookings || 0) > 0).length;
    this.stats.upcoming = this.slots.filter(s => this.parseLocalYMD(s.date) >= today && s.isAvailable).length; // statt new Date(s.date)
  }

  formatDateLongFromDate(d: Date): string {
    return d.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  }



  // ===== Navigation =====
  previousMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.currentDate = new Date(this.currentDate);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.currentDate = new Date(this.currentDate);
    this.generateCalendar();
  }

  goToToday(): void {
    this.currentDate = new Date();
    this.generateCalendar();
  }

  getCurrentMonthYear(): string {
    return this.currentDate.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  }

  isToday(date: Date): boolean {
    const t = new Date();
    return (
      date.getDate() === t.getDate() &&
      date.getMonth() === t.getMonth() &&
      date.getFullYear() === t.getFullYear()
    );
  }

  // ===== Modals =====
  openCreateModal(): void {
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  openSlotModal(slot: BookingSlot): void {
    this.selectedSlot = slot;
    this.selectedSlotBookings = this.allBookings.filter((b) => b.slotId === slot.id);
  }

  closeSlotModal(): void {
    this.selectedSlot = null;
    this.selectedSlotBookings = [];
  }

  openDayModal(day: CalendarDay): void {
    this.selectedDay = day;
  }

  closeDayModal(): void {
    this.selectedDay = null;
  }

  openQuickCreateForDay(date: Date): void {
    const dateStr = this.toLocalYMD(date); // statt toISOString().split('T')[0]
    this.quickCreate.startDate = dateStr;
    this.quickCreate.endDate = dateStr;
    this.openCreateModal();
  }


  // ===== Filter =====
  onFilterChange(): void {
    this.generateCalendar();
  }

  clearFilters(): void {
    this.filters = { status: 'all', searchText: '' };
    this.generateCalendar();
  }

  // ===== Slot-Serien-Erstellung =====
  getDatePlusWeeks(weeks: number): string {
    const date = new Date();
    date.setDate(date.getDate() + weeks * 7);
    return this.toLocalYMD(date); // statt toISOString().split('T')[0]
  }


  generateSeriesSlots(): CreateBookingSlotDto[] {
    const slots: CreateBookingSlotDto[] = [];
    const { pattern, startDate, endDate, startTime, endTime, slotDuration, breakDuration, breakAfter } = this.quickCreate;

    // WICHTIG: lokal parsen (kein new Date('YYYY-MM-DD'))
    const start = this.parseLocalYMD(startDate);
    const end = this.parseLocalYMD(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay(); // So=0..Sa=6
      let shouldInclude = false;
      if (pattern === 'daily') shouldInclude = true;
      else if (pattern === 'workweek') shouldInclude = dayOfWeek >= 1 && dayOfWeek <= 5;
      else if (pattern === 'weekly') shouldInclude = d.getDay() === start.getDay();
      else if (pattern === 'custom') shouldInclude = this.quickCreate.customDays.includes(dayOfWeek);
      if (!shouldInclude) continue;

      const dateStr = this.toLocalYMD(d); // statt d.toISOString().split('T')[0]
      const daySlots = this.generateTimeSlotsForDay(dateStr, startTime, endTime, slotDuration, breakDuration, breakAfter);
      slots.push(...daySlots);
    }
    return slots;
  }


  generateTimeSlotsForDay(
    date: string,
    startTime: string,
    endTime: string,
    slotDuration: number,
    breakDuration: number,
    breakAfter: number
  ): CreateBookingSlotDto[] {
    const slots: CreateBookingSlotDto[] = [];
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    let currentMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    let slotCount = 0;

    while (currentMinutes + slotDuration <= endMinutes) {
      slots.push({
        date,
        timeFrom: this.minutesToTime(currentMinutes),
        timeTo: this.minutesToTime(currentMinutes + slotDuration),
        maxBookings: 1,
        isAvailable: true
      });

      currentMinutes += slotDuration;
      slotCount++;

      if (breakAfter > 0 && slotCount % breakAfter === 0 && breakDuration > 0) {
        currentMinutes += breakDuration;
      }
    }

    return slots;
  }

  minutesToTime(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  toggleCustomDay(day: number): void {
    const idx = this.quickCreate.customDays.indexOf(day);
    if (idx > -1) {
      this.quickCreate.customDays.splice(idx, 1);
    } else {
      this.quickCreate.customDays.push(day);
      this.quickCreate.customDays.sort();
    }
  }

  isCustomDaySelected(day: number): boolean {
    return this.quickCreate.customDays.includes(day);
  }

  getPreviewCount(): number {
    return this.generateSeriesSlots().length;
  }

  async handleCreateSeries(): Promise<void> {
    this.loadingCreate = true;
    try {
      const slots = this.generateSeriesSlots();

      if (slots.length === 0) {
        alert('Keine Slots zum Erstellen vorhanden!');
        return;
      }

      if (slots.length > 200) {
        const proceed = confirm(`Das würde ${slots.length} Slots erstellen. Fortfahren?`);
        if (!proceed) return;
      }

      await firstValueFrom(this.api.createMultipleBookingSlots(slots));
      await this.loadSlots();
      this.closeCreateModal();
      alert(`${slots.length} Slots erfolgreich erstellt!`);
    } catch (err) {
      alert('Fehler beim Erstellen der Slots');
      console.error(err);
    } finally {
      this.loadingCreate = false;
    }
  }

  async handleDeleteSlot(id?: string): Promise<void> {
    if (!id) return;
    if (!confirm('Slot wirklich löschen?')) return;

    try {
      await firstValueFrom(this.api.deleteBookingSlot(id));
      await this.loadSlots();
      this.closeSlotModal();
    } catch (err) {
      alert('Fehler beim Löschen');
      console.error(err);
    }
  }

  async updateBookingStatus(bookingId: string, status: BookingStatus): Promise<void> {
    try {
      await firstValueFrom(this.api.updateBooking(bookingId, { status }));
      await this.loadSlots();

      // Lokalen Zustand aktualisieren
      if (this.selectedSlot) {
        this.selectedSlotBookings = this.allBookings.filter(
          (b) => b.slotId === this.selectedSlot!.id
        );
      }
    } catch (err) {
      alert('Fehler beim Aktualisieren');
      console.error(err);
    }
  }

  // ===== Helper fürs Template =====
  formatTime(time: string): string {
    // Erwartet "HH:mm" oder "H:mm" -> gibt "HH:mm" zurück
    const [h, m] = time.split(':').map(Number);
    return `${String(h ?? 0).padStart(2, '0')}:${String(m ?? 0).padStart(2, '0')}`;
  }

  formatDateLong(dateStr: string): string {
    // Erwartet ISO yyyy-MM-dd
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, (m ?? 1) - 1, d ?? 1);
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  getStatusColor(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.PENDING:
        return '#f59e0b'; // amber
      case BookingStatus.CONFIRMED:
        return '#10b981'; // green
      case BookingStatus.CANCELLED:
        return '#ef4444'; // red
      case BookingStatus.COMPLETED:
        return '#3b82f6'; // blue
      default:
        return '#6b7280'; // gray
    }
  }

  getStatusLabel(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.PENDING:
        return 'Ausstehend';
      case BookingStatus.CONFIRMED:
        return 'Bestätigt';
      case BookingStatus.CANCELLED:
        return 'Storniert';
      case BookingStatus.COMPLETED:
        return 'Abgeschlossen';
      default:
        return 'Unbekannt';
    }
  }

  toLocalYMD(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  parseLocalYMD(ymd: string): Date {
    const [y, m, d] = ymd.split('-').map(Number);
    return new Date(y, (m - 1), d, 0, 0, 0, 0); // lokal, Mitternacht
  }

  getSlotStatusIcon(slot: BookingSlot): string {
    if (!slot.isAvailable) return '🔒';
    if ((slot.currentBookings || 0) > 0) return '📌';
    return '✓';
  }

  getSlotStatusText(slot: BookingSlot): string {
    if (!slot.isAvailable) return 'Gesperrt';
    if ((slot.currentBookings || 0) >= slot.maxBookings) return 'Ausgebucht';
    if ((slot.currentBookings || 0) > 0) return 'Teilweise gebucht';
    return 'Verfügbar';
  }

  getSlotBookings(slot: BookingSlot): Booking[] {
    return this.allBookings.filter((b) => b.slotId === slot.id);
  }

  getBookingNames(slot: BookingSlot): string {
    const bookings = this.getSlotBookings(slot);
    return bookings.map((b) => b.name).join(', ');
  }
}
